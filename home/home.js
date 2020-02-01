angular.module('carmanager.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
    'zingchart-angularjs'

  ])


  .controller('homeCtrl', ['carManagerService', '$scope', '$http', 'store', 'jwtHelper', '$state', function (carManagerService, $scope, $http, store, jwtHelper, $state) {

    $scope.eventDate = new Date();
    $scope.userDevices = [];
    $scope.userDevicesEventsAllFilled = false;
    $scope.userDevicesEventsAll = {};
    $scope.userDevicesEvents = {};
    $scope.userDevicesEventsFilter = {};
    $scope.selectedEvent = {};
    $scope.jwt = store.get('jwt');
    decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
    $scope.username = decodedJwt.username;
    $scope.selectedDevice = {};
    $chart = []



    $scope.$watch('userDevicesEventsAll', function () {
      if ($scope.userDevicesEventsAllFilled) {
        $scope.selectedDevice = $scope.userDevices[0];
        $scope.filterEvents($scope.userDevices[0].device_id, $scope.eventDate);

      }
      // initChart()
    });

    $scope.$watch('eventDate', function () {
      if ($scope.userDevicesEventsAllFilled) {
        $scope.filterEvents($scope.selectedDevice.fields.device_id, $scope.eventDate);
      }
      initChart()
      $scope.userDevicesEventsFilter = $scope.userDevicesEvents.filter(function (element) {
        return element.type == 'DTC';
      })
    });

    $scope.$watch('selectedDevice', function (newvalue, oldvalue) {
      //alert('selectedDevice '+JSON.stringify(newvalue));
      if ($scope.userDevicesEventsAllFilled) {
        $scope.filterEvents(newvalue.fields.device_id, $scope.eventDate);
      }
    });

    $scope.$watch('userDevices', function () {
      //alert('userDevices '+JSON.stringify($scope.userDevices[0]));
      if ($scope.userDevicesEventsAllFilled) {

        $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function (element) {
          return element.device_id == $scope.userDevices[0].device_id;


        })
      }
    })
    $scope.filterEvents = function (deviceId, eventDate) {
      $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function (element) {
        var data = new Date(Date.parse(element.date)).toDateString();
        var data1 = eventDate.toDateString();
        return element.device_id == deviceId && data == data1;
      })
    }
    $scope.selectDeviceEvent = function (deviceEvent) {
      $scope.selectedEvent = deviceEvent;
      $userDevicesEventsFilter = $scope.userDevicesEvents.filter(function (element) {
        return element.type == "DTC";
      })

      if (deviceEvent.type == "POSITION") {
        var position = JSON.parse(deviceEvent.data);

        //var position = { lat: parseFloat(position.latitude), lng: parseFloat(position.longitude) };

        //console.log(position);


        L.marker([position.latitude, position.longitude]).addTo($scope.gMap);
        $scope.gMap.panTo([position.latitude, position.longitude]);

      } else if (deviceEvent.type == "SPEED") {
        $scope.setGaugeValue('Prędkość', parseFloat(JSON.parse(deviceEvent.data).speed))
      } else if (deviceEvent.type == "RPM") {
        $scope.setGaugeValue('Obroty', parseFloat(JSON.parse(deviceEvent.data).rpm))
      }



    }

    function initChart() {
      console.log($scope.userDevicesEvents);
      rpm = []
      speed = []
      RpmObjectId = []
      SpeedObjectId = []



      $scope.userDevicesEvents.forEach(element => {

        if (element.type == "RPM") {
          RpmObjectId.push(element.id)
          element = JSON.parse(element.data)
          rpm.push(element.rpm)




        }
        if (element.type == "SPEED") {
          SpeedObjectId.push(element.id)
          element = JSON.parse(element.data)
          speed.push(element.speed)
          console.log("SPEED");
          console.log(SpeedObjectId);


        }

      });

      $scope.myJson = {
        type: 'line',
        series: [{
            values: rpm
          },
          {
            values: speed
          }


        ]

      };

      zingchart.click = function (p) {
        if (p.targetid == "myChart-img") {
          return;
        }

        targetidTab = p.targetid.split('-')
        // numer lini danych
        plot = parseInt(targetidTab[5])
        // numer punktu 
        node = parseInt(targetidTab[7])

        //rpm
        if (plot == 0) {
          console.log(RpmObjectId[node]);

          var obj = $scope.userDevicesEventsAll.filter(function (element) {
            return element.id == RpmObjectId[node];
          })
          //pozycja dla tego eventu
          var positionObj = $scope.userDevicesEventsAll.filter(function (element) {
            return element.type == "POSITION" && element.date == obj[0].date;
          })
          //parse string data do json object
          elementData = JSON.parse(positionObj[0].data)
          //zaznacz na mapie
          L.marker([elementData.latitude, elementData.longitude]).addTo($scope.gMap);
          $scope.gMap.panTo([elementData.latitude, elementData.longitude]);
          //wyswietl dane 
          displayObj = "<br>Pomiar: " + obj[0].data + "<br>Data: " + obj[0].date + "<br>Telefon: " + obj[0].phone_number
          zcdocs.demos.dump('<br>RPM', displayObj);
        }
        //speed
        if (plot == 1) {
          var obj = $scope.userDevicesEventsAll.filter(function (element) {
            return element.id == SpeedObjectId[node];
          })
          //pozycja dla tego eventu
          var positionObj = $scope.userDevicesEventsAll.filter(function (element) {
            return element.type == "POSITION" && element.date == obj[0].date;
          })
          //parse string data do json object
          elementData = JSON.parse(positionObj[0].data)
          //zaznacz na mapie
          L.marker([elementData.latitude, elementData.longitude]).addTo($scope.gMap);
          $scope.gMap.panTo([elementData.latitude, elementData.longitude]);
          //wyswietl dane 
          displayObj = "<br>Pomiar: " + obj[0].data + "<br>Data: " + obj[0].date + "<br>Telefon: " + obj[0].phone_number
          zcdocs.demos.dump('<br>SPEED', displayObj);

        }

      }

      zingchart.render({
        id: 'demo-chart',
        data: $scope.myJson,
        height: 400,
        width: '100%'
      });


    }

    $scope.loadDeviceEvents = function () {
      carManagerService.getDeviceEvents().then(function (response) {
        //console.log(response.data);

        $scope.userDevicesEventsAll = response.data;
        //console.log($scope.userDevicesEventsAll);
        $scope.userDevicesEventsAllFilled = true;
      });
    }




    $scope.setGaugeValue = function (label, value) {
      $scope.myJson = {
        type: 'gauge',
        series: [{
          values: [value],
          text: label
        }],
        title: {
          text: label
        }

      };
    }

    $scope.loadUserDevices = function () {
      carManagerService.getUserDevices().then(function (request) {
        $scope.userDevices = request.data;
        $scope.loadDeviceEvents();
      })
    };

    $scope.loadUserDevices();


    //var winInfo = new google.maps.InfoWindow();
    // var googleMapOption = {
    //     zoom: 4,
    //     center: new google.maps.LatLng(25, 80),
    //     mapTypeId: google.maps.MapTypeId.TERRAIN
    // };
    // var mapDiv = document.getElementById('mapDiv');
    //$scope.gMap = new google.maps.Map(document.getElementById('mapDiv'), googleMapOption);
    $scope.gMap = L.map('mapDiv').setView([53.67333984375, 19.242389678955078], 13);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo($scope.gMap);
    //initChart();

  }]);
