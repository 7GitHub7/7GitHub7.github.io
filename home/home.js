angular.module('carmanager.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
    'zingchart-angularjs'

])


.controller('homeCtrl', ['carManagerService', '$scope', '$http', 'store', 'jwtHelper', '$state', function(carManagerService, $scope, $http, store, jwtHelper, $state) {

    $scope.eventDate = new Date();
    $scope.userDevices = [];
    $scope.userDevicesEventsAllFilled = false;
    $scope.userDevicesEventsAll = {};
    $scope.userDevicesEvents = {};
    $scope.selectedEvent = {};
    $scope.jwt = store.get('jwt');
    decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
    $scope.username = decodedJwt.username;
    $scope.selectedDevice = {};
    $chart = []



    $scope.$watch('userDevicesEventsAll', function() {
        if ($scope.userDevicesEventsAllFilled) {
            $scope.selectedDevice = $scope.userDevices[0];
            $scope.filterEvents($scope.userDevices[0].device_id, $scope.eventDate);
        }
    });

    $scope.$watch('eventDate', function() {
        if ($scope.userDevicesEventsAllFilled) {
            $scope.filterEvents($scope.selectedDevice.fields.device_id, $scope.eventDate);
        }
    });

    $scope.$watch('selectedDevice', function(newvalue, oldvalue) {
        //alert('selectedDevice '+JSON.stringify(newvalue));
        if ($scope.userDevicesEventsAllFilled) {
            $scope.filterEvents(newvalue.fields.device_id, $scope.eventDate);
        }
    });

    $scope.$watch('userDevices', function() {
        //alert('userDevices '+JSON.stringify($scope.userDevices[0]));
        if ($scope.userDevicesEventsAllFilled) {

            $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function(element) {
                return element.device_id == $scope.userDevices[0].device_id;
            })
        }
    });
    $scope.filterEvents = function(deviceId, eventDate) {
        $scope.userDevicesEvents = $scope.userDevicesEventsAll.filter(function(element) {
            var data = new Date(Date.parse(element.date)).toDateString();
            var data1 = eventDate.toDateString();
            return element.device_id == deviceId && data == data1;
        })
    }
    $scope.selectDeviceEvent = function(deviceEvent) {
        $scope.selectedEvent = deviceEvent;


        if (deviceEvent.type == "POSITION") {
            var position = JSON.parse(deviceEvent.data);

            //var position = { lat: parseFloat(position.latitude), lng: parseFloat(position.longitude) };

            //console.log(position);


            L.marker([position.latitude, position.longitude]).addTo($scope.gMap);
            $scope.gMap.panTo([position.latitude, position.longitude]);

        }


    }

    $scope.loadDeviceEvents = function() {
        carManagerService.getDeviceEvents().then(function(response) {
            //console.log(response.data);

            $scope.userDevicesEventsAll = response.data;
            //console.log($scope.userDevicesEventsAll);
            $scope.userDevicesEventsAllFilled = true;

            initChart();
        });


    }

    function initChart() {
        console.log($scope.userDevicesEvents);
        rpm = []
        speed = []



        $scope.userDevicesEventsAll.forEach(element => {

            if (element.type == "RPM") {
                console.log(element);
                element = JSON.parse(element.data)
                console.log(element);



                rpm.push(element.rpm)
                console.log($chart);
            }
            if (element.type == "SPEED") {
                console.log(element);
                element = JSON.parse(element.data)
                console.log(element);



                speed.push(element.speed)
                console.log($chart);
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

    }


    $scope.loadUserDevices = function() {
        carManagerService.getUserDevices().then(function(request) {
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
    $scope.gMap = L.map('mapDiv').setView([51.505, -0.09], 13);
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo($scope.gMap);
    //initChart();

}]);