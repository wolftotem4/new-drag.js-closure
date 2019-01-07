const { src, dest, watch } = require('gulp');
const path = require('path')
const prepack = require('gulp-prepack');
const uglify = require('gulp-uglify');
const compilerPackage = require('google-closure-compiler');
const closureCompiler = compilerPackage.gulp();
const googBasePath = path.resolve(require.resolve('google-closure-library'), '..', '..', 'base.js')

const compilerFlags = require('./compiler.flags');

function dev() {
    return src([googBasePath, 'lib/**/*.js'], {base: './'})
        .pipe(closureCompiler(
            Object.assign({}, compilerFlags, {
                js_output_file: 'dragjs.min.js'
            }), {
                platform: ['native', 'java', 'javascript']
            }
        ))
        .pipe(dest('dist'));
}

function build() {
    return src([googBasePath, 'lib/**/*.js'], {base: './'})
        .pipe(closureCompiler(
            Object.assign({}, compilerFlags, {
                js_output_file: 'dragjs.min.js'
            }), {
                platform: ['native', 'java', 'javascript']
            }
        ))
        .pipe(prepack())
        .pipe(uglify())
        .pipe(dest('dist'));
}

function watchFiles() {
    watch('lib/**/*', dev);
}

exports.dev = dev;
exports.build = build;
exports.watch = watchFiles;
exports.default = build;
