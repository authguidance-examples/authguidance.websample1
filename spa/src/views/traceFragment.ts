import * as $ from 'jquery';
import * as Oidc from 'oidc-client';
import {HtmlEncoder} from '../plumbing/utilities/htmlEncoder';
import {OAuthLogger} from '../plumbing/utilities/oauthLogger';

/*
 * The trace fragment shows within a view to render OIDC library details
 */
export class TraceFragment {

    /*
     * Initialize trace controls at application startup
     */
    public static initialize(): void {

        // Initialise the logger and get the level
        const level = OAuthLogger.initialize(TraceFragment._append);

        // Clear the log initially
        TraceFragment.clear();

        // Hide or show trace details depending on the level
        TraceFragment._setTraceVisibility(level);

        // Hide the trace button until we have output
        const clearButton = $('#btnTrace');
        clearButton.addClass('hide');
    }

    /*
     * If the URL has changed to a value such as #log=info then we change the OIDC Client logging level accordingly
     */
    public static updateLevelIfRequired() {
        const level = OAuthLogger.updateLevelIfRequired();
        TraceFragment._setTraceVisibility(level);
    }

    /*
     * Clear trace output
     */
    public static clear(): void {

        // Remove output
        const traceList = $('#trace');
        traceList.html('');

        // Hide the clear button since there is nothing to clear
        const clearButton = $('#btnClearTrace');
        clearButton.addClass('hide');
    }

    /*
     * Change the output state depending on the entered log level
     */
    private static _setTraceVisibility(level: number) {

        const traceContainer = $('.tracecontainer');
        if (level === Oidc.Log.NONE) {
            traceContainer.addClass('hide');
        } else {
            traceContainer.removeClass('hide');
        }
    }

    /*
     * Append to log output
     */
    private static _append(prefix: string, args: any): void {

        // Get the output
        const text = HtmlEncoder.encode(Array.prototype.slice.call(args).join(' : '));
        const html = `<b>${prefix}</b> : ${text}`;

        // Make sure any trace info is routed to the main window
        const traceList = $('#trace');
        traceList.append($('<li>').html(html));

        // Make sure the trace button is visible when there is output
        const clearButton = $('#btnClearTrace');
        if (clearButton.hasClass('hide')) {
            clearButton.removeClass('hide');
        }
    }
}
