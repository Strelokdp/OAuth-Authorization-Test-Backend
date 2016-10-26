angular.module('shipments.login', ['auth0'])
.controller('LoginCtrl', function ($scope, auth, $location, store) {
    $scope.login = function () {
        auth.signin({}, function (profile, token) {
            store.set('profile', profile);
            store.set('token', token);
            $location.path('/');
        }, function (error) {
            console.log("There was an error", error);
        });
    }
});