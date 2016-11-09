 (function() {
    'use strict';

    angular
        .module('UserAdminApp')
        .component('topnav',{
         	bindings: {
         		brand: '@' //defines an attribute for this component, and in this case the @ allows whatever string value is given for this attribute to be passed into this component definition where it can be used in this component's template or internal controller
    		 },
        	templateUrl: 'app/navigation/topnav.component.html'
        });
})();
