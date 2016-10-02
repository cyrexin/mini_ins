/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('homeController', function($scope, $auth) {
        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };
    });