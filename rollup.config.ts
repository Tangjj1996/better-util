import { defineConfig } from 'rollup'
import tyepscript from 'rollup-plugin-typescript2'

export default defineConfig([{
    input: './src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: "cjs",
    },
    plugins: [tyepscript()]
}])