import gulp from 'gulp';
import fs from 'fs';
import { exec } from 'gulp-execa';
import ts from 'gulp-typescript';
import rollup from 'rollup';
import rollupTs from 'rollup-plugin-typescript2';

const clean = async function() {
  if (fs.existsSync('dist')) {
    await exec('rm -r dist');
  }
}

const buildEsm = async function() {
  const tsProject = ts.createProject('./tsconfig.json');

  return gulp.src('src/*.ts')
  .pipe(tsProject())
  .pipe(gulp.dest('dist/esm'));
}

const buildLib = async function() {
  const tsProject = ts.createProject('./tsconfig.json', { module: 'commonjs' });
  return gulp.src('src/*.ts')
  .pipe(tsProject())
  .pipe(gulp.dest('dist/lib'));
}

const buildUmd = async function () {}

const buildUmdMin = async function () {}

export const bundle = gulp.series(clean, gulp.parallel(buildEsm, buildLib));

export const pkg = gulp.series(clean, gulp.parallel(buildEsm, buildLib));