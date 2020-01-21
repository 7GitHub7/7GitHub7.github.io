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

  .controller('TitleController', function ($scope) {
    $scope.title = 'Odczytane parametry';


  })



  .controller('homeCtrl', ['carManagerService', '$scope', '$http', 'store', 'jwtHelper', function (carManagerService, $scope, $http, store, jwtHelper, $state) {

    $scope.userDevices = [];
    $scope.userDevicesEventsAll = {};
    $scope.userDevicesEvents = {};
    $scope.jwt = store.get('jwt');
    decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
    $scope.username = decodedJwt.username;

    carManagerService.getDeviceEvents().then(function(response){
      $scope.userDevicesEventsAll = response.data;
    });

    $scope.selectedDeviceChanged = function (selectedDevice) {
      $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function(element){
        return element.device_id ==selectedDevice.fields.device_id;
      })
    }

    $scope.callAnonymousApi = function () {
      // Just call the API as you'd do using $http
      callApi('Anonymous', 'https://pacific-river-86141.herokuapp.com/device-events/');
    }

    $scope.callSecuredApi = function () {
      callApi('Secured', 'https://pacific-river-86141.herokuapp.com/device-events/');
    }


    carManagerService.getUserDevices().then(function (request) {
      $scope.userDevices = request.data;
    })

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
          })

        });


      }, function (error) {
        $scope.response = error.data;
      });
    }

  }]);

