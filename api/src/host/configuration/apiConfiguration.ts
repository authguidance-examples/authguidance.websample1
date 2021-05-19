/*
 * A holder for application settings
 */
export interface ApiConfiguration {
    port: number;
    trustedOrigins: string[];
    useProxy: boolean;
    proxyUrl: string;
}
