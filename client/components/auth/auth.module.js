'use strict';

angular.module('pokertrainerwebApp.auth', [
  'pokertrainerwebApp.constants',
  'pokertrainerwebApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
