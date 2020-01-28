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




    carManagerService.getUserDevices().then(function (request) {
      $scope.userDevices = request.data;
    })


    $scope.selectDeviceEvent = function (deviceEvent) {
      $scope.selectedEvent = deviceEvent;


      if(deviceEvent.type=="POSITION"){
        var position = JSON.parse(deviceEvent.data);
        var center = new google.maps.LatLng(position.latitude, position.longitude);
        $scope.gMap.panTo(center);
      }


    }
    //var winInfo = new google.maps.InfoWindow();
    var googleMapOption = {
      zoom: 4,
      center: new google.maps.LatLng(25, 80),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    var mapDiv= document.getElementById('mapDiv');
    $scope.gMap = new google.maps.Map(document.getElementById('mapDiv'), googleMapOption);



  }]);

