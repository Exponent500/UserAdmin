(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .factory('UserRoleManagerFactory', UserRoleManagerFactory);

    UserRoleManagerFactory.$inject = ['$q', '$http', 'userAdminURL'];

    /* @ngInject */
    function UserRoleManagerFactory($q, $http, userAdminURL) {

        var service = {
        	addUserRole: addUserRole,
        	deleteUserRole: deleteUserRole,
        	getAllUserRoles: getAllUserRoles,
        	updateUserRole: updateUserRole

        };
        return service;

        ////////////////

        // Get all user roles from UserRoles table within the UserAdmin database
        function getAllUserRoles() {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: userAdminURL + 'userroles/join'
            })
            .then(function(response) {

                if (typeof response.data === 'object') {

                    defer.resolve(response.data);

                } else {

                    defer.reject(response);

                }
            },
            // HTTP error handler
            function(error) {

                defer.reject(error);

            });

            return defer.promise;
            
        }

        // Add a user role to the UserRoles table within the UserAdmin database
        function addUserRole(userRole) {

        	var defer = $q.defer();

        	$http({
        		method: 'POST',
        		url: userAdminURL + 'userroles',
        		data: userRole,
        		headers: {
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}	
	        })
			.then(function(response) {

				if (typeof response.data === 'object') {

					defer.resolve(response.data);

				} else {

					defer.reject(response);

				}
			},
            // HTTP error handler
			function(error) {

				defer.reject(error);

			});

			return defer.promise;
			
	    }

        // Update a user role in the User Roles table that is in the UserAdmin database
        function updateUserRole(userRole) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: userAdminURL + 'userroles',
                data: userRole,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }   
            })
            .then(function(response) {

                if (typeof response.data === 'object') {

                    defer.resolve(response.data);

                } else {

                    defer.reject(response);

                }
            },
            // HTTP error handler
            function(error) {

                defer.reject(error);

            });

            return defer.promise;
            
        }

        // Delete a user role from User Roles table within the UserAdmin database
        function deleteUserRole(userRole) {

            var defer = $q.defer();

            $http({

                method: 'DELETE',
                url: userAdminURL + userRole

            })
            .then(function(response) {

                if (typeof response.data === 'object') {

                    defer.resolve(response.data);

                } else {

                    defer.reject(response);

                }
            },
            // HTTP error handler
            function(error) {

                defer.reject(error);

            });

            return defer.promise;
            
        }



        
    }
})();