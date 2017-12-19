var bourbon = require("bourbon").includePaths,
	neat = require("bourbon-neat").includePaths,
	autoprefixer = require("gulp-autoprefixer"),
	del = require("del"),
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
	src: {
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
		],
		images: [
			'./app/assets/images/**/*'
		]
	},
	dest: {
		main: './build/',
		images: './build/images/'
	}
};

/* Building scripts */
gulp.task('scripts', function(cb) {
	pump([
		gulp.src(paths.src.scripts),
		concat('app.min.js'),
		uglify(),
		gulp.dest(paths.dest.main)
	], cb);
});
gulp.task('scripts-watch', ['scripts'], function(done) {
	browserSync.reload();
	done();
});

/* Compiling stylesheets */
gulp.task('sass', function() {
	pump([
		gulp.src(paths.src.styles),
		concat('styles.min.css'),
		sass({
			includePaths: ["styles"].concat(bourbon).concat(neat)
		}).on('error', sass.logError),
		cleanCSS({
			compatibility: 'ie9',
			keepSpecialComments: 0,
		}),
		autoprefixer(),
		gulp.dest(paths.dest.main),
		browserSync.stream()
	]);
});

/* Compiling Views */
gulp.task('views', function(cb) {
	pump([
		gulp.src(paths.src.views),
		pug(),
		gulp.dest(paths.dest.main)
	], cb);
});
gulp.task('views-watch', ['views'], function(done) {
	browserSync.reload();
	done();
});

/* Copying Images */
gulp.task('copy-images', ['copy-images-clear'], function(cb) {
	pump([
		gulp.src(paths.src.images),
		gulp.dest(paths.dest.images)
	], cb);
});
gulp.task('copy-images-clear', function(done) {
	del(paths.dest.images, {force:true});
	done();
});
gulp.task('copy', ['copy-images'], function(done) {
	done();
});
gulp.task('copy-watch', ['copy'], function(done) {
	browserSync.reload();
	done();
});

/* Browser sync */
gulp.task('serve', ['compile'], function() {

	browserSync.init({
		proxy: proxy,
		watchTask: true,
		server: false,
	});

	gulp.watch("./app/assets/styles/**/*.scss", ['sass']);

	gulp.watch(paths.src.scripts, ['scripts-watch']);
	gulp.watch(paths.src.views, ['views-watch']);
	gulp.watch(paths.src.images, ['copy-watch']);
});

gulp.task('compile', ['copy', 'scripts', 'sass', 'views']);

gulp.task('default', ['serve']);
