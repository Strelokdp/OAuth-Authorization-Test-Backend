angular.module('shipments.home', [
'auth0'])
.controller('HomeCtrl', function ($scope, auth, $location) {
    $scope.shipments = [];
    $scope.auth = auth;
    
    $scope.logout = function () {
        auth.signout();
        $location.path('/login');
    }
});