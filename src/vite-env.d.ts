/// <reference types="vite/client" />
declare module "vue-router"

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly API_URL: string
  // 更多环境变量...
}
