var cities = [];

function initCities(citiList) {
  cities = citiList;
  console.log(cities);
  console.log("sd");

}


angular.module('carmanager.map', ['ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'
  ])





  .controller('MapCtrl', function MapController($scope, $rootScope, $compile, $http, store, jwtHelper,$state,$stateParams) {

    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    // console.log( JSON.parse(($stateParams.coordinates)));

    



    var winInfo = new google.maps.InfoWindow();

    var googleMapOption = {
      zoom: 4,
      center: new google.maps.LatLng(25, 80),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
  
    $scope.gMap = new google.maps.Map(document.getElementById('mapDiv'), googleMapOption);

    // var myLatLng = {lat: -25.363, lng: 131.044};

    // var marker = new google.maps.Marker({
    //   position: myLatLng,
    //   map: $scope.gMap,
    //   title: 'Hello World!'
    // });

    $scope.$on('$viewContentLoaded', function(){
      makeRequest('Anonymous', 'https://pacific-river-86141.herokuapp.com/device-events/');
      // UserCtrl();
      //initialize();
    });

    function makeRequest(type, url) {
      $scope.response = null;
      $scope.api = type;
      $http({
        url: url,
        method: 'GET'
      }).then(function (quote) {
        // $scope.response = quote.data;
        // quote.data.forEach(element => {
          
        //   console.log($stateParams);
        //   var obj = String(element.data).replace(/["']/g, "\"");
        //   var objJSON = JSON.parse(obj);
        //   var el = {lat: parseFloat(objJSON.latitude), lng: parseFloat(objJSON.longitude)}
        //   neighborhoods.push(el)
          

        //     // cor = String(obj.latitude)
        //     console.log(String(neighborhoods));
           
          
        // });
      }, function (error) {
        $scope.response = error.data;
      });
    }

    var neighborhoods = [
      
    ];

  
     
  

    var markers = [];
    var map = $scope.gMap;
    $scope.drop = function() {

console.log($stateParams.coordinates);
      $stateParams.coordinates.forEach(element => {
      
        var el = {lat: parseFloat(element.latitude), lng: parseFloat(element.longitude)}
        neighborhoods.push(el)    
      });
      console.log(neighborhoods);
      clearMarkers();
      for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
      }
    }

    function addMarkerWithTimeout(position, timeout) {
      window.setTimeout(function() {
        markers.push(new google.maps.Marker({
          position: position,
          map: map,
          animation: google.maps.Animation.DROP
        }));
      }, timeout);
    }

    function clearMarkers() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    // function initialize(lat,lng) {

    //   console.log('Hi from init');
    //   var myLatLng2 = {lat: lat, lng: lng};
      
    //   var marker2 = new google.maps.Marker({
    //     position: myLatLng2,
    //     map: $scope.gMap,
    //     title: 'Hello World!'
    //   });

      // $scope.infowindow = new google.maps.InfoWindow({
      //   content: ''
      // });
      

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

    

    $scope.cityDetail = function (index) {
      alert(JSON.stringify(cities[index]));
    }


    console.log(cities);

    
    //google.maps.event.addDomListener(window, 'load', initialize);

  });
