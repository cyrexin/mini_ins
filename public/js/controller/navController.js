/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('navController', function($scope, $auth, $window) {

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.currentUser;
        };

        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

    });