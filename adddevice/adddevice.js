angular.module('carmanager.adddevice', ['ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'
])


    .controller('addDeviceCtrl', ['carManagerService', '$scope', '$http', function (carManagerService, $scope, $http, store, jwtHelper, $state) {
        $scope.userDevices = {};
        $scope.deviceName = '';

        $scope.getUserDevices = function () {
            carManagerService.getUserDevices().then(function (request) {
                $scope.userDevices = request.data;
            })
        };

        $scope.addDevice = function () {
            carManagerService.addDevice($scope.deviceName).then(function (request) {
                $scope.getUserDevices();
            }, function (request) {
                alert(JSON.stringify(request));
            });
        }

        $scope.getUserDevices();
    }])


