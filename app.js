angular.module( 'sample', [
  'sample.login',
  'sample.home',
  'sample.signup',
  'angular-jwt',
  'angular-storage'
])
.config( function myAppConfig ($urlRouterProvider, jwtInterceptorProvider ,jwtOptionsProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  jwtInterceptorProvider.tokenGetter = function(store) {
    var token = store.get('jwt');
    return token;
  }
  jwtOptionsProvider.config({

    whiteListedDomains: ['api.myapp.com', 'localhost', 'pacific-river-86141.herokuapp.com']
  });
  $httpProvider.interceptors.push('jwtInterceptor');
})
.run(function($transitions,$rootScope, $state, store, jwtHelper) {
  // $rootScope.$on('$stateChangeStart', function(e, to) {
  //   if (to.data && to.data.requiresLogin) {
  //     if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
  //       e.preventDefault();
  //       $state.go('login');
  //     }
  //   }
  // });

  $transitions.onEnter({}, function (trans) {
    if (trans.to().data && trans.to().data.requiresLogin) {
      if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
       // e.preventDefault();
        trans.router.stateService.go('login');
      }
    }
  });
})
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$routeChangeSuccess', function(e, nextRoute){
    if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | ngEurope Sample' ;
    }
  });
})

;

