(function () {
	'use strict'

	angular
	.module('app')
	.component('navigation', {
		bindings: {},
		controller: navigationController,
		controllerAs: 'vm',
		templateUrl: 'app/components/navigation/navigation.html',
	})

	function navigationController() {
		var vm = this

		vm.links = [
			{ url: './#app', name: 'App', childs: [
				{ url: './#app_container', name: 'App.container()'},
				{ url: './#app_serve', name: 'App.serve(options?, callback?)'},
			]},
			{ url: './#app', name: 'AppContainer', childs: [
				{ url: './#appcontainer_bind', name: 'AppContainer.bind()' },
				{ url: './#appcontainer_get', name: 'AppContainer.get<T>(type: string | Type)' },
				{ url: './#appcontainer_register_1', name: 'AppContainer.register(type: Type)' },
				{ url: './#appcontainer_register_2', name: 'AppContainer.register(typeCollection: IProviderCollection)' },
			]},
		]
	}
})()