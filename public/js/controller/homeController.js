/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('homeController', function($scope, $auth, apiService, $rootScope, $location) {
        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        if (!$auth.isAuthenticated()) {
            $location.path('/login');
        }

        console.log($rootScope.currentUser);
        if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.email)) {
            apiService.getFeed().success(function(data) {
                $scope.photos = data;
            });
        }
    });