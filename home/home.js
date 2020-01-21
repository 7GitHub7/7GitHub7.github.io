angular.module('carmanager.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial',
    'zingchart-angularjs'

  ])
  .config(function ($stateProvider, $mdIconProvider) {

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

      $scope.myJson = {  
        type : 'line' ,  
        series : [  
          { values : [ 54 , 23 , 34 , 23 , 43 ] },  
          { values : [ 10 , 15 , 16 , 20 , 40 ] }  
        ]  
      };

     
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

 