import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";

export type IsAxiosRequestConfig<T> = T extends AxiosRequestConfig ? true : false;

export interface NestApiListConfig {
  [key: string]: string | NestApiListConfig | AxiosRequestConfig | undefined,
}
export type NestApiList<T> = {
  [K in keyof T]: T[K] extends string | IsAxiosRequestConfig<T> ? NestHandler : NestApiList<T[K]>;
}
export interface RequestHandler<T = any> {
  (config?: AxiosRequestConfig, axios?: Axios): Promise<AxiosResponse<T, any>>
}
export interface NestHandler<T = any, R = AxiosResponse<T>, D = any> extends Nest {
  (config: AxiosRequestConfig<D>): Promise<R>;
  $axios: Axios;
}


function bind(fn: any, thisArg: any) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

class Nest {
  public config: AxiosRequestConfig = {};
  public $axios: Axios;
  constructor(config: AxiosRequestConfig, axios: Axios) {
    this.config = config;
    this.$axios = axios;
  }

  private mergeConfig(config: AxiosRequestConfig = {}): AxiosRequestConfig {
    // @ts-ignore
    let _config = Object.assign({ ...this.config, ...config });
    console.log(_config, this.config, config, _config === config)
    return _config;
  }

  public request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> = {}) {
    return this.$axios.request<T, R, D>(this.mergeConfig(config));
  }

  public get<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> = {}) {
    config.method = 'get';
    return this.request<T, R, D>(this.mergeConfig(config));
  }
  public delete<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> = {}) {
    config.method = 'delete';
    return this.request<T, R, D>(this.mergeConfig(config));
  }
  public head<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> = {}) {
    config.method = 'head';
    return this.request<T, R, D>(this.mergeConfig(config));
  }

  public options<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D> = {}) {
    config.method = 'options';
    return this.request<T, R, D>(this.mergeConfig(config));
  }

  public post<T = any, R = AxiosResponse<T>, D = any>(data?: D, config: AxiosRequestConfig<D> = {}) {
    config.method = 'post';
    config.data = data;
    return this.request<T, R, D>(this.mergeConfig(config));
  }
  public put<T = any, R = AxiosResponse<T>, D = any>(data?: D, config: AxiosRequestConfig<D> = {}) {
    config.method = 'put';
    config.data = data;
    return this.request<T, R, D>(this.mergeConfig(config));
  }

  public patch<T = any, R = AxiosResponse<T>, D = any>(data?: D, config: AxiosRequestConfig<D> = {}) {
    config.method = 'patch';
    config.data = data;
    return this.request<T, R, D>(this.mergeConfig(config));
  }

  public getUri(config: AxiosRequestConfig = {}) {
    return this.$axios.getUri(this.mergeConfig(config));
  }

}

export default class AxiosNest {
  public axios: Axios;
  constructor(axios: Axios) {
    this.axios = axios;
  }


  public buildApiList<T extends Record<string, any>>(config: T): NestApiList<T> {
    const that = this;
    const handler = {
      get(target: any, prop: string) {
        if (prop === '$axios') {
          return that.axios;
        }
        const value = target[prop];
        if (typeof value === 'string') {
          return that.createNest({ url: value });
        }
        if (typeof value === 'object') {
          // 如果对象中有 'url' 属性，返回 Nest 实例
          if ('url' in value) {
            return that.createNest({ ...value });
          }
          // 否则递归处理对象的属性
          return new Proxy(value, handler);
        }
      }
    };

    return new Proxy(config, handler) as NestApiList<T>;
  }

  private createNest(config: AxiosRequestConfig): NestHandler {
    let context = new Nest(config, this.axios);
    let nest: NestHandler = bind(Nest.prototype.request, context) as unknown as NestHandler;
    nest.$axios = this.axios;
    return new Proxy(nest, {
      get(target: any, prop: any) {
        return Reflect.get(context, prop);
      },
      set(target: any, prop: any, value: any) {
        return Reflect.set(target, prop, value);
      }
    }) as unknown as NestHandler;
  }

}