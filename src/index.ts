import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";


// type MergeConfig = (config1: AxiosRequestConfig, config2: AxiosRequestConfig) => AxiosRequestConfig;
type IsAxiosRequestConfig<T> = T extends AxiosRequestConfig ? true : false;

export interface NestApiListConfig {
  [key: string]: string | NestApiListConfig | AxiosRequestConfig | undefined,
}

export interface RequestHandler<T = any> {
  (config?: AxiosRequestConfig, axios?: Axios): Promise<AxiosResponse<T, any>>
}

export type NestApiList<T> = {
  [K in keyof T]: T[K] extends string | IsAxiosRequestConfig<T> ? NestInstance : NestApiList<T[K]>;
}

function bind(fn: any, thisArg: any) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

class Nest {
  private config: AxiosRequestConfig = {};
  public $axios: Axios;
  constructor(config: AxiosRequestConfig, axios: Axios) {
    this.config = config;
    this.$axios = axios;
  }

  private mergeConfig(config: AxiosRequestConfig = {}): AxiosRequestConfig {
    let _config = axios.mergeConfig(config, { ...this.config });
    return _config;
  }

  public request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig = {}) {
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

declare interface NestInstance extends Nest {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
}

export default class AxiosNest {
  public axios: Axios;
  constructor(axios: Axios) {
    this.axios = axios;
  }


  public buildApiList<T extends NestApiListConfig>(config: T): NestApiList<T> {
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

  private createNest(config: AxiosRequestConfig): Nest {
    let context = new Nest(config, this.axios);
    let nest = bind(Nest.prototype.request, context);
    return new Proxy(nest, {
      get(target: any, prop: any) {
        return Reflect.get(context, prop) ?? Reflect.get(context.$axios, prop);
      },
      set(target: any, prop: any, value: any) {
        return Reflect.set(target, prop, value);
      }
    }) as unknown as Nest;
  }


  // public buildApiList<T extends NestApiListConfig>(config: T): NestApiList<T> {
  //   const that = this;
  //   const handler = {
  //     get(target: any, prop: string) {
  //       const value = target[prop];
  //       if (typeof value === 'string') {
  //         return that.createRequestHanlder({
  //           url: value,
  //         });
  //       }
  //       if (typeof value === 'object') {
  //         // 如果对象中有 'url' 属性，返回 Nest 实例
  //         if ('url' in value) {
  //           return that.createRequestHanlder({
  //             ...value,
  //           });
  //         }
  //         // 否则递归处理对象的属性
  //         return new Proxy(value, handler);
  //       }
  //     }
  //   };

  //   return new Proxy(config, handler) as NestApiList<T>;
  // }

  // private createRequestHanlder(config: AxiosRequestConfig) {
  //   const that = this;
  //   return function <T>(userConfig: AxiosRequestConfig, axios?: axios) {
  //     const _config = (axios ?? that.axios).mergeConfig(config, userConfig);
  //     return that.axios.request<T>(_config);
  //   }
  // }


}