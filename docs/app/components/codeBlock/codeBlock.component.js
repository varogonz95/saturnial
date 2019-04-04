(function () {
	'use strict'

	angular
	.module('app')
	.component('codeBlock', {
		bindings: {
			// 'ts' || 'js'
			selected: '<',
			ts: '<?',
			js: '<?',
			// themes: 'light' 'white'
			theme: '@?',
		},
		controller: codeBlockController,
		controllerAs: 'vm',
		templateUrl: 'app/components/codeBlock/codeBlock.html'
	})

	function codeBlockController() { 
		var vm = this

		vm.selected = vm.selected || vm.ts || vm.js
		vm.toggle = toggle

		function toggle(code) {
			vm.selected = code
		}
	}
})()