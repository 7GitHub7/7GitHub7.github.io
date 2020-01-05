angular.module( 'sample.home', [
  'ui.router',
  'angular-storage',
  'angular-jwt'
])
.config(function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: 'home/home.html',
    data: {
      requiresLogin: true
    }
  });
})
.controller( 'HomeCtrl', function HomeController( $scope, $http, store, jwtHelper) {

  $scope.jwt = store.get('jwt');
  $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

  $scope.callAnonymousApi = function() {
    // Just call the API as you'd do using $http
    callApi('Anonymous', 'https://pacific-river-86141.herokuapp.com/api/token/refresh/');
  }

  $scope.callSecuredApi = function() {
    callApi('Secured', 'https://pacific-river-86141.herokuapp.com/api/token/refresh/');
  }

  function callApi(type, url) {
    $scope.response = null;
    $scope.api = type;
    $http({
      url: url,
      method: 'POST'
    }).then(function(quote) {
      $scope.response = quote.data;
    }, function(error) {
      $scope.response = error.data;
    });
  }

});
