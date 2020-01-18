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

  .controller('TitleController', function($scope) {
    $scope.title = 'Odczytane parametry';
  })

 

  .controller('HomeCtrl', function HomeController($scope, $http, store, jwtHelper, $state) {

    $scope.jwt = store.get('jwt');
    decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
    $scope.username = decodedJwt.username;

    $scope.callAnonymousApi = function () {
      // Just call the API as you'd do using $http
      callApi('Anonymous', 'https://pacific-river-86141.herokuapp.com/device-events/');
    }

    $scope.callSecuredApi = function () {
      callApi('Secured', 'https://pacific-river-86141.herokuapp.com/device-events/');
    }

    $scope.goToMap = function () {
    
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
        console.log(quote.data[0])
        imagePath = "";
        $scope.todos = [];
       
        quote.data.forEach(element => {
         
          $scope.todos.push({
           
            what: element.data,
            who: element.type,
            when: element.date,
            // notes: element.fields.device_id
          }, )

        });


      }, function (error) {
        $scope.response = error.data;
      });
    }

  });

 