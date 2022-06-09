import gulp from 'gulp';
import config from './gulp/config.js';
config.setBuildMode(); // dev or prod

// Tools
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import skip from 'gulp-noop';
import del from 'del';
import browserSync from 'browser-sync';
import ghPages from 'gulp-gh-pages';

// Bem bundles
import bundleBuilder from 'gulp-bem-bundle-builder';
import bundlerFs from 'gulp-bem-bundler-fs';
import html2bemjson from 'gulp-html2bemjson';

// Scripts
import terser from 'gulp-terser';
import browserify from 'browserify';
import tap from 'gulp-tap';
import gulpBuffer from 'gulp-buffer';

// Styles
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

// Html
import htmlMin from 'gulp-htmlmin';
import htmlWebp from 'gulp-webp-html';

// Assets
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import webp from 'gulp-webp';
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';

// Tasks
// Html to bemjson
export const html2decl = () => {
    return gulp.src(`${config.src.htmlPagesFiles}`)
      .pipe(html2bemjson())
      .pipe(gulp.dest(`${config.src.pages}`));
  };

// Bem bundle
const builder = bundleBuilder({
  levels: [`${config.src.blocks}`],
  techMap: {
    images: ['jpg', 'png', 'gif', 'svg'],
  }
});

const bundleJs = () => {
  return bundlerFs(`${config.src.pages}/*`)
    .pipe( builder({
      js: bundle =>
        bundle.src('js', {read: false})
          .pipe( tap(file => {
            file.contents = browserify(file.path, {debug: config.isProd})
              .transform("babelify", {presets: ["@babel/preset-env"]})
              .bundle()
          }) )
          .pipe( gulpBuffer() )
          .pipe( (!config.isProd) ? sourcemaps.init({loadMaps: config.isProd}) : skip() )
          .pipe( concat(bundle.name + '.min.js', {newLine: ';'}) )
          .pipe( (config.isProd) ? terser() : skip() )
          .pipe( (!config.isProd) ? sourcemaps.write('.') : skip() )
          .pipe( gulp.dest(config.dest.js) )
    }) )
    .pipe( browserSync.stream() );
};

const bundleScss = () => {
  return bundlerFs(`${config.src.pages}/*`)
    .pipe( builder({
      scss: bundle => 
        bundle.src('scss')
          .pipe( (!config.isProd) ? sourcemaps.init() : skip() )
          .pipe( concat('_' + bundle.name + '.bundle.scss' ) )
          .pipe( gulp.dest(`${config.src.scssBundles}`) )
    }) )
};

const buildBundle = gulp.parallel(bundleJs, bundleScss);

const convertStyles = () => {
  const scssOptions = {
    outputStyle: (config.isProd) ? 'compressed' : 'expanded',
    indentType: 'space',
    indentWidth: '2',
    allowEmpty: true
  };

  const prefixOptions = {
    overrideBrowserslist: ['last 10 version'],
    grid: true
  };

  return gulp.src(`${config.src.scssPagesFiles}`, {sourcemaps: !config.isProd})
    .pipe( sass(scssOptions) )
    .pipe( autoprefixer(prefixOptions) )
    .pipe( rename((path) => path.basename += '.min') )
    .pipe( gulp.dest(`${config.dest.css}`, {sourcemaps: '.'}) )
    .pipe( browserSync.stream() );
};

// If isProd then minify + webp else copy
const convertHtml = () => {
  const minifySettings = {
    collapseWhitespace: true,
    removeComments: true,
  };

  return gulp.src(`${config.src.htmlPagesFiles}`)
    .pipe( (config.isProd) ? htmlWebp() : skip() )
    .pipe( (config.isProd) ? htmlMin(minifySettings) : skip() )
    .pipe( rename({dirname: ''}) )
    .pipe( gulp.dest(`${config.dest.root}`) )
};

// If isProd then compress else copy
const convertImages = () => {
  del(`${config.dest.images}`);

  const compressSettings = [
    gifsicle({ interlaced: true }),
    mozjpeg({ quality: 75, progressive: true }),
    optipng({ optimizationLevel: 5 })
  ];

  if(config.isProd) {
    gulp.src(`${config.src.imagesFiles}`)
      .pipe( webp({quality: 70}) )
      .pipe( rename({dirname: ''}) )
      .pipe( gulp.dest(`${config.dest.images}`) );
  }

  return gulp.src(`${config.src.imagesFiles}`)
    .pipe( (config.isProd) ? imagemin(compressSettings) : skip() )
    .pipe( rename({dirname: ''}) )
    .pipe( gulp.dest(`${config.dest.images}`) )
    .pipe( browserSync.stream() );
};

// If isProd then copy ttf & convert to woff/woff2 else copy ttf
const convertFonts = () => {
  del(`${config.dest.fonts}`);

  if(config.isProd) {
    // Copy ttf
    gulp.src(`${config.src.fontsFiles}`)
      .pipe( rename({dirname: ''}) )
      .pipe( gulp.dest(`${config.dest.fonts}`) )

    // Convert ttf to woff
    gulp.src(`${config.src.fontsFiles}`)
      .pipe( ttf2woff() )
      .pipe( rename({dirname: ''}) )
      .pipe( gulp.dest(`${config.dest.fonts}`) )
  }

  // If isProd then convert ttf to woff2
  // Else copy ttf
  return gulp.src(`${config.src.fontsFiles}`)
    .pipe( (config.isProd) ? ttf2woff2() : skip() )
    .pipe( rename({dirname: ''}) )
    .pipe( gulp.dest(`${config.dest.fonts}`) )
    .pipe( browserSync.stream() );
};

// Copy other assets from blocks (besides js and scss block's files)
const copyAssets = () => {
  return gulp.src(`${config.src.jsonFiles}`)
    .pipe( rename({dirname: ''}) )
    .pipe( gulp.dest(`${config.dest.assets}`) )
    .pipe( browserSync.stream() );
};

// Publish gh-pages branch with prod version on GitHub
const pages = () => 
  src(`${config.dest.root}/**/*`)
    .pipe(ghPages());

// Delete dist and scss bundle folders before other tasks
const clean = () => {
  del(`${config.src.scssBundles}`);
  return del(`${config.dest.root}`);
};

const watching = () => {
  gulp.watch(`${config.src.htmlPagesFiles}`, gulp.series(
    html2decl,
    buildBundle,
    convertHtml
  ));
  gulp.watch(`${config.src.jsBlocksFiles}`, bundleJs);
  gulp.watch(`${config.src.scssBlocksFiles}`, bundleScss);
  gulp.watch(`${config.src.scssFiles}`, convertStyles);
  gulp.watch(`${config.src.imagesFiles}`, convertImages);
  gulp.watch(`${config.src.fontsFiles}`, convertFonts);
  gulp.watch(`${config.src.jsonFiles}`, copyAssets);
};

const browserSyncer = () => {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: `${config.dest.root}`,
      watch: true
    }
  });
};

// Development task
export const dev = gulp.series(
  clean,
  html2decl,
  buildBundle,
  gulp.parallel(
    convertStyles,
    convertHtml
  ),
  gulp.parallel(
    convertImages,
    convertFonts,
    copyAssets
  ),
  gulp.parallel(
    browserSyncer,
    watching
  ));

// Product task
export const prod = gulp.series(
  clean,
  html2decl,
  buildBundle,
  gulp.parallel(
    convertStyles,
    convertHtml
  ),
  gulp.parallel(
    convertImages,
    convertFonts,
    copyAssets
  ),
  pages);
