import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['test/http/controllers/**', 'prisma']],
    dir: 'test', // Essa linha é opcional, mas é recomendado que você a utilize para que o vitest saiba onde procurar os testes
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
