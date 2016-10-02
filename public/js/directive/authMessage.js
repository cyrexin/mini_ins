/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .directive('authMessage', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                element.on('keydown', function() {
                    ctrl.$setValidity('server', true)
                });
            }
        }
    });