/* eslint-disable @typescript-eslint/ban-types */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  interface Vue {
    $microSPA: boolean
  }

  const component: DefineComponent<{}, {}, any>
  export default component
}
