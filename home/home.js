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
  .controller('HomeCtrl', function HomeController($scope, $http, store, jwtHelper) {

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
          if(element.fields.type == 'TEMP'){
            imagePath = tempPath
          }
          if(element.fields.type == 'RPM'){
            imagePath = rpmPath
          }
          $scope.todos.push({
            face : imagePath,
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

    var imagePath = 'img/60.jpeg';

    // $scope.phones = [
    //   {
    //     type: 'Home',
    //     number: '(555) 251-1234',
    //     options: {
    //       icon: 'communication:phone'
    //     }
    //   },
    //   {
    //     type: 'Cell',
    //     number: '(555) 786-9841',
    //     options: {
    //       icon: 'communication:phone',
    //       avatarIcon: true
    //     }
    //   },
    //   {
    //     type: 'Office',
    //     number: '(555) 314-1592',
    //     options: {
    //       face : imagePath
    //     }
    //   },
    //   {
    //     type: 'Offset',
    //     number: '(555) 192-2010',
    //     options: {
    //       offset: true,
    //       actionIcon: 'communication:phone'
    //     }
    //   }
    // ];




  });


// .config(function($mdIconProvider) {
//   $mdIconProvider
//     .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
// })
// .controller('AppCtrl', function($scope) {
//     var imagePath = 'img/60.jpeg';

//     $scope.phones = [
//       {
//         type: 'Home',
//         number: '(555) 251-1234',
//         options: {
//           icon: 'communication:phone'
//         }
//       },
//       {
//         type: 'Cell',
//         number: '(555) 786-9841',
//         options: {
//           icon: 'communication:phone',
//           avatarIcon: true
//         }
//       },
//       {
//         type: 'Office',
//         number: '(555) 314-1592',
//         options: {
//           face : imagePath
//         }
//       },
//       {
//         type: 'Offset',
//         number: '(555) 192-2010',
//         options: {
//           offset: true,
//           actionIcon: 'communication:phone'
//         }
//       }
//     ];
//     $scope.todos = [
//       {
//         face : imagePath,
//         what: 'Brunch this weekend?',
//         who: 'Min Li Chan',
//         when: '3:08PM',
//         notes: " I'll be in your neighborhood doing errands"
//       },
//       {
//         face : imagePath,
//         what: 'Brunch this weekend?',
//         who: 'Min Li Chan',
//         when: '3:08PM',
//         notes: " I'll be in your neighborhood doing errands"
//       },
//       {
//         face : imagePath,
//         what: 'Brunch this weekend?',
//         who: 'Min Li Chan',
//         when: '3:08PM',
//         notes: " I'll be in your neighborhood doing errands"
//       },
//       {
//         face : imagePath,
//         what: 'Brunch this weekend?',
//         who: 'Min Li Chan',
//         when: '3:08PM',
//         notes: " I'll be in your neighborhood doing errands"
//       },
//       {
//         face : imagePath,
//         what: 'Brunch this weekend?',
//         who: 'Min Li Chan',
//         when: '3:08PM',
//         notes: " I'll be in your neighborhood doing errands"
//       },
//     ];
// });
