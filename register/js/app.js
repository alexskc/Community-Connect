function logout(e) {
    sessionStorage.setItem("userID", null);
    sessionStorage.setItem("community_id", null);
  firebase.auth().signOut();
}

var myApp = angular.module('myApp', 
  ['ngRoute', 'firebase']);

myApp.run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
    if (error == 'AUTH_REQUIRED') {
      $rootScope.message = 'Sorry, you must log in to access that page';
      $location.path('/login');
    }//Auth Required
  }); //$routeChangeError
}]); //run


myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/events', {
      templateUrl: 'views/events.html',
      controller: 'EventsController'
    }).
    when('/community_create', {
        templateUrl: 'views/community_create.html',
        controller: 'CreateController'
    }).
    when('/Maintain', {
        templateUrl: 'views/maintenancepaylog.html',
        controller: 'MaintController'
    }).
    when('/request_page', {
      templateUrl: 'views/request.html',
      controller: 'RequestController'
    }).
    when('/admin', {
        templateUrl: 'views/admin_view.html',
        controller: 'AdminController'
    }).
    when('/success', {
      templateUrl: 'views/success.html',
      controller: 'SuccessController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //currentAuth
      }//resolve
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);
