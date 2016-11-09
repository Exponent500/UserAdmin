(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['toastr', '$state', 'RegistrationFactory', 'UserManagerFactory'];

    /* @ngInject */
    function RegistrationController(toastr, $state, RegistrationFactory, UserManagerFactory) {
        
        var vm = this;
        var userToAdd;

        // initialize all variables
        vm.emailaddress = '';
        vm.firstname = '';
        vm.lastname = '';
        vm.password ='';
        vm.retypepassword = '';
        vm.username = '';

        vm.register = register;
        activate();

        function activate() {
        }

        function register () {

            // verify that password and re-typed password match
            if (vm.password !== vm.retypepassword){

                toastr.error("Passwords don't match");
                vm.password = '';
                vm.retypepassword = '';
                return;
            
            }

            // check to see if the email address entered already exists
            RegistrationFactory.checkIfEmailAlreadyExists(vm.emailaddress).then(

                // email address exists. Let the user know.
                function(response){

                    toastr.warning("Email address already exists, if you don't remember your login credentials, please create a new account with a different email address");

                },

                // email address doesn't exist
                function(error){

                    // check if username exists
                    RegistrationFactory.checkIfUsernameAlreadyExists(vm.username).then(

                        // username exists. Let the user know.
                        function(response){

                            toastr.warning("Username already exists, please choose another");

                        },

                        // username doesn't exist
                        function(error){

                            // prepare user object to be added to users table in UserAdmin database
                            userToAdd = {

                                firstName: vm.firstname,
                                lastName: vm.lastname,
                                emailAddress: vm.emailaddress,
                                userName: vm.username,
                                password: vm.password,
                                dateCreated : new Date().toISOString() 
                            
                            };
                            
                            // add user 
                            UserManagerFactory.addUser(userToAdd).then(

                                function(response){

                                    toastr.success("Successfully registered");

                                    // clear all registration form input fields
                                    vm.firstname = '';
                                    vm.lastname = '';
                                    vm.emailaddress = '';
                                    vm.username = '';
                                    vm.password = '';

                                    // jump to the login page
                                    $state.go('login');

                                },

                                function(error){

                                    toastr.error('There was an error');

                                });


                        });
                });
        }
    }
})();