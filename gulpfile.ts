import gulp from "gulp";
import fs from "fs";
import ts from "gulp-typescript";
import rollupTs from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import rollupRs, { DEFAULTS } from "@rollup/plugin-node-resolve";
import rollupCom from "@rollup/plugin-commonjs";

const clean = async function () {
  if (fs.existsSync("dist")) {
    const { exec } = await import("gulp-execa");
    await exec("rm -r dist");
  }
};

const buildEsm = async function () {
  const tsProject = ts.createProject("./tsconfig.json");

  return gulp.src("src/*.ts").pipe(tsProject()).pipe(gulp.dest("dist/esm"));
};

const buildLib = async function () {
  const tsProject = ts.createProject("./tsconfig.json", { module: "commonjs" });
  return gulp.src("src/*.ts").pipe(tsProject()).pipe(gulp.dest("dist/lib"));
};

const buildUmd = async function () {
  const rollup = await import("rollup");
  const bundle = await rollup.rollup({
    input: "./src/index.ts",
  });

  const { extensions } = DEFAULTS;

  bundle.write({
    file: "/dist/betterUtil.umd.js",
    format: "umd",
    name: "betterUtil",
    sourcemap: true,
    plugins: [rollupTs()],
  });
};

const buildUmdMin = async function () {
  const rollup = await import("rollup");
  const bundle = await rollup.rollup({
    input: "./src/index.ts",
  });
  const { extensions } = DEFAULTS;
  bundle.write({
    file: "/dist/betterUtil.umd.min.js",
    format: "umd",
    name: "betterUtil",
    sourcemap: true,
    plugins: [rollupTs(), terser()],
  });
};

export const bundle = gulp.series(
  clean,
  gulp.parallel(buildEsm, buildLib),
  buildUmd
);

export const pkg = gulp.series(
  clean,
  gulp.parallel(buildEsm, buildLib),
  buildUmdMin
);
