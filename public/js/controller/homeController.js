/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('homeController', function($scope, $auth, apiService, $rootScope) {
        $scope.isLoggedIn = function() {
            return $auth.isAuthenticated();
        };

        console.log($rootScope.currentUser);
        if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.email)) {
            apiService.getFeed().success(function(data) {
                $scope.photos = data;
            });
        }
    });