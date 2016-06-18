'use strict';

angular.module('pokertrainerwebApp')
	.factory('ProfileModal', function($rootScope, $uibModal) {
		/**
		 * Opens a modal
		 * @param  {Object} scope      - an object to be merged with modal's scope
		 * @param  {String} modalClass - (optional) class(es) to be applied to the modal
		 * @return {Object}            - the instance $uibModal.open() returns
		 */
		function openModal(scope = {}, modalClass = 'modal-default', profiles) {
			var modalScope = $rootScope.$new();

			angular.extend(modalScope, scope);

			return $uibModal.open({
				templateUrl: 'components/profile-modal/profile-modal.html',
				controller: 'ProfileModalController',
        controllerAs: 'vm',
				windowClass: modalClass,
				scope: modalScope,
				resolve: {
					profiles: function() {            
						return profiles || [];        
					}
				}
			});
		}

		// Public API here
		return {

			edit: {

				/**
				 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
				 * @param  {Function} del - callback, ran when delete is confirmed
				 * @return {Function}     - the function to open the modal (ex. myModalFn)
				 */
				open(cb = angular.noop, profiles) {
					/**
					 * Open a delete confirmation modal
					 * @param  {String} name   - name or info to show on modal
					 * @param  {All}           - any additional args are passed straight to del callback
					 */
					return function() {
						var args = Array.prototype.slice.call(arguments),
							name = args.shift(),
							editModal;

						editModal = openModal({
								modal: {
									title: 'Edit Profile'
								}
							},
							'profile-modal',
							profiles
						);

						editModal.result.then(function(event) {
							cb.call(null, event);
						});
					};
				}
			}

		};
	});
