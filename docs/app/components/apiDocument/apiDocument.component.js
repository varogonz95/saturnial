(function () {
	'use strict'

	angular
	.module('app')
	.component('apiDocument', {
		bindings: {
			title: '<',
			contentUrl: '<',
			tsUrl: '<',
			jsUrl: '<',
			codeTheme: '<'
		},
		controller: apiDocumentController,
		controllerAs: 'vm',
		templateUrl: 'app/components/apiDocument/apiDocument.html'
	})

	function apiDocumentController() {
		var vm = this
		
		vm.$onInit = onInit

		function onInit() {
			vm.selected = vm.tsUrl
		}
	}
})()