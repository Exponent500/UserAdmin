(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .factory('RoleManagerFactory', RoleManagerFactory);

    RoleManagerFactory.$inject = ['$http', '$q', 'userAdminURL'];

    /* @ngInject */
    function RoleManagerFactory($http, $q, userAdminURL) {
        var service = {
            addRole: addRole,
            deleteRole: deleteRole,
            getAllRoles: getAllRoles,
            updateRole: updateRole,
        };
        return service;

        ////////////////

        // Get all users from Users table within the UserAdmin database
        function getAllRoles() {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: userAdminURL + 'roles'
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

        // Add a role to the roles table within the UserAdmin database
        function addRole(role) {

        	var defer = $q.defer();

        	$http({
        		method: 'POST',
        		url: userAdminURL + 'roles',
        		data: $.param({
                    description: role.description,
                    roleType: role.roleType,
                    dateCreated: role.dateCreated 
                }),
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

        // Update a role in the roles table that is in the UserAdmin database
        function updateRole(role) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: userAdminURL + 'roles/' + role.roleId,
                data: $.param({
                    roleId : role.roleId,
                    description: role.description,
                    dateCreated: role.dateCreated
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }   
            })
            .then(function(response) {

                if (response.status === 204) {

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

        // Delete role from roles table within the UserAdmin database
        function deleteRole(roleId) {

            var defer = $q.defer();

            $http({

                method: 'DELETE',
                url: userAdminURL + 'roles/' + roleId

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