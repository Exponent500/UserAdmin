(function() {
    'use strict';

angular
        .module('UserAdminApp', [
        	'ngMessages', 
        	'toastr',
        	'ui.router',
            'angularjs-dropdown-multiselect',
            'LocalStorageModule'
    	])
        .value ('userAdminURL', 'http://localhost:57183/api/')
    	.config (function($stateProvider, $urlRouterProvider){

    		// For any unmatched url, redirect to /login state
    		$urlRouterProvider.otherwise("/login");

    		//Set up the states
    		$stateProvider
    			.state('login', {
					url:"/login",
					templateUrl: "app/states/login.html",
                    controller: 'LoginController as vm'
    			})
                .state('registration', {
                    url:"/registration",
                    templateUrl: "app/states/registration.html",
                    controller: 'RegistrationController as vm'
                })
                .state('home', {
                    url:"/home/:role/:username",
                    templateUrl: "app/states/home.html",
                    controller: 'HomeController as vm'
                })
                .state('usermanager', {
                    url:"/usermanager/:username/:role",
                    templateUrl:"app/states/usermanager.html",
                    controller: 'UserManagerController as vm'
                })
                .state('rolemanager', {
                    url:"/rolemanager/:username/:role",
                    templateUrl:"app/states/rolemanager.html",
                    controller: 'RoleManagerController as vm'
                })
                .state('userrolemanager', {
                    url:"/userrolemanager/:username/:role",
                    templateUrl:"app/states/userrolemanager.html",
                    controller: 'UserRoleManagerController as vm'
                })
                ;
    	});

})();

