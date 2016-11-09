(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['toastr', 'LoginFactory', '$state'];

    function LoginController(toastr, LoginFactory, $state) {
        
        var vm = this;
        var userRole = '';

        vm.password = '';
        vm.username ='';

        vm.onLoginButtonClick = onLoginButtonClick;
        activate();

        ////////////////

        function activate() {

        }

        // function called when Login Button is Clicked
        function onLoginButtonClick (){
            
            // authenticate login credentials
            LoginFactory.login(vm.username, vm.password).then(

                function(response) {

                    // check what roles the user has 
                    for (var i = 0; i < response[0].userRole.length; i++ ){

                        // check to see if user is a super admin
                        if (response[0].userRole[i].roleId === 1) {

                            userRole = 'super admin';
                            $state.go('home', {role : userRole, username : vm.username});

                        // check to see if user is an admin
                        } else if (response[0].userRole[i].roleId === 2) {

                            userRole = 'admin';

                        // check to see if user is a regular user
                        } else {

                            userRole = 'user';

                        }

                    }

                    // if there is no role assigned to the user, default to them being a regular user
                    if (userRole === ''){
                        toastr.warning("You don't have any permissions set, please check with the administrator");
                    }

                },

                function(error) {

                    if (error.status === 404) {

                        toastr.error('Bad username and/or password');

                    } else {

                        toastr.error('Uknown erorr' + error);

                    }
                }

            );

        }
    }
})();