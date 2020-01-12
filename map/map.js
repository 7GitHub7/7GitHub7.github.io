var cities = [];

function initCities(citiList) {
  cities = citiList;
  console.log(cities);
  console.log("sd");

}


angular.module('sample.map', ['ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'
  ])


  .config(function ($stateProvider) {
    $stateProvider.state('map', {
      url: '/map',
      controller: 'MapCtrl',
      templateUrl: 'map/map.html',
      data: {
        requiresLogin: true
      }
    });
   
  })
  .controller('MapCtrl', function MapController($scope, $rootScope, $compile, $http, store, jwtHelper,$state) {

    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    console.log($scope.jwt);

    var winInfo = new google.maps.InfoWindow();

    var googleMapOption = {
      zoom: 4,
      center: new google.maps.LatLng(25, 80),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
  
    $scope.gMap = new google.maps.Map(document.getElementById('mapDiv'), googleMapOption);

    $scope.$on('$viewContentLoaded', function(){
      makeRequest('Anonymous', 'https://pacific-river-86141.herokuapp.com/events/');
      //initialize();
    });

    function makeRequest(type, url) {
      $scope.response = null;
      $scope.api = type;
      $http({
        url: url,
        method: 'GET'
      }).then(function (quote) {
        $scope.response = quote.data;
        quote.data.forEach(element => {
          if (element.fields.type == 'GPS') {
            console.log(element);
            cor = String(element.fields.data).split(',')
            console.log(cor);
            cities = [{
              title: 'UĆ',
              lat: cor[0],
              lng: cor[1]
            }];

          }
        });
        initialize();
      }, function (error) {
        $scope.response = error.data;
      });
    }



    




    function initialize() {

      console.log('Hi from init');



      $scope.infowindow = new google.maps.InfoWindow({
        content: ''
      });

      console.log(cities.length);
      console.log(cities);
      // for (var i = 0; i < cities.length; i++) {

      //   console.log(cities[i].lng);
      //   var marker = new google.maps.Marker({
      //     position: new google.maps.LatLng(cities[i].lat, cities[i].lng),
      //     map: $scope.map,
      //     title: cities[i].title
      //   });

      //   var content = '<a ng-click="cityDetail(' + i + ')" class="btn btn-default">View details</a>';
      //   var compiledContent = $compile(content)($scope)

      //   google.maps.event.addListener(marker, 'click', (function (marker, content, scope) {
      //     return function () {
      //       scope.infowindow.setContent(content);
      //       scope.infowindow.open(scope.map, marker);
      //     };
      //   })(marker, compiledContent[0], $scope));

      // }

    }

    $scope.cityDetail = function (index) {
      alert(JSON.stringify(cities[index]));
    }


    console.log(cities);
    //google.maps.event.addDomListener(window, 'load', initialize);

  });
