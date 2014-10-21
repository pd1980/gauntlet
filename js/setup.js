require.config({
  baseUrl: 'js',
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    jquery: '../lib/jquery-2.0.3.min',
    underscore: '../lib/underscore-min',
    backbone: '../lib/backbone-min',
    d3 : '../lib/d3.min'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: "_"
    }
  }
});
require(['main']);
