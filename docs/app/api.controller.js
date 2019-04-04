(function () {
	'use strict'

	angular
	.module('app')
	.controller('apiController', [apiController])

	function apiController() {
		var vm = this,
			TEMPLATES_PATH = 'app/templates/'

		vm.docs = [
			{ 
				title: 'App', 
				contentUrl: TEMPLATES_PATH + 'app/app.content.html', 
				tsUrl: TEMPLATES_PATH + 'app/app.code.ts',
				jsUrl: TEMPLATES_PATH + 'app/app.code.js',
			},
			{ 
				title: 'AppContainer', 
				contentUrl: TEMPLATES_PATH + 'appContainer/appContainer.content.html', 
				tsUrl: TEMPLATES_PATH + 'appContainer/appContainer.code.ts',
				jsUrl: TEMPLATES_PATH + 'appContainer/appContainer.code.js',
			},
		]
	}
})()