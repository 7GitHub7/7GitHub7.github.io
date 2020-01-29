angular.module('carmanager.adddevice', ['ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'
])


    .controller('addDeviceCtrl', ['carManagerService', '$scope', '$http', function (carManagerService, $scope, $http, store, jwtHelper, $state) {
        $scope.userDevices = {};
        $scope.deviceName = '';
        $scope.carModel='';
        $scope.registrationPlate='';

        $scope.getUserDevices = function () {
            carManagerService.getUserDevices().then(function (request) {
                $scope.userDevices = request.data;
            })
        };

        $scope.addDevice = function () {

            var device = {}
            device.deviceName = $scope.deviceName;
            device.carModel = $scope.carModel;
            device.registrationPlate = $scope.registrationPlate;

            carManagerService.addDevice(device).then(function (request) {
                $scope.getUserDevices();
            }, function (request) {
                alert(JSON.stringify(request));
            });
        }

        $scope.getUserDevices();
    }])


