/*
 * A simple view for the header buttons
 */
export class HeaderButtonsView {

    private readonly _onHome: ()        => void;
    private readonly _onExpireToken: () => void;
    private readonly _onRefreshData: () => void;

    public constructor(
        onHome: ()        => void,
        onExpireToken: () => void,
        onRefreshData: () => void) {

        this._onHome = onHome;
        this._onExpireToken = onExpireToken;
        this._onRefreshData = onRefreshData;
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
                <button id='btnExpireAccessToken' type='button' class='btn btn-primary btn-block p-1 sessionbutton'>Expire Token</button>
            </div>
            <div class='col-4 my-2 d-flex'>
                <button id='btnRefreshData' type='button' class='btn btn-primary btn-block p-1 sessionbutton'>Refresh Data</button>
            </div>
        </div>`;
        $('#headerbuttons').html(html);

        // Button clicks are handled by the parent class
        $('#btnHome').click(this._onHome);
        $('#btnExpireAccessToken').click(this._onExpireToken);
        $('#btnRefreshData').click(this._onRefreshData);
    }
}
