import {ApiClient} from '../api/client/apiClient';
import {Configuration} from '../configuration/configuration';
import {ConfigurationLoader} from '../configuration/configurationLoader';
import {Authenticator} from '../plumbing/oauth/authenticator';
import {OidcLogger} from '../plumbing/utilities/oidcLogger';
import {ErrorView} from '../views/errorView';
import {HeaderButtonsView} from '../views/headerButtonsView';
import {Router} from '../views/router';
import {TitleView} from '../views/titleView';

/*
 * The application class
 */
class App {

    private _configuration?: Configuration;
    private _authenticator?: Authenticator;
    private _apiClient?: ApiClient;
    private _oidcLogger: OidcLogger;
    private _router?: Router;
    private _titleView!: TitleView;
    private _headerButtonsView?: HeaderButtonsView;
    private _errorView?: ErrorView;
    private _isInitialised: boolean;

    public constructor() {
        this._isInitialised = false;
        this._oidcLogger = new OidcLogger();
        this._setupCallbacks();
    }

    /*
     * The entry point for the SPA
     */
    public async execute(): Promise<void> {

        try {
            // Start listening for hash changes
            window.onhashchange = this._onHashChange;

            // Do the initial render
            this._initialRender();

            // Do one time app initialisation
            await this._initialiseApp();

            // We must be prepared for page invocation to be an OAuth login response
            await this._handleLoginResponse();

            // Attempt to load data from the API, which may trigger a login redirect
            await this._loadMainView();

        } catch (e) {

            // Render the error view if there are problems
            this._errorView?.report(e);
        }
    }

    /*
     * Render views in their initial state
     */
    private _initialRender() {

        this._titleView = new TitleView();
        this._titleView.load();

        this._headerButtonsView = new HeaderButtonsView(this._onHome, this._onReloadData, this._onExpireToken);
        this._headerButtonsView.load();

        this._errorView = new ErrorView();
        this._errorView.load();
    }

    /*
     * Initialise the app
     */
    private async _initialiseApp(): Promise<void> {

        // Download application configuration
        this._configuration = await ConfigurationLoader.download('spa.config.json');

        // Initialise our OIDC Client wrapper
        this._authenticator = new Authenticator(this._configuration.oauth);

        // Create a client to reliably call the API
        this._apiClient = new ApiClient(this._configuration.app.apiBaseUrl, this._authenticator);

        // Our simple router passes the API Client instance between views
        this._router = new Router(this._apiClient, this._errorView!);

        // Update state to indicate that global objects are loaded
        this._isInitialised = true;
    }

    /*
     * Handle login responses on page load and also render user info if we have tokens
     */
    private async _handleLoginResponse(): Promise<void> {

        await this._authenticator!.handleLoginResponse();
        this._titleView.loadUserInfo(this._authenticator!);
    }

    /*
     * Load API data for the main view and update UI controls
     */
    private async _loadMainView(): Promise<void> {

        this._headerButtonsView!.disableSessionButtons();
        await this._router!.loadView();
        this._headerButtonsView!.enableSessionButtons();
    }

    /*
     * Change the view based on the hash URL and catch errors
     */
    private async _onHashChange(): Promise<void> {

        // Handle updates to log levels when the URL log setting is changed
        this._oidcLogger.updateLogLevelIfRequired();

        try {

            // Update the main view when the hash location changes
            if (this._isInitialised) {
                await this._loadMainView();
            }

        } catch (e) {

            // Report failures
            this._errorView!.report(e);
        }
    }

    /*
     * The home button moves to the home view but also deals with error recovery
     */
    private async _onHome(): Promise<void> {

        try {

            // If we have not initialised, re-initialise the app
            if (!this._isInitialised) {
                await this._initialiseApp();
            }

            if (this._isInitialised) {

                if (this._router!.isInHomeView()) {

                    // Force a reload if we are already in the home view
                    await this._router!.loadView();

                } else {

                    // Otherwise move to the home view
                    location.hash = '#';
                }
            }

        } catch (e) {
            this._errorView!.report(e);
        }
    }

    /*
     * Force data reload
     */
    private async _onReloadData(): Promise<void> {

        try {
            // Try to reload data
            await this._loadMainView();

        } catch (e) {

            // Report failures
            this._errorView!.report(e);
        }
    }

    /*
     * Force a new access token to be retrieved
     */
    private async _onExpireToken(): Promise<void> {
        await this._authenticator!.expireAccessToken();
    }

    /*
     * Plumbing to ensure that the this parameter is available in async callbacks
     */
    private _setupCallbacks(): void {
        this._initialiseApp = this._initialiseApp.bind(this);
        this._handleLoginResponse = this._handleLoginResponse.bind(this);
        this._loadMainView = this._loadMainView.bind(this);
        this._onHashChange = this._onHashChange.bind(this);
        this._onHome = this._onHome.bind(this);
        this._onReloadData = this._onReloadData.bind(this);
        this._onExpireToken = this._onExpireToken.bind(this);
    }
}

/*
 * Run the application
 */
const app = new App();
app.execute();
