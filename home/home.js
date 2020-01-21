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



  .controller('homeCtrl', ['carManagerService', '$scope', '$http', 'store', 'jwtHelper','$state', function (carManagerService, $scope, $http, store, jwtHelper, $state) {

    $scope.userDevices = [];
    $scope.userDevicesEventsAllFilled = false;
    $scope.userDevicesEventsAll = {};
    $scope.userDevicesEvents = {};
    $scope.selectedEvent={};
    $scope.jwt = store.get('jwt');
    decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
    $scope.username = decodedJwt.username;
    $scope.selectedDevice = {};

    carManagerService.getDeviceEvents().then(function (response) {
      $scope.userDevicesEventsAll = response.data;
      $scope.userDevicesEventsAllFilled = true;
    });

    $scope.$watch('userDevicesEventsAll', function () {
      if ($scope.userDevicesEventsAllFilled) {
        $scope.selectedDevice = $scope.userDevices[0];
        //alert('userDevicesEventsAll '+JSON.stringify(JSON.stringify($scope.userDevicesEventsAll)));
        $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function (element) {
          return element.device_id == $scope.userDevices[0].device_id;
        })
      }
    });

    $scope.$watch('selectedDevice', function (newvalue, oldvalue) {
      //alert('selectedDevice '+JSON.stringify(newvalue));
      if ($scope.userDevicesEventsAllFilled) {
        $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function (element) {
          return element.device_id == newvalue.fields.device_id;
        })
      }
    });

    $scope.$watch('userDevices', function () {
      //alert('userDevices '+JSON.stringify($scope.userDevices[0]));
      if ($scope.userDevicesEventsAllFilled) {

        $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function (element) {
          return element.device_id == $scope.userDevices[0].device_id;
        })
      }
    });

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
      neighborhoods = []

      $scope.userDevicesEvents.forEach(element => {
        
      if(element.type=="POSITION")
        neighborhoods.push(element.data)


          // console.log(String(neighborhoods));


      });



      var myJSON = JSON.stringify(neighborhoods);
      // var myJSON = "";

      // $state.go('map',{bookName:myJSON});
      $state.go('map',{coordinates:myJSON});
    }

    $scope.selectDeviceEvent = function (deviceEvent) {
      $scope.selectedEvent = deviceEvent;
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

