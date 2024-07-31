/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 我们每次添加完新的环境变量就在此添加一次ts类型
  // 这样我们就能在使用 import.meta.env 时获得ts语法提示
  readonly VITE_BASE_URL: string
  readonly VITE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_MOCK_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
