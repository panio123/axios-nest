import { NestApiListConfig } from "axios-nest";

const common: NestApiListConfig = {
  login: "/user/login",
  upload: {
    img: "/upload/img",
    video: {
      method: 'get',
    }
  }
}

export default common;