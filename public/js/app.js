/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins', ['ngRoute', 'ngMessages', 'satellizer'])
    .config(function($routeProvider, $authProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/templates/home.html',
                controller: 'homeController'
            })
            .when('/login', {
                templateUrl: '/templates/login.html',
                controller: 'loginController'
            })
            .when('/reg', {
                templateUrl: '/templates/reg.html',
                controller: 'regController'
            })
            .when('/p/:id', {
                templateUrl: '/templates/view.html',
                controller: 'viewController'
            })
            .otherwise('/');

        $authProvider.loginUrl = '/auth/login';
        $authProvider.signupUrl = '/auth/reg';
    });