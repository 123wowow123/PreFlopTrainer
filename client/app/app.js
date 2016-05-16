'use strict';

angular.module('pokertrainerwebApp', [
  // 'pokertrainerwebApp.auth',
  // 'pokertrainerwebApp.admin',
  // 'pokertrainerwebApp.constants',
  //'ngCookies',
  //'ngResource',
  //'ngSanitize',
  //'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  //'validation.match',
  //'angularFileUpload',
  'yourModule'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    //$locationProvider.html5Mode(true);
  });
