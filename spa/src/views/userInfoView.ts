import mustache from 'mustache';
import {Authenticator} from '../plumbing/oauth/authenticator';
import {DomUtils} from './domUtils';

/*
 * The user info view shows the logged in user
 */
export class UserInfoView {

    /*
     * Run the view, which will get user info from the authenticator's session storage
     */
    public async load(authenticator: Authenticator): Promise<void> {

        const claims = await authenticator.getUserInfo();
        if (claims && claims.givenName && claims.familyName) {

            // Set claims if found
            const text = mustache.render('{{givenName}} {{familyName}}', claims);
            DomUtils.text('#username', text);

        } else {

            // Blank out otherwise
            DomUtils.text('#username', '');
        }
    }
}
