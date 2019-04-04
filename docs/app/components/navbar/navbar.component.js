(function () {
	'use strict'

	angular
	.module('app')
	.component('navbar', {
		bindings: {

		},
		controller: navbarController,
		controllerAs: 'vm',
		templateUrl: 'app/components/navbar/navbar.html'
	})

	function navbarController() {
		// Code...
	}
})()