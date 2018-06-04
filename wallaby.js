module.exports = function () {
  return {
    files: [
      'index.js',
      'src/*.js',
      'src/**/*.js',
      '!__test__/**/*.spec.js',
      '!public/*.html',
    ],

    tests: [
      '__test__/*.spec.js', 
      '__test__/**/*.spec.js', 
    ],

    testFramework: 'jest',
    env: {
      type: 'node',
    },
  };
};