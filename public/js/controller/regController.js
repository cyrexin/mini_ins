/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('regController', function($scope, $auth) {

        $scope.signup = function() {
            var user = {
                email: $scope.email,
                password: $scope.password
            };

            // Satellizer
            $auth.signup(user)
                .catch(function(response) {
                    console.log(response.data);
                });
        };

    });