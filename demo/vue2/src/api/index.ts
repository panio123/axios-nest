import axios from "axios";
import AxiosNest from 'axios-nest';
import config from "./list";
import Vue from "vue";

let _axios = axios.create();

let axiosNest = new AxiosNest(_axios);

let api = axiosNest.buildApiList(config);
Vue.prototype.$api = api;

export default api;