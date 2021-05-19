import {Authenticator} from '../plumbing/oauth/authenticator';
import {DomUtils} from './domUtils';
import {UserInfoView} from './userInfoView';

/*
 * The title view
 */
export class TitleView {

    private readonly _userInfoView: UserInfoView;

    public constructor() {
        this._userInfoView = new UserInfoView();
    }

    /*
     * Render the title HTML
     */
    public load(): void {

        const html =
            `<div class='row'>
                <div class='col-8 my-auto'>
                    <h2>OAuth Demo App</h2>
                </div>
                <div class='col-4 my-auto'>
                    <div class='text-right mx-auto'>
                        <p id='username' class='font-weight-bold'></p>
                    </div>
                </div>
            </div>`;
        DomUtils.html('#title', html);
    }

    /*
     * Load the child user info view when requested
     */
    public async loadUserInfo(authenticator: Authenticator): Promise<void> {
        await this._userInfoView.load(authenticator);
    }
}
