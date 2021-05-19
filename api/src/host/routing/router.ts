import {NextFunction, Request, Response} from 'express';
import onHeaders from 'on-headers';
import {ClientError} from '../../logic/errors/clientError';
import {ErrorCodes} from '../../logic/errors/errorCodes';
import {CompanyRepository} from '../../logic/repositories/companyRepository';
import {CompanyService} from '../../logic/services/companyService';
import {JsonFileReader} from '../../logic/utilities/jsonFileReader';
import {Configuration} from '../configuration/configuration';
import {ErrorHandler} from '../errors/errorHandler';
import {Authenticator} from '../oauth/authenticator';
import {IssuerMetadata} from '../oauth/IssuerMetadata';
import {ResponseWriter} from '../utilities/responseWriter';

/*
 * A class to route API requests to business logic classes
 */
export class Router {

    private _apiConfig: Configuration;
    private _issuerMetadata: IssuerMetadata;

    public constructor(apiConfig: Configuration) {
        this._apiConfig = apiConfig;
        this._issuerMetadata = new IssuerMetadata(this._apiConfig.oauth);
        this._setupCallbacks();
    }

    /*
     * Load Open Id Connect metadata at application startup
     */
    public async initialize(): Promise<void> {
        await this._issuerMetadata.load();
    }

    /*
     * The entry point for authorization and claims handling
     */
    public async authorizationHandler(
        request: Request,
        response: Response,
        next: NextFunction): Promise<void> {

        // The first sample does the expensive authentication on every request
        const authenticator = new Authenticator(this._apiConfig.oauth, this._issuerMetadata.issuer);
        const claims = await authenticator.validateToken(request);

        // On success, set claims against the request context and move on to the business logic
        response.locals.claims = claims;
        next();
    }

    /*
     * Return a list of companies
     */
    public async getCompanyList(request: Request, response: Response): Promise<void> {

        // Create the service instance and its dependencies on every API request
        const reader = new JsonFileReader();
        const repository = new CompanyRepository(reader);
        const service = new CompanyService(repository, response.locals.claims);

        // Get the data and return it in the response
        const result = await service.getCompanyList();
        ResponseWriter.writeObjectResponse(response, 200, result);
    }

    /*
     * Return company transactions
     */
    public async getCompanyTransactions(request: Request, response: Response): Promise<void> {

        // Create the service instance and its dependencies on every API request
        const reader = new JsonFileReader();
        const repository = new CompanyRepository(reader);
        const service = new CompanyService(repository, response.locals.claims);

        // Get the supplied id as a number, and return 400 if invalid input was received
        const id = parseInt(request.params.id, 10);
        if (isNaN(id) || id <= 0) {
            throw new ClientError(
                400,
                ErrorCodes.invalidCompanyId,
                'The company id must be a positive numeric integer');
        }

        const result = await service.getCompanyTransactions(id);
        ResponseWriter.writeObjectResponse(response, 200, result);
    }

    /*
     * Remove the ETag header from API responses
     */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    public cacheHandler(
        request: Request,
        response: Response,
        next: NextFunction): void {

        onHeaders(response, () => response.removeHeader('ETag'));
        next();
    }

    /*
     * Handle requests to routes that do not exist
     */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    public notFoundHandler(
        request: Request,
        response: Response,
        next: NextFunction): void {

        // Handle the error to ensure it is logged
        const clientError = ErrorHandler.fromRequestNotFound();
        ErrorHandler.handleError(clientError);

        // Return an error to the client
        ResponseWriter.writeObjectResponse(
            response,
            clientError.statusCode,
            clientError.toResponseFormat());
    }

    /*
     * The entry point for handling exceptions forwards all exceptions to our handler class
     */
    public unhandledExceptionHandler(
        unhandledException: any,
        request: Request,
        response: Response): void {

        // Handlke the error to ensure it is logged
        const clientError = ErrorHandler.handleError(unhandledException);

        // Return an error to the client
        ResponseWriter.writeObjectResponse(
            response,
            clientError.statusCode,
            clientError.toResponseFormat());
    }

    /*
     * Set up async callbacks
     */
    private _setupCallbacks(): void {
        this.authorizationHandler = this.authorizationHandler.bind(this);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.getCompanyTransactions = this.getCompanyTransactions.bind(this);
        this.unhandledExceptionHandler = this.unhandledExceptionHandler.bind(this);
    }
}
