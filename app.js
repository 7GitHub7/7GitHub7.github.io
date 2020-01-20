angular.module( 'carmanager', [
  'carmanager.login',
  'carmanager.home',
  'carmanager.signup',
  'carmanager.map',
  'angular-jwt',
  'angular-storage'
])
.config( function myAppConfig ($urlRouterProvider, jwtInterceptorProvider ,jwtOptionsProvider, $httpProvider,$stateProvider) {
  $urlRouterProvider.otherwise('/');


  $stateProvider.state('map', {
    url: '/map',
    controller: 'MapCtrl',
    templateUrl: 'map/map.html',
    data: {
      requiresLogin: true
    }
  });
   
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: 'home/home.html',
    data: {
      requiresLogin: true
    }
  });

  $stateProvider.state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    templateUrl: 'login/login.html'
  });
  

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
      $scope.pageTitle = nextRoute.$$route.pageTitle + ' | ngEurope ' ;
    }
  });
})

;

