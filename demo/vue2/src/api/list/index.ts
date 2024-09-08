import { NestApiListConfig } from 'axios-nest/dist/nest';
import common from './common';
import order from './order';

let config: NestApiListConfig = {
  common,
  order,
}

export default config;