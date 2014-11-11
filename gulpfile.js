/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var lazypipe = require('lazypipe');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var header = require('gulp-header');
var footer = require('gulp-footer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var package = require('./package.json');

// Scripts and tests
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var karma = require('gulp-karma');

// Styles
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');

// SVGs
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');

// Docs
var markdown = require('gulp-markdown');
var fileinclude = require('gulp-file-include');


/**
 * Paths to project folders
 */

var paths = {
	input: 'src/**/*',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		output: 'dist/js/'
	},
	styles: {
		input: 'src/sass/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	svgs: {
		input: 'src/svg/**/*.svg',
		output: 'dist/svg/'
	},
	static: 'src/static/**',
	theme : {
		input: 'src/style.css',
		output: ''
	},
	test: {
		input: 'src/js/**/*.js',
		karma: 'test/karma.conf.js',
		spec: 'test/spec/**/*.js',
		coverage: 'test/coverage/',
		results: 'test/results/'
	},
	docs: {
		input: 'src/docs/*.{html,md,markdown}',
		output: 'docs/',
		templates: 'src/docs/_templates/',
		assets: 'src/docs/assets/**'
	}
};


/**
 * Template for banner to add to file headers
 */

var banner = {
	full :
		'/**\n' +
		' * <%= package.name %> v<%= package.version %>\n' +
		' * <%= package.description %>, by <%= package.author.name %>.\n' +
		' * <%= package.repository.url %>\n' +
		' * \n' +
		' * Free to use under the MIT License.\n' +
		' * http://gomakethings.com/mit/\n' +
		' */\n\n',
	min :
		'/**' +
		' Credits:' +
		' http://gomakethings.com,' +
		' https://github.com/filamentgroup/loadJS,' +
		' https://github.com/filamentgroup/loadCSS,' +
		' https://gist.github.com/irae/1042167' +
		' */',
	theme :
		'/**\n' +
		' * Theme Name: <%= package.name %> v<%= package.version %>\n' +
		' * Theme URI: <%= package.repository.url %>\n' +
		' * Description: <%= package.description %>\n' +
		' * Version: <%= package.version %>\n' +
		' * Author: <%= package.author.name %>\n' +
		' * Author URI: <%= package.author.url %>\n' +
		' * License: <%= package.license %>\n' +
		' * License URI: <%= package.author.url %>/mit/\n' +
		' */'
};


/**
 * Gulp Taks
 */

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:dist'], function() {
	var jsTasks = lazypipe()
		.pipe(header, banner.full, { package : package })
		.pipe(gulp.dest, paths.scripts.output)
		.pipe(rename, { suffix: '.min' })
		.pipe(uglify)
		.pipe(header, banner.min, { package : package })
		.pipe(gulp.dest, paths.scripts.output);

	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(tap(function (file, t) {
			if ( file.isDirectory() ) {
				var name = file.relative + '.js';
				return gulp.src(file.path + '/*.js')
					.pipe(concat(name))
					.pipe(jsTasks());
			}
		}))
		.pipe(jsTasks());
});

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
	return gulp.src(paths.styles.input)
		.pipe(plumber())
		.pipe(sass({style: 'expanded', noCache: true, 'sourcemap=none': true}))
		.pipe(flatten())
		.pipe(prefix('last 2 version', '> 1%'))
		.pipe(header(banner.full, { package : package }))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minify())
		.pipe(header(banner.min, { package : package }))
		.pipe(gulp.dest(paths.styles.output));
});

// Generate SVG sprites
gulp.task('build:svgs', ['clean:dist'], function () {
	return gulp.src(paths.svgs.input)
		.pipe(svgmin())
		.pipe(svgstore({
			fileName: 'icons.svg',
			prefix: 'icon-',
			inlineSvg: true
		}))
		.pipe(gulp.dest(paths.svgs.output));
});

// Create style.css with theme header
gulp.task('build:theme', function () {
	return gulp.src(paths.theme.input)
		.pipe(plumber())
		.pipe(header(banner.theme, { package : package }))
		.pipe(gulp.dest(paths.theme.output));
});

// Copy static files into output folder
gulp.task('copy:static', ['clean:dist'], function() {
	return gulp.src(paths.static)
		.pipe(plumber())
		.pipe(gulp.dest(paths.output));
});

// Lint scripts
gulp.task('lint:scripts', function () {
	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Remove prexisting content from output and test folders
gulp.task('clean:dist', function () {
	del.sync([
		paths.output,
		paths.test.coverage,
		paths.test.results
	]);
});

// Run unit tests
gulp.task('test:scripts', function() {
	return gulp.src([paths.test.input].concat([paths.test.spec]))
		.pipe(plumber())
		.pipe(karma({ configFile: paths.test.karma }))
		.on('error', function(err) { throw err; });
});

// Generate documentation
gulp.task('build:docs', ['default', 'clean:docs'], function() {
	return gulp.src(paths.docs.input)
		.pipe(plumber())
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(tap(function (file, t) {
			if ( /\.md|\.markdown/.test(file.path) ) {
				return t.through(markdown);
			}
		}))
		.pipe(header(fs.readFileSync(paths.docs.templates + '/_header.html', 'utf8')))
		.pipe(footer(fs.readFileSync(paths.docs.templates + '/_footer.html', 'utf8')))
		.pipe(gulp.dest(paths.docs.output));
});

// Copy distribution files to docs
gulp.task('copy:dist', ['default', 'clean:docs'], function() {
	return gulp.src(paths.output + '/**')
		.pipe(plumber())
		.pipe(gulp.dest(paths.docs.output + '/dist'));
});

// Copy documentation assets to docs
gulp.task('copy:assets', ['clean:docs'], function() {
	return gulp.src(paths.docs.assets)
		.pipe(plumber())
		.pipe(gulp.dest(paths.docs.output + '/assets'));
});

// Remove prexisting content from docs folder
gulp.task('clean:docs', function () {
	return del.sync(paths.docs.output);
});

// Watch for changes to files
gulp.task('listen', function () {
	watch(paths.input, function (files) {
		gulp.start('default');
	});
});

// Watch for changes to files and docs
gulp.task('listen:docs', function () {
	watch(paths.input, function (files) {
		gulp.start('docs');
	});
});

// Spin up livereload server and listen for file changes
gulp.task('server', function () {
	livereload.listen();
	watch(paths.input, function (files) {
		gulp.start('default');
		gulp.start('refresh');
	});
});

// Spin up livereload server and listen for file and documentation changes
gulp.task('server:docs', function () {
	livereload.listen();
	watch(paths.input, function (files) {
		gulp.start('docs');
		gulp.start('refresh:docs');
	});
});

// Run livereload after file change
gulp.task('refresh', ['default'], function () {
	livereload.changed();
});

// Run livereload after file or documentation change
gulp.task('refresh:docs', ['docs'], function () {
	livereload.changed();
});


/**
 * Task Runners
 */

// Compile files (default)
gulp.task('default', [
	'lint:scripts',
	'clean:dist',
	'copy:static',
	'build:scripts',
	'build:svgs',
	'build:styles',
	'build:theme',
	'test:scripts'
]);

// Compile files and generate documentation
gulp.task('docs', [
	'default',
	'clean:docs',
	'build:docs',
	'copy:dist',
	'copy:assets'
]);

// Compile files when something changes
gulp.task('watch', [
	'listen',
	'default'
]);

// Compile files and generate docs when something changes
gulp.task('watch:docs', [
	'listen:docs',
	'docs'
]);

// Compile files and livereload pages when something changes
gulp.task('reload', [
	'server',
	'default'
]);

// Compile files, generate docs, and livereload pages when something changes
gulp.task('reload:docs', [
	'server:docs',
	'docs'
]);