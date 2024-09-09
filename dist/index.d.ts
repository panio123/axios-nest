import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
export type IsAxiosRequestConfig<T> = T extends AxiosRequestConfig ? true : false;
export interface NestApiListConfig {
    [key: string]: string | NestApiListConfig | AxiosRequestConfig | undefined;
}
export type NestApiList<T> = {
    [K in keyof T]: T[K] extends string | IsAxiosRequestConfig<T> ? NestHandler : NestApiList<T[K]>;
};
export interface RequestHandler<T = any> {
    (config?: AxiosRequestConfig, axios?: Axios): Promise<AxiosResponse<T, any>>;
}
export interface NestHandler<T = any, R = AxiosResponse<T>, D = any> extends Nest {
    (config: AxiosRequestConfig<D>): Promise<R>;
    $axios: Axios;
}
declare class Nest {
    config: AxiosRequestConfig;
    $axios: Axios;
    constructor(config: AxiosRequestConfig, axios: Axios);
    private mergeConfig;
    request<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    getUri(config?: AxiosRequestConfig): string;
}
export default class AxiosNest {
    axios: Axios;
    constructor(axios: Axios);
    buildApiList<T extends Record<string, any>>(config: T): NestApiList<T>;
    private createNest;
}
export {};
//# sourceMappingURL=index.d.ts.map