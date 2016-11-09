(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .factory('LoginFactory', LoginFactory);

    LoginFactory.$inject = ['$http', '$q', 'userAdminURL'];

    function LoginFactory($http, $q, userAdminURL) {
        
        var service = {
  
            login: login
  
        };
  
        return service;

        // check if username/password exists
        function login(username, password){

        	var defer = $q.defer();
        	
            // make HTTP GET call to users table in UserAdmin database to see if username/password combination exists
            $http({
            	
                method: 'GET',
            	url: userAdminURL + 'users/search',
            	params: {
            		username: username,
            		password: password
            	}

            })
            .then(function(response) {
                
                // if username/password combination exists, passback the data to the controller
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