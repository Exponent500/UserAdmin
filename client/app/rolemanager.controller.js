(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('RoleManagerController', RoleManagerController);

    RoleManagerController.$inject = ['toastr','RoleManagerFactory', '$stateParams'];

    /* @ngInject */
    function RoleManagerController(toastr, RoleManagerFactory, $stateParams) {
        var vm = this;
        
        vm.role = $stateParams.role;
        vm.roles;
        var roleToAdd;
        vm.username = $stateParams.username;
        
        vm.addRole = addRole;
        vm.checkIfRoleExists = checkIfRoleExists;
        vm.deleteRole = deleteRole;
        vm.updateRole = updateRole;

        activate();

        ////////////////

        function activate() {
            // get all roles to display to Role Manager page
            RoleManagerFactory.getAllRoles().then(

                function(response){

                    vm.roles = response;

                },

                function(error){

                        toastr.error('There was an error');

                });
        }

        // add a role to the roles table within the UserAdmin Database
        function addRole() {

            // check if the role already exists
            if (checkIfRoleExists(vm.rolename) === true)
                return;

            // create a new role object
            roleToAdd = {

                roleType : vm.rolename,
                description : vm.description,
                dateCreated : new Date().toISOString() 
                
            };

            // issue POST request to Roles table within UserAdmin Database
            RoleManagerFactory.addRole(roleToAdd).then(

                function(response){

                    // add ID assigned by Database to the role object
                    roleToAdd.roleId = response.roleId;

                    // push role object to the master role array
                    vm.roles.push(roleToAdd);
                    
                    // clear all input fields within the Add Role form
                    vm.rolename = "";
                    vm.description ="";

                    // Prevents background from staying in faded state once the "Add Role" modal is closed by way of clicking on the "Add Role" button
                    $('.modal-backdrop').remove();
                    // Closes Add Role modal
                    $('#addRole').modal('hide');

                },

                function(error) {

                    toastr.error('There was an error');
                });
        }

        // delete a role from the roles table within the UserAdmin Database
        function deleteRole(roleId) {

            RoleManagerFactory.deleteRole(roleId).then(

                function(response){

                // get the index of the role item to delete
                var index = vm.roles.map(function(el) {
                    return el.roleId;
                }).indexOf(roleId);

                // remove the role from the master role array
                vm.roles.splice(index,1);

                // prevent background from staying in faded state once the "Delete Role" modal is closed by way of clicking on the "Delete" button
                $('.modal-backdrop').remove();
                // Closes Delete Role modal
                $('#deleteRole').modal('hide');

                },

                function(error) {

                    toastr.error('There was an error');
                });
        }

        function updateRole(roleId) {

            // check to see if new role entered is either the same as the previous role or an existing role
            // if it's the same as the previous role, keep going and issue the POST command to the role table within the UserAdmin database
            // if it's the same as another role, break and let the user know so they can choose another role name

            for (var i = 0; i < vm.roles.length; i++){
                
                if (vm.roles[i].roleType.toLowerCase() === vm.rolename.toLowerCase()) {
                    
                    if(vm.roles[i].roleId === roleId) {
                    
                        break;
                    
                    } else {
                     
                        toastr.warning("Role already exists");
                        return;

                    }

                } else {

                }

            } 

            // create role object to add to roles table
            roleToAdd = {

                roleType : vm.rolename,
                description: vm.description,
                dateCreated : new Date().toISOString(),
                roleId : roleId
                                
            };

            // send PUT request to Role Table within the UserAdmin database
            RoleManagerFactory.updateRole(roleToAdd).then(

                // if the PUT was successful, then push the role object to the master roles array
                function(response){

                    // get the index of the master role array element that we want to update
                    var index = vm.roles.map(function (el) {
                        return el.roleId;
                    }).indexOf(roleId);

                    // update the master role array element
                    vm.roles[index] = roleToAdd;

                    // prevent background from staying in faded state once the "Update User" modal is closed by way of clicking on the "Update" button
                    $('.modal-backdrop').remove();

                },

                function(error){

                    toastr.error("There as an error");

                });

        }


        // see if the role exists within the master roles array
        function checkIfRoleExists (role) {

            for (var i = 0; i < vm.roles.length; i++){
                if (vm.roles[i].roleType === role){
                    toastr.warning("That role already exists");
                    return true;
                }
            }

            return false;
        }
    }
})();