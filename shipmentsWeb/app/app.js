angular.module('shipments', [
    'auth0',
    'ngRoute',
    'shipments.home',
    'shipments.login',
    'angular-storage',
    'angular-jwt'
])

.config(function ($routeProvider, authProvider, jwtOptionsProvider, jwtInterceptorProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'app/components/home/home.html',
            requiresLogin: true
        })
        .when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'app/components/login/login.html'
        });

    authProvider.init({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        loginUrl: '/login'
    });

    var refreshingToken = null;
    jwtOptionsProvider.config({
        tokenGetter: function (store, jwtHelper) {
        var token = store.get('token');
        var refreshToken = store.get('refreshToken');
        if (token) {
            if (!jwtHelper.isTokenExpired(token)) {
                return store.get('token');
            } else {
                if (refreshingToken === null) {
                    refreshingToken = auth.refreshIdToken(refreshToken).then(function (idToken) {
                        store.set('token', idToken);
                        return idToken;
                    }).finally(function () {
                        refreshingToken = null;
                    });
                }
                return refreshingToken;
            }
        }
    },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/login'
    });
    
    $httpProvider.interceptors.push('jwtInterceptor');
   
})

.run(function ($rootScope, auth, store, jwtHelper, $location) {
    var refreshingToken = null;
    $rootScope.$on('$locationChangeStart', function () {
        var token = store.get('token');
        var refreshToken = store.get('refreshToken');

        if (token) {
            if (!jwtHelper.isTokenExpired(token)) {
                if (!auth.isAuthenticated) {
                    auth.authenticate(store.get('profile'), token);
                }
            } else {
                if (refreshToken) {
                    if (refreshingToken === null) {
                        refreshingToken = auth.refreshIdToken(refreshToken).then(function (idToken) {
                            store.set('token', idToken);
                            auth.authenticate(store.get('profile'), idToken);
                        }).finally(function () {
                            refreshingToken = null;
                        });
                    }
                    return refreshingToken;
                } else {
                    $location.path('/login');
                }
            }
        }
    });
    auth.hookEvents();
});