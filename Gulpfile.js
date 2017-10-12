var bourbon = require("bourbon").includePaths,
	neat = require("bourbon-neat").includePaths,
	autoprefix = require("gulp-autoprefixer"),
	connect = require("gulp-connect"),
	gulp = require("gulp"),
	sass = require("gulp-sass");
uglify = require('gulp-uglify');
pump = require('pump');
concat = require('gulp-concat');
cleanCSS = require('gulp-clean-css');
pug = require('gulp-pug');
browserSync = require('browser-sync').create();

var proxy = "http://localhost:8888/spugss/build";
var paths = {
	scripts: [
		'./app/assets/scripts/lib/jquery*.js',
		'./app/assets/scripts/lib/*.js',
		'./app/assets/scripts/*.js'
	],
	styles: [
		'./app/assets/styles/lib/*.scss',
		'./app/assets/styles/lib/*.css',
		'./app/assets/styles/styles.scss'
	],
	views: [
		'./app/views/*.pug'
	]
};

/* Building scripts */
gulp.task('scripts', function(cb) {
	pump([
		gulp.src(paths.scripts),
		concat('app.min.js'),
		uglify(),
		gulp.dest('./build/')
	], cb);
});
gulp.task('scripts-watch', ['scripts'], function(done) {
	browserSync.reload();
	done();
});

/* Compiling stylesheets */
gulp.task('sass', function() {
	pump([
		gulp.src(paths.styles),
		concat('styles.min.css'),
		sass({
			includePaths: ["styles"].concat(bourbon).concat(neat)
		}).on('error', sass.logError),
		cleanCSS({
			compatibility: 'ie9',
			keepSpecialComments: 0,
		}),
		gulp.dest('./build/'),
		browserSync.stream()
	]);
});

/* Compiling Views */
gulp.task('views', function(cb) {
	pump([
		gulp.src(paths.views),
		pug(),
		gulp.dest('./build/')
	], cb);
});
gulp.task('views-watch', ['views'], function(done) {
	browserSync.reload();
	done();
});

/* Browser sync */
gulp.task('serve', ['compile'], function() {

	browserSync.init({
		proxy: proxy,
		watchTask: true,
		server: false,
		browser: "google chrome",
	});

	gulp.watch("./app/assets/styles/**/*.scss", ['sass']);

	gulp.watch(paths.scripts, ['scripts-watch']);
	gulp.watch(paths.views, ['views-watch']);
});

gulp.task('compile', ['scripts', 'sass', 'views']);

gulp.task('default', ['serve']);
