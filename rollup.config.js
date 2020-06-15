import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import vuetify from 'rollup-plugin-vuetify';
import svg from 'rollup-plugin-svg';
import esbuild from 'rollup-plugin-esbuild';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import { eslint } from 'rollup-plugin-eslint';

const production = !process.env.ROLLUP_WATCH;
const port = 8080;

export default {
  input: 'src/main.js',
  output: {
    file: 'public/assets/app.js',
    format: 'iife',
    sourcemap: false,
    name: 'app'
  },
  plugins: [
    scss(),
    vue({ css: false }),
    svg(),
    vuetify(),
    eslint({ throwOnError: true, exclude: '*/app.js' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD': JSON.stringify('web')
    }),
    resolve({ extensions: ['.js', '.vue'], browser: true, preferBuiltins: true }),
    commonjs(),
    esbuild({
      minify: production,
      target: 'es2015'
    }),
    !production &&
      serve({
        open: true,
        contentBase: 'public',
        historyApiFallback: true,
        port
      }),
    !production && livereload({ watch: 'public' })
  ]
};
