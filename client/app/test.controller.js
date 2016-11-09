(function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$stateParams'];

    /* @ngInject */
    function HomeController($stateParams) {
        var vm = this;
        vm.title = 'HomeController';
        vm.role = $stateParams.role;
        vm.username = $stateParams.username;
        activate();

        ////////////////

        function activate() {
        }
    }
})();