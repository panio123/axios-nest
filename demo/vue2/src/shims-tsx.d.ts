import Vue, { VNode } from 'vue'

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
  // 3. 声明为 Vue 补充的东西
  interface VueConstructor {
    $myProperty: string
  }
}