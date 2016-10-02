/**
 * Created by dyorex on 2016-10-02.
 */
angular.module('mini_ins')
    .factory('apiService', function($http) {

        return {
            getFeed: function() {
                return $http.get('/feed');
            },
            getPhotoById: function(id) {
                return $http.get('/photo/' + id);
            },
            updateCaption: function(id, description) {
                return $http.post('updateCaption', {id: id, description: description});
            }
            // like: function(id) {
            //     return $http.post('/like', { photoId: id });
            // }
        }

    });