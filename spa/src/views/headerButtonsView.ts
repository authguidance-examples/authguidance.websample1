import $ from 'jquery';

/*
 * A simple view for the header buttons
 */
export class HeaderButtonsView {

    private readonly _onHome: () => void;
    private readonly _onExpireToken: () => void;
    private readonly _onReloadData: () => void;

    public constructor(
        onHome: ()  => void,
        onReloadData: () => void,
        onExpireToken: () => void) {

        this._onHome = onHome;
        this._onReloadData = onReloadData;
        this._onExpireToken = onExpireToken;
    }

    /*
     * Render the view
     */
    public load() {

        const html =
            `<div class='row'>
                <div class='col-4 my-2 d-flex'>
                    <button id='btnHome' type='button' class='btn btn-primary btn-block p-1'>Home</button>
                </div>
                <div class='col-4 my-2 d-flex'>
                    <button id='btnReloadData' type='button' disabled class='btn btn-primary btn-block p-1 sessionbutton'>Reload Data</button>
                </div>
                <div class='col-4 my-2 d-flex'>
                    <button id='btnExpireAccessToken' type='button' disabled class='btn btn-primary btn-block p-1 sessionbutton'>Expire Token</button>
                </div>
            </div>`;
        $('#headerbuttons').html(html);

        // Button clicks are handled by the parent class
        $('#btnHome').click(this._onHome);
        $('#btnExpireAccessToken').click(this._onExpireToken);
        $('#btnReloadData').click(this._onReloadData);
    }

    /*
     * Buttons are disabled before data is loaded
     */
    public disableSessionButtons(): void {
        $('.sessionbutton').prop('disabled', true);
    }

    /*
     * Buttons are enabled when all data loads successfully
     */
    public enableSessionButtons(): void {
        $('.sessionbutton').prop('disabled', false);
    }
}
