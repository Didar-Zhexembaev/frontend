// Didar Zhexembaev gulpfile.js
let
	gulp         = require('gulp'),
	pug          = require('gulp-pug'),
	sass         = require('gulp-sass'),
	file         = require('gulp-file'),
	cache        = require('gulp-cache'),
	clean        = require('gulp-clean'),
	rename       = require('gulp-rename'),
	uglify       = require('gulp-uglify'),
	notify       = require('gulp-notify'),
	browserSync  = require('browser-sync'),
	plumber      = require('gulp-plumber'),
	imagemin     = require('gulp-imagemin'),
	minify_css   = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer');

	//---------------------------------
		let srcPath = 'src/';
		let distPath = 'dist/';
		let indexHtmlFile = 'index.html';
		let indexHtmlContent = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Document</title>\n</head>\n<body>\n\n</body>\n</html>';
	//---------------------------------
	//---------------------------------
		let watchSrc = {
			[srcPath + 'sass/**/*.+(sass|scss)']: 'sass', 
			[srcPath + 'views/**/*.+(jade|pug)']: 'pug',
			[srcPath + 'index.html']: 'html',
		};
	//---------------------------------

gulp.task('env', async function(){
	return gulp.parallel('env:src', 'env:dist')();
});

gulp.task('env:src', async function(){
	return gulp.src('*.*', {read: false})
	.pipe(gulp.dest(srcPath))
	.pipe(gulp.dest(srcPath + 'js/'))
	.pipe(gulp.dest(srcPath + 'css/'))
	.pipe(gulp.dest(srcPath + 'img/'))
	.pipe(gulp.dest(srcPath + 'sass/'))
	.pipe(gulp.dest(srcPath + 'fonts/'))
	.pipe(gulp.dest(srcPath + 'views/'))
	.pipe(file(indexHtmlFile, indexHtmlContent))
	.pipe(gulp.dest(srcPath));
});

gulp.task('env:dist', async function(){
	return gulp.src('*.*', {read: false})
	.pipe(gulp.dest(distPath))
	.pipe(gulp.dest(distPath + 'js/'))
	.pipe(gulp.dest(distPath + 'css/'))
	.pipe(gulp.dest(distPath + 'img/'))
	.pipe(gulp.dest(distPath + 'fonts/'));
});

gulp.task('clean:src', async function(){
	gulp.src(srcPath, {read: false})
	.pipe(clean())
	.on('finish', gulp.series('env:src'));
});

gulp.task('clean:dist', async function(){
	gulp.src(distPath, {read: false})
	.pipe(clean())
	.on('finish', gulp.series('env:dist'));
});

gulp.task('html', async function(){
	return gulp.src(srcPath + 'index.html')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('pug', async function(){
	return gulp.src(srcPath + 'views/*.+(jade|pug)')
	.pipe(plumber({errorHandler: function(err){
		notify.onError({
			title: "PUG" + err.plugin,
			message: err.toString()
		})(err);
	}}))
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest(srcPath))
});

gulp.task('sass', async function(){
	return gulp.src(srcPath + 'sass/*.+(sass|scss)')
	.pipe(plumber({errorHandler: function(err){
		notify.onError({
			title: "SASS" + err.plugin,
			message: err.toString()
		})(err);
	}}))
	.pipe(sass())
	.pipe(gulp.dest(srcPath + 'css/'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', async function(){
	browserSync({
		server: {
			baseDir: srcPath
		},
		notify: false
	});
});

gulp.task('uglify', async function () {
	return gulp.src([srcPath + 'js/*.js', '!' + srcPath + 'js/*.min.js'])
	.pipe(plumber({errorHandler: function(err){
		notify.onError({
			title: "UGLIFY" + err.plugin,
			message: err.toString()
		})(err);
	}}))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(distPath + 'js/'));
});

gulp.task('minify-css', async function(){
	return gulp.src([srcPath + 'css/*.css', '!' + srcPath + 'css/*.min.css'])
	.pipe(plumber({errorHandler: function(err){
		notify.onError({
			title: "MINIFY-CSS" + err.plugin,
			message: err.toString()
		})(err);
	}}))
	.pipe(minify_css())
	.pipe(gulp.dest(distPath + 'css/'));
});

gulp.task('imagemin', async function () {
	return gulp.src([srcPath + 'img/*', '!' + srcPath + 'css/*'])
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError({
					title: "IMAGEMIN" + err.plugin,
					message: err.toString()
				})(err);
			}
		}))
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{
				removeViewBox: true
			}]
		})))
		.pipe(gulp.dest(distPath + 'img/'));
});

gulp.task('autoprefixer', async function () {

	// ----------------------------------------
	// 				AUTO PREFIXER
	// ----------------------------------------
	// Full List

	// You can specify the browser and Node.js versions by queries(
	// 		case insensitive):

	// 	defaults: Browserslist’ s
	// default browsers( > 0.5 % , last 2 versions, Firefox ESR, not dead). >
	// 	5%: browsers versions selected by global usage statistics. >= , < and <= work too. >
	// 	5% in US: uses USA usage statistics.It accepts two - letter country code. >
	// 	5% in alt - AS: uses Asia region usage statistics.List of all region codes can be found at caniuse - lite / data / regions. >
	// 	5% in my stats: uses custom usage data. >
	// 	5% in browserslist - config - mycompany stats: uses custom usage data from browserslist - config - mycompany / browserslist - stats.json.
	// cover 99.5%: most popular browsers that provide coverage.
	// cover 99.5% in US: same as above, with two - letter country code.
	// cover 99.5% in my stats: uses custom usage data.
	// maintained node versions: all Node.js versions, which are still maintained by Node.js Foundation.
	// node 10 and node 10.4: selects latest Node.js 10. x.x or 10.4.x release.
	// current node: Node.js version used by Browserslist right now.
	// extends browserslist - config - mycompany: take queries from browserslist - config - mycompany npm package.
	// ie 6 - 8: selects an inclusive range of versions.
	// Firefox > 20: versions of Firefox newer than 20. >= , < and <= work too.It also works with Node.js.
	// iOS 7: the iOS browser version 7 directly.
	// Firefox ESR: the latest[Firefox ESR] version.
	// PhantomJS 2.1 and PhantomJS 1.9: selects Safari versions similar to PhantomJS runtime.
	// unreleased versions or unreleased Chrome versions: alpha and beta versions.
	// last 2 major versions or last 2 iOS major versions: all minor / patch releases of last 2 major versions.
	// since 2015 or last 2 years: all versions released since year 2015(also since 2015 - 03 and since 2015 - 03 - 10).
	// dead: browsers without official support or updates
	// for 24 months.Right now it is IE 10, IE_Mob 11, BlackBerry 10, BlackBerry 7, Samsung 4 and OperaMobile 12.1.
	// last 2 versions: the last 2 versions
	// for each browser.
	// last 2 Chrome versions: the last 2 versions of Chrome browser.
	// not ie <= 8: exclude browsers selected by previous queries.

	return gulp.src(srcPath + 'css/*')
	.pipe(plumber({
		errorHandler: function (err) {
			notify.onError({
				title: "AUTOPREFIXER" + err.plugin,
				message: err.toString()
			})(err);
		}
	}))
	.pipe(autoprefixer(['cover 99.5%'], {
		cascade: false
	}))
	.pipe(gulp.dest(srcPath + 'css/'));
});

gulp.task('clear_cache', async function(){
	return cache.clearAll();
});

gulp.task('watch', async function(){
	for (item in watchSrc) {
		gulp.watch(item, gulp.parallel(watchSrc[item]));
	}
});

gulp.task('prod', async function(){
	gulp.parallel('pug', 'sass', 'autoprefixer', 'minify-css', 'uglify', 'imagemin', 'clear_cache')();
	return gulp.src(srcPath + 'index.html')
	.pipe(gulp.dest(distPath));
});

gulp.task('default', gulp.parallel('env', 'browser-sync', 'sass', 'pug', 'html', 'watch'));
gulp.task('build', gulp.parallel('prod'));
