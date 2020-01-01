import cors from 'cors';
import {Application, NextFunction, Request, Response} from 'express';
import path from 'path';
import url from 'url';
import {Configuration} from '../configuration/configuration';
import {Router} from '../routing/router';
import {ApiLogger} from '../utilities/apiLogger';

/*
 * The relative path to web files
 */
const WEB_FILES_ROOT = '../../../..';

/*
 * Configure behaviour of the HTTP server during application startup
 */
export class HttpServerConfiguration {

    private readonly _expressApp: Application;
    private readonly _configuration: Configuration;
    private readonly _router: Router;

    public constructor(expressApp: Application, configuration: Configuration) {
        this._expressApp = expressApp;
        this._configuration = configuration;
        this._router = new Router(this._configuration);
    }

    /*
     * Set up Web API routes and initialize the API
     */
    public async initializeApi(): Promise<void> {

        // We don't want API requests to be cached unless explicitly designed for caching
        this._expressApp.set('etag', false);

        // Allow cross origin requests from the SPA
        const corsOptions = { origin: this._configuration.api.trustedOrigins };
        this._expressApp.use('/api/*', cors(corsOptions));

        // All API requests are authorized first
        this._expressApp.use('/api/*', this._catch(this._router.authorizationHandler));

        // API routes containing business logic
        this._expressApp.get('/api/companies', this._catch(this._router.getCompanyList));
        this._expressApp.get('/api/companies/:id/transactions', this._catch(this._router.getCompanyTransactions));

        // Our exception middleware handles all exceptions
        this._expressApp.use('/api/*', this._router.unhandledExceptionHandler);

        // Prepare the API to handle secured requests
        await this._router.initialize();
    }

    /*
     * Set up listening for web content
     */
    public initializeWebStaticContentHosting(): void {

        this._expressApp.get('/spa/*', this._getWebResource);
        this._expressApp.get('/spa', this._getWebRootResource);
        this._expressApp.get('/favicon.ico', this._getFavicon);
    }

    /*
     * Start serving requests
     */
    public startListening(): void {

        // Use the web URL to determine the port
        const webUrl = url.parse(this._configuration.api.trustedOrigins[0]);

        // Calculate the port from the URL
        let port = 80;
        if (webUrl.port) {
            port = Number(webUrl.port);
        }

        // Start listening on HTTP
        this._expressApp.listen(port, () => {
            ApiLogger.info(`Server is listening on HTTP port ${port}`);
        });
    }

    /*
     * Deal with Express unhandled promise exceptions during async API requests
     * https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
     */
    private _catch(fn: any): any {

        return (request: Request, response: Response, next: NextFunction) => {

            Promise
                .resolve(fn(request, response, next))
                .catch((e) => {
                    this._router.unhandledExceptionHandler(e, request, response);
                });
        };
    }

    /*
     * Serve up the requested web file
     */
    private _getWebResource(request: Request, response: Response): void {

        let resourcePath = request.path.replace('spa/', '');
        if (resourcePath === '/') {
           resourcePath = 'index.html';
        }

        const webFilePath = path.join(`${__dirname}/${WEB_FILES_ROOT}/spa/${resourcePath}`);
        response.sendFile(webFilePath);
    }

    /*
     * Serve up the requested web file
     */
    private _getWebRootResource(request: Request, response: Response): void {

        const webFilePath = path.join(`${__dirname}/${WEB_FILES_ROOT}/spa/index.html`);
        response.sendFile(webFilePath);
    }

    /*
     * Serve up our favicon
     */
    private _getFavicon(request: Request, response: Response): void {

        const webFilePath = path.join(`${__dirname}/${WEB_FILES_ROOT}/spa/favicon.ico`);
        response.sendFile(webFilePath);
    }
}
