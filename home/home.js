angular.module('sample.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'

  ])
  .config(function ($stateProvider, $mdIconProvider) {
    $stateProvider.state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html',
      data: {
        requiresLogin: true
      }
    });
    $mdIconProvider.iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
  })
  .controller('HomeCtrl', function HomeController($scope, $http, store, jwtHelper, $state) {



    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    $scope.callAnonymousApi = function () {
      // Just call the API as you'd do using $http
      callApi('Anonymous', 'https://pacific-river-86141.herokuapp.com/events/');
    }

    $scope.callSecuredApi = function () {
      callApi('Secured', 'https://pacific-river-86141.herokuapp.com/events/');
    }

    $scope.goToMap = function () {
      cities = [
        { title: 'UĆ', lat: -33.873033, lng: 151.231397 },
        { title: 'Melbourne', lat: -37.812228, lng: 144.968355 }];
        $state.go('map');
      }

    function callApi(type, url) {
      $scope.response = null;
      $scope.api = type;
      $http({
        url: url,
        method: 'GET'
      }).then(function (quote) {
        $scope.response = quote.data;
        console.log(quote.data[1].fields.type)
        imagePath = "";
        $scope.todos = [];
        var rpmPath = '/rpm-png.png';
        var tempPath = '/temp.png';

        quote.data.forEach(element => {
          if (element.fields.type == 'TEMP') {
            imagePath = tempPath
          }
          if (element.fields.type == 'RPM') {
            imagePath = rpmPath
          }
          $scope.todos.push({
            face: imagePath,
            what: element.fields.data,
            who: element.fields.type,
            when: element.fields.date,
            // notes: element.fields.device_id
          }, )

        });


      }, function (error) {
        $scope.response = error.data;
      });
    }

  });
