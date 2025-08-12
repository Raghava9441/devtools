// vite.config.mts
import { defineConfig } from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1/node_modules/vite/dist/node/index.js";
import react from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { watchRebuildPlugin } from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/packages/hmr/dist/index.js";
var __vite_injected_original_dirname = "H:\\personal project\\chrome-extension-boilerplate-react-vite\\pages\\new-tab";
var rootDir = resolve(__vite_injected_original_dirname);
var srcDir = resolve(rootDir, "src");
var isDev = process.env.__DEV__ === "true";
var isProduction = !isDev;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": srcDir
    }
  },
  base: "",
  plugins: [react(), isDev && watchRebuildPlugin({ refresh: true })],
  publicDir: resolve(rootDir, "public"),
  build: {
    outDir: resolve(rootDir, "..", "..", "dist", "new-tab"),
    emptyOutDir: true,
    sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      external: ["chrome"]
    }
  },
  define: {
    "process.env.NODE_ENV": isDev ? `"development"` : `"production"`
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSDpcXFxccGVyc29uYWwgcHJvamVjdFxcXFxjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGVcXFxccGFnZXNcXFxcbmV3LXRhYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxccGVyc29uYWwgcHJvamVjdFxcXFxjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGVcXFxccGFnZXNcXFxcbmV3LXRhYlxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L3BlcnNvbmFsJTIwcHJvamVjdC9jaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGUvcGFnZXMvbmV3LXRhYi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgd2F0Y2hSZWJ1aWxkUGx1Z2luIH0gZnJvbSAnQGNocm9tZS1leHRlbnNpb24tYm9pbGVycGxhdGUvaG1yJztcclxuXHJcbmNvbnN0IHJvb3REaXIgPSByZXNvbHZlKF9fZGlybmFtZSk7XHJcbmNvbnN0IHNyY0RpciA9IHJlc29sdmUocm9vdERpciwgJ3NyYycpO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSAndHJ1ZSc7XHJcbmNvbnN0IGlzUHJvZHVjdGlvbiA9ICFpc0RldjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0BzcmMnOiBzcmNEaXIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmFzZTogJycsXHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGlzRGV2ICYmIHdhdGNoUmVidWlsZFBsdWdpbih7IHJlZnJlc2g6IHRydWUgfSldLFxyXG4gIHB1YmxpY0RpcjogcmVzb2x2ZShyb290RGlyLCAncHVibGljJyksXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogcmVzb2x2ZShyb290RGlyLCAnLi4nLCAnLi4nLCAnZGlzdCcsICduZXctdGFiJyksXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgIHNvdXJjZW1hcDogaXNEZXYsXHJcbiAgICBtaW5pZnk6IGlzUHJvZHVjdGlvbixcclxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBpc1Byb2R1Y3Rpb24sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbJ2Nocm9tZSddLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogaXNEZXYgPyBgXCJkZXZlbG9wbWVudFwiYCA6IGBcInByb2R1Y3Rpb25cImAsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlosU0FBUyxvQkFBb0I7QUFDeGIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixTQUFTLDBCQUEwQjtBQUhuQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFNLFVBQVUsUUFBUSxnQ0FBUztBQUNqQyxJQUFNLFNBQVMsUUFBUSxTQUFTLEtBQUs7QUFFckMsSUFBTSxRQUFRLFFBQVEsSUFBSSxZQUFZO0FBQ3RDLElBQU0sZUFBZSxDQUFDO0FBRXRCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLG1CQUFtQixFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFBQSxFQUNqRSxXQUFXLFFBQVEsU0FBUyxRQUFRO0FBQUEsRUFDcEMsT0FBTztBQUFBLElBQ0wsUUFBUSxRQUFRLFNBQVMsTUFBTSxNQUFNLFFBQVEsU0FBUztBQUFBLElBQ3RELGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLHNCQUFzQjtBQUFBLElBQ3RCLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxRQUFRO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTix3QkFBd0IsUUFBUSxrQkFBa0I7QUFBQSxFQUNwRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
