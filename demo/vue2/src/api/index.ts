import axios from "axios";
import AxiosNest from 'axios-nest';
import config from "./list";
import Vue from "vue";

let _axios = axios.create();

let axiosNest = new AxiosNest(_axios);

// Vue.prototype.$api = axiosNest.buildApiList(config);
