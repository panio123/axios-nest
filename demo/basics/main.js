let axios = window.axios.create();

let axiosNest = new AxiosNest(axios);

let $api = axiosNest.buildApiList({
  login: "/user/login",
  order: {
    list: "/order/list",
    info: "/order/info",
  },
  upload: {
    url: "/upload/img",
    method: 'post',
    onUploadProgress: function ({ loaded, total, progress, bytes, estimated, rate, upload = true }) {
      // Do whatever you want with the Axios progress event
    },
  }
})

