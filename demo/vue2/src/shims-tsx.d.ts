import Vue, { VNode } from 'vue'
import api from './api/index'

declare global {
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass extends Vue { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $api: typeof api
  }
}