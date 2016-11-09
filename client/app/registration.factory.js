(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .factory('RegistrationFactory', RegistrationFactory);

    RegistrationFactory.$inject = ['$http', '$q', 'userAdminURL'];

    function RegistrationFactory($http, $q, userAdminURL) {

        var service = {
            checkIfEmailAlreadyExists: checkIfEmailAlreadyExists,
            checkIfUsernameAlreadyExists: checkIfUsernameAlreadyExists
        
        };
        
        return service;

        // checks if an email address is already in the user table within the UserAdmin database
        function checkIfEmailAlreadyExists(emailaddress) {

        	var defer = $q.defer();

        	$http({
        		method: 'GET',
        		url: userAdminURL + 'users/search',
        		params: {
        			emailaddress: emailaddress
        		}
        	})
            .then(function(response) {

                // if email address exists, pass back the data to the controller
            	if (typeof response.data === 'object') {

            		defer.resolve(response.data);

            	} else {

            		defer.reject(response);

            	}
            },

            // HTTP error handler
            function(error){

            	defer.reject(error);

            });

            return defer.promise;
        }

        // checks if a username is already in the user table within the UserAdmin database
        function checkIfUsernameAlreadyExists(username) {

        	var defer = $q.defer();

        	$http({
        		method: 'GET',
        		url: userAdminURL + 'users/search',
        		params: {
        			username: username
        		}
        	})
            .then(function(response) {

                // if username exists, passback the data to the controller
            	if (typeof response.data === 'object') {

            		defer.resolve(response.data);

            	} else {

            		defer.reject(response);

            	}
            },
            // HTTP error handler
            function(error){

            	defer.reject(error);

            });

            return defer.promise;
        }

    }
})();