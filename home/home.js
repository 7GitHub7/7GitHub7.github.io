var cities = [{
  city: 'India',
  desc: 'The Indian economy is the worlds seventh-largest by nominal GDP and third-largest by purchasing power parity (PPP).',
  lat: 23.200000,
  long: 79.225487
}, {
  city: 'New Delhi',
  desc: 'Delhi, officially the National Capital Territory of Delhi, is the Capital territory of India. It has a population of about 11 million and a metropolitan population of about 16.3 million',
  lat: 28.500000,
  long: 77.250000
}, {
  city: 'Mumbai',
  desc: 'Mumbai, formerly called Bombay, is a sprawling, densely populated city on India’s west coast',
  lat: 19.000000,
  long: 72.90000
}, {
  city: 'Kolkata',
  desc: 'Kolkata is the capital of the Indian state of West Bengal. It is also the commercial capital of East India, located on the east bank of the Hooghly River',
  lat: 22.500000,
  long: 88.400000
}, {
  city: 'Chennai	',
  desc: 'Chennai holds the colonial past and is an important city of South India. It was previously known as Madras',
  lat: 13.000000,
  long: 80.250000
}, {
  city: 'Gorakhpur',
  desc: 'Gorakhpur also known as Gorakhshpur is a city along the banks of Rapti river in the eastern part of the state of Uttar Pradesh in India, near the Nepal border 273 east of the state capital Lucknow',
  lat: 26.7588,
  long: 83.3697
}];

angular.module('sample.home', [
    'ui.router',
    'angular-storage',
    'angular-jwt',
    'ngMaterial'

  ])
  .config(function ($stateProvider, $mdIconProvider) {
    $stateProvider.state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: 'home/home.html',
      data: {
        requiresLogin: true
      }
    });
    $mdIconProvider.iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
  })
  .controller('HomeCtrl', function HomeController($scope, $http, store, jwtHelper, $rootScope, $compile) {

    function initialize() {

      $scope.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {
          lat: -25.363,
          lng: 131.044
        }
      });



      $scope.cities = [{
          title: 'Sydney',
          lat: -33.873033,
          lng: 151.231397
        },
        {
          title: 'Melbourne',
          lat: -37.812228,
          lng: 144.968355
        }
      ];


      $scope.infowindow = new google.maps.InfoWindow({
        content: ''
      });


      for (var i = 0; i < $scope.cities.length; i++) {


        var marker = new google.maps.Marker({
          position: new google.maps.LatLng($scope.cities[i].lat, $scope.cities[i].lng),
          map: $scope.map,
          title: $scope.cities[i].title
        });

        var content = '<a ng-click="cityDetail(' + i + ')" class="btn btn-default">View details</a>';
        var compiledContent = $compile(content)($scope)

        google.maps.event.addListener(marker, 'click', (function (marker, content, scope) {
          return function () {
            scope.infowindow.setContent(content);
            scope.infowindow.open(scope.map, marker);
          };
        })(marker, compiledContent[0], $scope));

      }

    }

    $scope.cityDetail = function (index) {
      alert(JSON.stringify($scope.cities[index]));
    }
    setTimeout(function () {
      google.maps.event.addDomListener(window, 'load', initialize);
    }, 9000);


    $scope.jwt = store.get('jwt');
    $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);

    $scope.callAnonymousApi = function () {
      // Just call the API as you'd do using $http
      callApi('Anonymous', 'https://pacific-river-86141.herokuapp.com/events/');
    }

    $scope.callSecuredApi = function () {
      callApi('Secured', 'https://pacific-river-86141.herokuapp.com/events/');
    }

    function callApi(type, url) {
      $scope.response = null;
      $scope.api = type;
      $http({
        url: url,
        method: 'GET'
      }).then(function (quote) {
        $scope.response = quote.data;
        console.log(quote.data[0].fields.type)
        $scope.todos = [];
        var rpmPath = '/rpm-png.png';
        var tempPath = '/temp.png';
        quote.data.forEach(element => {
          if (element.fields.type == 'TEMP') {
            imagePath = tempPath
          }
          if (element.fields.type == 'RPM') {
            imagePath = rpmPath
          }
          $scope.todos.push({
            face: imagePath,
            what: element.fields.data,
            who: element.fields.type,
            when: element.fields.date,
            // notes: element.fields.device_id
          }, )

        });


      }, function (error) {
        $scope.response = error.data;
      });
    }




  });


