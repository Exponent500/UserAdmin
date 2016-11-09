(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('UserRoleManagerController', UserRoleManagerController);

    UserRoleManagerController.$inject = ['toastr', 'UserManagerFactory', 'RoleManagerFactory', '$stateParams'];

    /* @ngInject */
    function UserRoleManagerController(toastr, UserManagerFactory, RoleManagerFactory, $stateParams) {
        var vm = this;

        // grabs the user's role and username from whatever state jumps into the state associated with this controller
        // this is so that the user's role and username can be displayed at the top of every page the user tabs to
        vm.role = $stateParams.role;
        vm.username = $stateParams.username;

        // hides the Edit User Roles form at page load
        vm.editUserRolesForm = false;

        // object to store a role that is read in from the role table 
        var role = {};

        // stores settings for the role selection drop down menu
        // smartButtonMaxItems sets the limit of how many items can be written in the top of the select menu
        // smartButtonTextConvertor determines what text is shown at the top of the select menu
        // in this case we are showing the exact text that is selected when a user makes a selection within the role pull down menu

        vm.roleDropDownMenuSettings = {
            smartButtonMaxItems: 10,
            smartButtonTextConverter: function(itemText) {

                return itemText;
            }
        };

        // stores all the roles listed in the User Admin database
        vm.roles = [];

        vm.rolesForAUser = [];

        // object to store a user's role
        var selectedRole = {};

        // determines which roles are selected in the role drop down list
        vm.selectedRoles = []; 

        // string used to display all the users roles in comma delimited fashion
        var stringOfAllRolesForAUser = '';

        // object to store a user snd their roles
        var userWithTheirRoles = {};

        // array to hold all of the users with their roles
        vm.usersWithTheirRoles = [];


        vm.populateRoleDropDownList = populateRoleDropDownList;
        vm.doneEditingUserRoles = doneEditingUserRoles;
        
        activate();

        ////////////////

        function activate() {
            
            // get all the roles from the role table within the UserAdmin database
            UserManagerFactory.getAllUsersWithTheirRoles().then(

                function(response) {

                    // generate a concatanated list of user roles to be dispayed on the user roles page
                    for (var i = 0; i < response.length; i++){

                        for (var j = 0; j < response[i].roles.length; j++) {

                            if (j < response[i].roles.length - 1) {

                                stringOfAllRolesForAUser += response[i].roles[j].roleType + ", ";

                            } else {

                                stringOfAllRolesForAUser += response[i].roles[j].roleType;

                            }
                            
                        }

                        // create a user role entry to be shown on the user roles page
                        userWithTheirRoles = {

                          name: response[i].firstName + " " + response[i].lastName,
                          index: i + 1,
                          listOfRoles: stringOfAllRolesForAUser,
                          userId: response[i].userId,
                          rolesForAUser: response[i].roles

                        };

                        // fill the user roles array with the latest user role object
                        vm.usersWithTheirRoles.push(userWithTheirRoles);

                        // zero out the stringOfAllRolesForAUser string so that it's empty for the next iteration of the for the main for loop above

                        stringOfAllRolesForAUser = '';

                    }
      
                },

                
                function(error){



                });

            RoleManagerFactory.getAllRoles().then (

                // get all the roles that exist in the database and display them within the Add/Remove Roles pull down menu, which is within the User Roles Editing Form
                function(response) {

                     for (var i = 0; i < response.length; i++) {

                        role = {

                        id: response[i].roleId,
                        label: response[i].roleType

                        }

                        vm.roles.push(role);

                    }

                },

                function(error) {


                });
        }

        // call this function when a user is selected within Select User pull down menu that's in the User Roles Editing Form
        function populateRoleDropDownList(userId) {

            // clears out the pre-selected roles within the Add/Remove Roles pull down menu 
            vm.selectedRoles.length = 0;

            UserManagerFactory.getAllUserRoles(userId).then (

                function(response) {

                    // determine which roles to show as pre-selected within the Add/Remove Roles pull down menu
                    for (var i = 0; i < response.length; i++) {

                        selectedRole = {

                            id: response[i].roleId,
                            label: response[i].roleType

                        }

                        vm.selectedRoles.push(selectedRole);

                    }

                },

                function(error) {


                });

        }

        // call this function when the Done Editing button is clicked
        function doneEditingUserRoles () {

            // hides the Edit User Roles Form
            vm.editUserRolesForm = false;
        } 
    }
})();