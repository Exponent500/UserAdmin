(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('UserManagerController', UserManagerController);

    UserManagerController.$inject = ['toastr', 'UserManagerFactory', 'RegistrationFactory', '$stateParams'];

    /* @ngInject */
    function UserManagerController(toastr, UserManagerFactory, RegistrationFactory, $stateParams) {
        var vm = this;

        var userToAdd;

        // grab these parameters that are coming in from another state
        vm.username = $stateParams.username;
        vm.role = $stateParams.role;
        
        vm.users;

        vm.deleteUser = deleteUser;
        vm.addUser = addUser;
        vm.verifyEmail = verifyEmail;
        vm.verifyPassword = verifyPassword;
        vm.verifyUsername = verifyUsername;
        vm.updateUser = updateUser;

        activate();

        ////////////////

        function activate() {
            // get all users to display to User Manager page
            UserManagerFactory.getAllUsers().then(

                function(response){

                    vm.users = response;

                },

                function(error){



                });
        }

        // add a user to the users table within the UserAdmin Database
        function addUser() {

            // verify that password and re-typed password match
            if (verifyPassword(vm.password, vm.confirmPassword) === false)
                return;

            // check to see if the email address entered already exists
            if (verifyEmail(vm.emailAddress) === true)
                return;

            // check to see if the username already exists
            if (verifyUsername(vm.name) === true)
                return;

            // create user object to add to users table
            userToAdd = {

                firstName: vm.firstName,
                lastName: vm.lastName,
                emailAddress: vm.emailAddress,
                userName: vm.name,
                password: vm.password,
                dateCreated : new Date().toISOString() 
                
            };

            // add user object to users table
            UserManagerFactory.addUser(userToAdd).then(

                function(response){

                    userToAdd.userId = response.userId;
                    vm.users.push(userToAdd);
                    
                    // clear all the Add User fields
                    vm.firstName = "";
                    vm.lastName = "";
                    vm.emailAddress = "";
                    vm.name = "";
                    vm.password = "";
                    vm.confirmPassword = "";

                    // Prevents background from staying in faded state once the "Add User" modal is closed by way of clicking on the "Add User" button
                    $('.modal-backdrop').remove();
                    // Closes Add User modal
                    $('#addUser').modal('hide');
                },

                function(error) {

                    toastr.error('There was an error');

                });



        }

        // delete a user from the user table within the UserAdmin Database
        function deleteUser(userId) {

            UserManagerFactory.deleteUser(userId).then(

                function(response){

                // get the index of the user to delete
                var index = vm.users.map(function(el) {
                    return el.userId;
                }).indexOf(userId);

                // remove the user from the view
                vm.users.splice(index,1);

                // prevent background from staying in faded state once the "Delete User" modal is closed by way of clicking on the "Delete" button
                $('.modal-backdrop').remove();

                },

                function(error) {

                    toastr.error('There was an error');
                });
        }

        // update a user from the user table within the UserAdmin database
        function updateUser(userID) {

             // verify that password and re-typed password match
            if (verifyPassword(vm.password, vm.confirmPassword) === false)
                return;

            // check to see if new username entered is either the same as the previous username or an existing username
            // if it's the same as the previous user name, keep going and check the email address.
            // if it's the same as another user name, break and let the user know so they can choose another user name

            for (var i = 0; i < vm.users.length; i++){
                
                if (vm.users[i].userName === vm.name) {
                    
                    if(vm.users[i].userId === userID) {
                    
                        break;
                    
                    } else {
                     
                        toastr.warning("Username already exists");
                        return;

                    }

                } else {

                }

            }

            // check to see if new email address entered is either the same as the previous email address or an existing email address
            // if it's the same as the previous email address, keep going and check the email address.
            // if it's the same as another email address, break and let the user know so they can choose another email address
            for (var j = 0; j < vm.users.length; j++) {

                if (vm.users[j].emailAddress === vm.emailAddress) {

                    if(vm.users[j].userId === userID) {

                        break;

                    } else {

                        toastr.warning("Email address already exists");
                        return;

                    }

                } else {

                }

            }

            // create user object to add to users table
            userToAdd = {

                firstName: vm.firstName,
                lastName: vm.lastName,
                emailAddress: vm.emailAddress,
                userName: vm.name,
                userId : userID,
                password: vm.password,
                dateCreated : new Date().toISOString() 
                
            };

            // send PUT request to User Table within the UserAdmin database
            UserManagerFactory.updateUser(userToAdd).then(

                // if the PUT was successful, then push the user object to the master users array
                function(response){

                    // get the index of the master user array element that we want to update
                    var index = vm.users.map(function (el) {
                        return el.userId;
                    }).indexOf(userID);

                    // update the master user array element
                    vm.users[index] = userToAdd;

                    // prevent background from staying in faded state once the "Update User" modal is closed by way of clicking on the "Update" button
                    $('.modal-backdrop').remove();

                },

                function(error){

                    toastr.error("There as an error");

                });

        }

        // verifies if password and retype password match 
        function verifyPassword(password, confirmpassword) {

            if (password !== confirmpassword){
                
                toastr.error("Passwords don't match");
                vm.password = '';
                vm.confirmPassword = '';
                return false;

            }

                return true;

        }

        // verifies if email address entered already exists in database
        function verifyEmail(email) {

            for (var i = 0; i < vm.users.length; i++){

                if (vm.users[i].emailAddress === email) {

                    toastr.warning("email address already exists, please choose a different one");
                    return true;

                }

            }

            return false;
       }

       // verifies if username entered already exists in database
       function verifyUsername(username) {

            for (var i = 0; i < vm.users.length; i++) {

                if (vm.users[i].userName === username) {

                    toastr.warning("username already exists, please choose a different one");
                    return true;

                }

            }

            return false;
       }
    }
})();