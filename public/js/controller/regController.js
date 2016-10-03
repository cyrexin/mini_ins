/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('regController', function($scope, $auth, $location) {

        $scope.signup = function() {
            var user = {
                email: $scope.email,
                password: $scope.password,
                fullname: $scope.fullname
            };

            $auth.signup(user)
                .then(function(response) {
                    $location.path("/login");
                })
                .catch(function(response) {
                    $scope.errorMessage = {};
                    angular.forEach(response.data.message, function(message, field) {
                        $scope.signupForm[field].$setValidity('server', false);
                        $scope.errorMessage[field] = response.data.message[field];
                    });
                    console.log(response.data);
                });
        };

    });