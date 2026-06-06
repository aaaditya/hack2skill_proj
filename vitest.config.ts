import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/features/**/*.ts", "src/lib/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/types/**"],
    },
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});
