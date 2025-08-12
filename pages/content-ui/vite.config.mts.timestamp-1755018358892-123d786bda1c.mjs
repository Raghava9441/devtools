// vite.config.mts
import { defineConfig } from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1/node_modules/vite/dist/node/index.js";
import react from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { makeEntryPointPlugin, watchRebuildPlugin } from "file:///H:/personal%20project/chrome-extension-boilerplate-react-vite/packages/hmr/dist/index.js";
var __vite_injected_original_dirname = "H:\\personal project\\chrome-extension-boilerplate-react-vite\\pages\\content-ui";
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
  plugins: [react(), isDev && watchRebuildPlugin({ refresh: true }), isDev && makeEntryPointPlugin()],
  publicDir: resolve(rootDir, "public"),
  build: {
    lib: {
      entry: resolve(srcDir, "index.tsx"),
      name: "contentUI",
      formats: ["iife"],
      fileName: "index"
    },
    outDir: resolve(rootDir, "..", "..", "dist", "content-ui"),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSDpcXFxccGVyc29uYWwgcHJvamVjdFxcXFxjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGVcXFxccGFnZXNcXFxcY29udGVudC11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxccGVyc29uYWwgcHJvamVjdFxcXFxjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGVcXFxccGFnZXNcXFxcY29udGVudC11aVxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L3BlcnNvbmFsJTIwcHJvamVjdC9jaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGUvcGFnZXMvY29udGVudC11aS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgbWFrZUVudHJ5UG9pbnRQbHVnaW4sIHdhdGNoUmVidWlsZFBsdWdpbiB9IGZyb20gJ0BjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlL2htcic7XHJcbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcblxyXG5jb25zdCByb290RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUpO1xyXG5jb25zdCBzcmNEaXIgPSByZXNvbHZlKHJvb3REaXIsICdzcmMnKTtcclxuXHJcbmNvbnN0IGlzRGV2ID0gcHJvY2Vzcy5lbnYuX19ERVZfXyA9PT0gJ3RydWUnO1xyXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSAhaXNEZXY7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAc3JjJzogc3JjRGlyLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJhc2U6ICcnLFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBpc0RldiAmJiB3YXRjaFJlYnVpbGRQbHVnaW4oeyByZWZyZXNoOiB0cnVlIH0pLCBpc0RldiAmJiBtYWtlRW50cnlQb2ludFBsdWdpbigpXSxcclxuICBwdWJsaWNEaXI6IHJlc29sdmUocm9vdERpciwgJ3B1YmxpYycpLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IHJlc29sdmUoc3JjRGlyLCAnaW5kZXgudHN4JyksXHJcbiAgICAgIG5hbWU6ICdjb250ZW50VUknLFxyXG4gICAgICBmb3JtYXRzOiBbJ2lpZmUnXSxcclxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXHJcbiAgICB9LFxyXG4gICAgb3V0RGlyOiByZXNvbHZlKHJvb3REaXIsICcuLicsICcuLicsICdkaXN0JywgJ2NvbnRlbnQtdWknKSxcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgc291cmNlbWFwOiBpc0RldixcclxuICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uLFxyXG4gICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGlzUHJvZHVjdGlvbixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsnY2hyb21lJ10sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBpc0RldiA/IGBcImRldmVsb3BtZW50XCJgIDogYFwicHJvZHVjdGlvblwiYCxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvYSxTQUFTLG9CQUFvQjtBQUNqYyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsc0JBQXNCLDBCQUEwQjtBQUh6RCxJQUFNLG1DQUFtQztBQU16QyxJQUFNLFVBQVUsUUFBUSxnQ0FBUztBQUNqQyxJQUFNLFNBQVMsUUFBUSxTQUFTLEtBQUs7QUFFckMsSUFBTSxRQUFRLFFBQVEsSUFBSSxZQUFZO0FBQ3RDLElBQU0sZUFBZSxDQUFDO0FBRXRCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLG1CQUFtQixFQUFFLFNBQVMsS0FBSyxDQUFDLEdBQUcsU0FBUyxxQkFBcUIsQ0FBQztBQUFBLEVBQ2xHLFdBQVcsUUFBUSxTQUFTLFFBQVE7QUFBQSxFQUNwQyxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsUUFBUSxXQUFXO0FBQUEsTUFDbEMsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU07QUFBQSxNQUNoQixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsUUFBUSxRQUFRLFNBQVMsTUFBTSxNQUFNLFFBQVEsWUFBWTtBQUFBLElBQ3pELGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLHNCQUFzQjtBQUFBLElBQ3RCLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxRQUFRO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTix3QkFBd0IsUUFBUSxrQkFBa0I7QUFBQSxFQUNwRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
