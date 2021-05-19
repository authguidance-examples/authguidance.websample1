import {SampleClaims} from '../entities/sampleClaims';
import {Company} from '../entities/company';
import {CompanyTransactions} from '../entities/companyTransactions';
import {ClientError} from '../errors/clientError';
import {ErrorCodes} from '../errors/errorCodes';
import {CompanyRepository} from '../repositories/companyRepository';

/*
 * Our service layer class applies logic before returning data
 */
export class CompanyService {

    private readonly _repository: CompanyRepository;
    private readonly _claims: SampleClaims;

    public constructor(repository: CompanyRepository, claims: SampleClaims) {
        this._repository = repository;
        this._claims = claims;
    }

    /*
     * Return the list of companies
     */
    public async getCompanyList(): Promise<Company[]> {
        return this._repository.getCompanyList();
    }

    /*
     * Return the transaction details for a company
     */
    public async getCompanyTransactions(id: number): Promise<CompanyTransactions> {

        // Forward to the repository class
        const data = await this._repository.getCompanyTransactions(id);

        // If the data is not found we return an unauthorized response
        if (!data) {
            throw this._unauthorizedError(id);
        }

        return data;
    }

    /*
     * Return a 404 error if a company is requested that is outside an allowed range
     */
    private _unauthorizedError(companyId: number): ClientError {
        return new ClientError(
            404,
            ErrorCodes.companyNotFound,
            `Company ${companyId} was not found for this user`);
    }
}
