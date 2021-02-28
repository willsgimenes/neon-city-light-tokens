const StyleDictionaryPackage = require('style-dictionary');

const getStyleDictionaryConfig = (brand, platform) => ({
  source: [
    `src/brands/${brand}/*.json`,
    'src/globals/**/*.json',
    `src/platforms/${platform}/*.json`,
  ],
  platforms: {
    'web/js': {
      transformGroup: 'tokens-js',
      buildPath: `dist/web/${brand}/`,
      prefix: 'token',
      files: [
        {
          destination: 'tokens.es6.js',
          format: 'javascript/es6',
        },
      ],
    },
    'web/json': {
      transformGroup: 'tokens-json',
      buildPath: `dist/web/${brand}/`,
      prefix: 'token',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
    'web/scss': {
      transformGroup: 'tokens-scss',
      buildPath: `dist/web/${brand}/`,
      prefix: 'token',
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    styleguide: {
      transformGroup: 'styleguide',
      buildPath: `dist/styleguide/`,
      prefix: 'token',
      files: [
        {
          destination: `${platform}_${brand}.json`,
          format: 'json/flat',
        },
        {
          destination: `${platform}_${brand}.scss`,
          format: 'scss/variables',
        },
      ],
    },
  },
});

StyleDictionaryPackage.registerFormat({
  name: 'json/flat',
  formatter: function (dictionary) {
    return JSON.stringify(dictionary.allProperties, null, 2);
  },
});

StyleDictionaryPackage.registerTransform({
  name: 'size/pxToPt',
  type: 'value',
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, 'pt');
  },
});

StyleDictionaryPackage.registerTransform({
  name: 'size/pxToDp',
  type: 'value',
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, 'dp');
  },
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'styleguide',
  transforms: ['attribute/cti', 'name/cti/kebab', 'size/px', 'color/css'],
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-js',
  transforms: ['name/cti/constant', 'size/px', 'color/hex'],
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-json',
  transforms: ['attribute/cti', 'name/cti/kebab', 'size/px', 'color/css'],
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-scss',
  transforms: ['name/cti/kebab', 'time/seconds', 'size/px', 'color/css'],
});

console.log('Build started...');

['web'].map(function (platform) {
  ['brand#1'].map(function (brand) {
    console.log(`\nProcessing: [${platform}] [${brand}]`);
    const StyleDictionary = StyleDictionaryPackage.extend(
      getStyleDictionaryConfig(brand, platform)
    );

    StyleDictionary.buildPlatform('web/js');
    StyleDictionary.buildPlatform('web/json');
    StyleDictionary.buildPlatform('web/scss');
    StyleDictionary.buildPlatform('styleguide');

    console.log('\nEnd processing');
  });
});

console.log('\nBuild completed!');
