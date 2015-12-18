import gulp from "gulp";
import gutil from "gulp-util";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import minifyHTML from 'gulp-minify-html';
import gulpif from 'gulp-if';
import less from 'gulp-less';

let webpackConfig = {
	entry: "./src/scripts/index.js",
	output: {
		path: __dirname + '/dist/scripts',
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
		]
	}
}

gulp.task("webpack", (callback)=> {
	webpack(webpackConfig, (err, stats)=> {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
		    
		}));
		callback();
	});
});

gulp.task('update_source', (callback)=>{
	return gulp.src(['./src/html/**/*.html' , './src/stylesheets/**/*.less'])
		.pipe(gulpif('*.html', minifyHTML()))
		.pipe(gulpif('*.less', less({
				paths : [ './scripts/stylesheets/includes' ]
			})))
		.pipe(gulpif('*.html', gulp.dest('./') , gulp.dest('./dist/stylesheets')));
});

gulp.task('build', ['webpack' ,'update_source']);

gulp.task("webpack-dev-server", (callback)=> {
	let compiler = webpack(webpackConfig);

	new WebpackDevServer(compiler, {

		}).listen(8080, "localhost", (err)=> {
			if(err) throw new gutil.PluginError("webpack-dev-server", err);
			gutil.log("[webpack-dev-server]", "http://localhost:8080/index.html");
		});
});

gulp.task('default', ['build', 'webpack-dev-server']);

gulp.task('watch', (callback)=>{
	gulp.watch('./src/**/*', ['build'])
});

