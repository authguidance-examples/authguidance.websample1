/*
 * The claims class for the first sample
 */
export class SampleClaims {

    // The immutable user id from the access token
    private _userId: string;

    // OAuth scopes can represent high level areas of the business
    private _scopes: string[];

    public constructor(userId: string, scopes: string[]) {
        this._userId = userId;
        this._scopes = scopes;
    }

    public get userId(): string {
        return this._userId;
    }

    public get scopes(): string[] {
        return this._scopes;
    }
}
