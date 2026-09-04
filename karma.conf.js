module.exports = function (config) {
  const options = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'src',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    preprocessors: {},

    // test results reporter to use (se agrega 'junit')
    reporters: ['progress', 'junit'],

    // Configuración para el reporte XML de evaluación
    junitReporter: {
      outputDir: '../test-results',
      outputFile: 'junit-test-results.xml',
      useBrowserName: false
    },

    // configure optional coverage, enable via --env.codeCoverage
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },

    // web server hostname
    hostname: '127.0.0.1',

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: [],

    customLaunchers: {
      android: {
        base: 'NS',
        platform: 'android'
      },
      ios: {
        base: 'NS',
        platform: 'ios'
      },
      ios_simulator: {
        base: 'NS',
        platform: 'ios',
        arguments: ['--emulator']
      }
    },

    // Continuous Integration mode
    singleRun: false
  };

  if(config._NS && config._NS.env && config._NS.env.codeCoverage) {
    options.reporters = (options.reporters || []).concat(['coverage']);
  }

  config.set(options);
}