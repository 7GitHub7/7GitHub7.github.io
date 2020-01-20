angular.module('carmanager.login', [
  'ui.router',
  'angular-storage'
])
  .config(function ($stateProvider) {

  })
  .controller('LoginCtrl', function LoginController($scope, $http, store, $state) {

    $scope.user = {};

    $scope.login = function () {
      $http({
        url: 'https://pacific-river-86141.herokuapp.com/api/token/',
        method: 'POST',
        data: $scope.user
      }).then(function (response) {
        store.set('jwt', response.data.access);
        $state.go('home');
      }, function (error) {
        alert(JSON.stringify(error.data));
      });
    }

  });
