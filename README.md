# axios-nest 

## 为了更方便的管理接口，自己弄了这么个插件

### 示例：

```js
/**
 * /api/api-list.js
 */
export default {
  //直接配置`url`，默认为`get`请求
  login: "/user/login",
  //可以嵌套
  order: {
    list: "/order/list",
    info: "/order/info",
  },
  /**
   * 也可以直接配置 axios `RequestConfig`
   * 
   * 当出现`url`属性时，插件判定这是一个`RequestConfig`
   */
  upload: {
    url: "/upload/img",
    method: 'post',
    onUploadProgress: function () {
      // Do whatever you want with the Axios progress event
    },
  }
}

```

```js
/**
 * /api/index.js
 */
import apiList from './api-list.js'

let axios = axios.create({
  baseURL:'./api'
});

let axiosNest = new AxiosNest(axios);

let $api = axiosNest.buildApiList(apiList);

export default $api;

```

```js
import $api from '/api/index.js';

$api.login({
  data:{}
}).then();

//发起默认的`get`请求
await $api.order.list({});

//可以发起指定的请求
//插件由TS编写，使用时自带属性提示功能，嵌套再多也不怕
await $api.order.list.post(data,{});
await $api.order.list.get(params,{});

await $api.upload({
  data:formData
})

```

### 原理简述：

#### 假如这是你提供的 api 配置对象


```js
export default {
  login: "/user/login",
  order: {
    list: "/order/list",
    info: "/order/info",
  },
  upload: {
    url: "/upload/img",
    method: 'post',
  }
}

```

#### 通过`axiosNest`处理后，你得到的

```js
export default {
  login: axios,
  order: {
    list: axios,
    info: axios,
  },
  upload: axios
}

```

### 希望能帮到大家，让api管理更加整洁