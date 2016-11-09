(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .factory('UserManagerFactory', UserManagerFactory);

    UserManagerFactory.$inject = ['$http', '$q', 'userAdminURL'];

    /* @ngInject */
    function UserManagerFactory($http, $q, userAdminURL) {
        var service = {
            addUser: addUser,
            deleteUser: deleteUser,
            getAllUserRoles: getAllUserRoles,
            getAllUsers: getAllUsers,
            updateUser: updateUser,
            getAllUsersWithTheirRoles: getAllUsersWithTheirRoles
        };
        return service;

        ////////////////

        // Get all users from Users table within the UserAdmin database
        function getAllUsers() {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: userAdminURL + 'users'
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

        // Get all users and their roles from within the UserAdmin database
        function getAllUsersWithTheirRoles() {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: userAdminURL + 'users/roles'
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

        // Get all roles for a specific user from within the UserAdmin database
        function getAllUserRoles(userId) {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: userAdminURL + 'users/' + userId + '/roles',
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

        // Add a user to the users table within the UserAdmin database
        function addUser(user) {

        	var defer = $q.defer();

        	$http({
        		method: 'POST',
        		url: userAdminURL + 'users',
        		data: $.param({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    userName: user.userName,
                    password: user.password,
                    dateCreated : user.dateCreated 
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

        // Update a user in the users table that is in the UserAdmin database
        function updateUser(user) {

            var defer = $q.defer();

            $http({
                method: 'PUT',
                url: userAdminURL + 'users/' + user.userId,
                data: $.param({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddress,
                    userName: user.userName,
                    password: user.password,
                    dateCreated : user.dateCreated,
                    userId: user.userId
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

        // Delete user from users table within the UserAdmin database
        function deleteUser(userId) {

            var defer = $q.defer();

            $http({

                method: 'DELETE',
                url: userAdminURL + 'users/' + userId

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