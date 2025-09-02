// vite.config.mts
import { defineConfig } from "file:///H:/personal%20project/extensions/devtools/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1/node_modules/vite/dist/node/index.js";
import react from "file:///H:/personal%20project/extensions/devtools/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.3.3_@types+node@20.14.10_sass@1.77.6_terser@5.31.1_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import { watchRebuildPlugin } from "file:///H:/personal%20project/extensions/devtools/packages/hmr/dist/index.js";
var __vite_injected_original_dirname = "H:\\personal project\\extensions\\devtools\\pages\\popup";
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
    outDir: resolve(rootDir, "..", "..", "dist", "popup"),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiSDpcXFxccGVyc29uYWwgcHJvamVjdFxcXFxleHRlbnNpb25zXFxcXGRldnRvb2xzXFxcXHBhZ2VzXFxcXHBvcHVwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJIOlxcXFxwZXJzb25hbCBwcm9qZWN0XFxcXGV4dGVuc2lvbnNcXFxcZGV2dG9vbHNcXFxccGFnZXNcXFxccG9wdXBcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9IOi9wZXJzb25hbCUyMHByb2plY3QvZXh0ZW5zaW9ucy9kZXZ0b29scy9wYWdlcy9wb3B1cC92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgd2F0Y2hSZWJ1aWxkUGx1Z2luIH0gZnJvbSAnQGNocm9tZS1leHRlbnNpb24tYm9pbGVycGxhdGUvaG1yJztcclxuXHJcbmNvbnN0IHJvb3REaXIgPSByZXNvbHZlKF9fZGlybmFtZSk7XHJcbmNvbnN0IHNyY0RpciA9IHJlc29sdmUocm9vdERpciwgJ3NyYycpO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSAndHJ1ZSc7XHJcbmNvbnN0IGlzUHJvZHVjdGlvbiA9ICFpc0RldjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0BzcmMnOiBzcmNEaXIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmFzZTogJycsXHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGlzRGV2ICYmIHdhdGNoUmVidWlsZFBsdWdpbih7IHJlZnJlc2g6IHRydWUgfSldLFxyXG4gIHB1YmxpY0RpcjogcmVzb2x2ZShyb290RGlyLCAncHVibGljJyksXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogcmVzb2x2ZShyb290RGlyLCAnLi4nLCAnLi4nLCAnZGlzdCcsICdwb3B1cCcpLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICBzb3VyY2VtYXA6IGlzRGV2LFxyXG4gICAgbWluaWZ5OiBpc1Byb2R1Y3Rpb24sXHJcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogaXNQcm9kdWN0aW9uLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogWydjaHJvbWUnXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IGlzRGV2ID8gYFwiZGV2ZWxvcG1lbnRcImAgOiBgXCJwcm9kdWN0aW9uXCJgLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJWLFNBQVMsb0JBQW9CO0FBQ3hYLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBUywwQkFBMEI7QUFIbkMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxVQUFVLFFBQVEsZ0NBQVM7QUFDakMsSUFBTSxTQUFTLFFBQVEsU0FBUyxLQUFLO0FBRXJDLElBQU0sUUFBUSxRQUFRLElBQUksWUFBWTtBQUN0QyxJQUFNLGVBQWUsQ0FBQztBQUV0QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxtQkFBbUIsRUFBRSxTQUFTLEtBQUssQ0FBQyxDQUFDO0FBQUEsRUFDakUsV0FBVyxRQUFRLFNBQVMsUUFBUTtBQUFBLEVBQ3BDLE9BQU87QUFBQSxJQUNMLFFBQVEsUUFBUSxTQUFTLE1BQU0sTUFBTSxRQUFRLE9BQU87QUFBQSxJQUNwRCxhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixzQkFBc0I7QUFBQSxJQUN0QixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsUUFBUTtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sd0JBQXdCLFFBQVEsa0JBQWtCO0FBQUEsRUFDcEQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
