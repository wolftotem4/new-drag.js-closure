const { src, dest, parallel, watch } = require('gulp');
const path = require('path')
const compilerPackage = require('google-closure-compiler');
const closureCompiler = compilerPackage.gulp();
const googBasePath = path.resolve(require.resolve('google-closure-library'), '..', '..', 'base.js')

const compilerFlags = require('./compiler.flags');

function build() {
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

function watchFiles() {
    watch('lib/**/*', build);
}

exports.build = build;
exports.watch = watchFiles;
exports.default = build;
