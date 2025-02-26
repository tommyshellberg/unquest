// Reexport the native module. On web, it will be resolved to LockStateModule.web.ts
// and on native platforms to LockStateModule.ts
export { default } from "./src/LockStateModule";
export * from "./src/LockState.types";
