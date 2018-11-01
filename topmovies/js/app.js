(function () {
    var config = {
        apiKey: "AIzaSyBLVf84SaTreu6fKZMpUnNsgiH9koIrPEg",
        authDomain: "recent-top-movies.firebaseapp.com",
        databaseURL: "https://recent-top-movies.firebaseio.com",
        projectId: "recent-top-movies",
        storageBucket: "recent-top-movies.appspot.com",
        messagingSenderId: "623683303968"
    };
    firebase.initializeApp(config)

    angular.module('app', ['bootstrapLightbox', 'firebase'])
        .factory('DB', function () {
            var root = firebase.database().ref();
            ref = {
                Movies: root.child('Movies')
            }
            return ref;
        })
        .controller('homectrl', function ($scope, DB, $sce, $firebaseArray) {
            $scope.Movies = $firebaseArray(DB.Movies);
        })

}());