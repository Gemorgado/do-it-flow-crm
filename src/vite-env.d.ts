
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONEXA_BASE_URL: string;
  readonly VITE_CONEXA_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
