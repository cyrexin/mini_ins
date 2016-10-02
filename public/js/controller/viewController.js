/**
 * Created by dyorex on 2016-10-01.
 */
angular.module('mini_ins')
    .controller('viewController', function($scope, $rootScope, $location, $auth, apiService) {

        var photoId = $location.path().split('/').pop();

        apiService.getPhotoById(photoId).success(function(photo) {
            // $scope.hasLiked = photo.user_has_liked;
            $scope.photo = photo;
            $scope.photo.url = '/upload/' + $scope.photo.url;
        });

        $scope.updateCaption = function() {
            if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser._id && $rootScope.currentUser._id == $scope.photo.user._id)) {
                console.log("You have permission to do this :)");
                apiService.updateCaption($scope.photo._id, $scope.photo.description);
            }
        };

        // $scope.like = function() {
        //     $scope.hasLiked = true;
        //     API.likeMedia(mediaId).error(function(data) {
        //         sweetAlert('Error', data.message, 'error');
        //     });
        // };
    });