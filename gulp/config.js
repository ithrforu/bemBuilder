const srcPath = 'src';
const destPath = 'dist';

// https://github.com/micromatch/extglob#extglob-cheatsheet
const config = {
  src: {
    // Folders
    root: srcPath,
    blocks: `${srcPath}/blocks`,
    pages: `${srcPath}/pages`,
    scss: `${srcPath}/scss`,
    scssBundles: `${srcPath}/scss/bundles`,

    // Files: html, scss, js
    scssFiles: `${srcPath}/scss/**`,
    scssBlocksFiles: `${srcPath}/blocks/**/*.scss`,
    scssPagesFiles: `${srcPath}/scss/*.scss`,
    jsBlocksFiles: `${srcPath}/blocks/**/*.js`,
    jsPagesFiles: `${srcPath}/js/*.js`,
    htmlPagesFiles: `${srcPath}/pages/*/*.html`,

    // Files: assets
    imagesFiles: `${srcPath}/blocks/**/images/*`,
    svgFiles: `${srcPath}/blocks/**/images/*.svg`,
    fontsFiles: `${srcPath}/blocks/**/fonts/*`,
    jsonFiles: `${srcPath}/blocks/**/*.json`,
  },

  dest: {
    // Folders
    root: destPath,
    html: destPath,
    assets: `${destPath}/assets`,
    fonts: `${destPath}/assets/fonts`,
    images: `${destPath}/assets/images`,
    css: `${destPath}/css`,
    js: `${destPath}/js`,
  },

  setBuildMode() {
    this.isProd = process.argv.includes('prod');
  },
};

export default config;
