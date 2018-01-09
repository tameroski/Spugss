var bourbon = require("bourbon").includePaths,
	neat = require("bourbon-neat").includePaths,
	autoprefixer = require("gulp-autoprefixer"),
	del = require("del"),
	gulp = require("gulp"),
	sass = require("gulp-sass"),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	pug = require('gulp-pug'),
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
	},
	watch: {
		views: [
			'./app/views/**/*.pug'
		],
	}
};

/* Building scripts */
gulp.task('scripts', function() {
	return gulp.src(paths.src.scripts)
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.dest.main));
});
gulp.task('scripts-watch', ['scripts'], function() {
	return browserSync.reload();
});

/* Compiling stylesheets */
gulp.task('sass', function() {
	return gulp.src(paths.src.styles)
		.pipe(concat('styles.min.css'))
		.pipe(sass({
			includePaths: ["styles"].concat(bourbon).concat(neat)
		}).on('error', sass.logError))
		.pipe(cleanCSS({
			compatibility: 'ie9',
			keepSpecialComments: 0,
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.dest.main))
		.pipe(browserSync.stream());
});

/* Compiling Views */
gulp.task('views', function() {
	return gulp.src(paths.src.views)
		.pipe(pug())
		.pipe(gulp.dest(paths.dest.main));
});
gulp.task('views-watch', ['views'], function() {
	return browserSync.reload();
});

/* Copying Images */
gulp.task('copy-images', ['copy-images-clear'], function() {
	return gulp.src(paths.src.images)
		.pipe(gulp.dest(paths.dest.images));
});
gulp.task('copy-images-clear', function() {
	return del(paths.dest.images, {force:true});
});
gulp.task('copy', ['copy-images'], function(done) {
	done();
});
gulp.task('copy-watch', ['copy'], function() {
	return browserSync.reload();
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
	gulp.watch(paths.watch.views, ['views-watch']);
	gulp.watch(paths.src.images, ['copy-watch']);
});

gulp.task('compile', ['copy'], function(){
	gulp.start(['scripts', 'sass', 'views']);
});

gulp.task('default', ['serve']);
