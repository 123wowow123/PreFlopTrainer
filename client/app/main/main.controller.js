'use strict';

const {
	ipcRenderer
} = require('electron');

(function() {

	class MainController {

		constructor($http, $scope, ProfileModal) {
			this.combination = {};
			this.$scope = $scope;
			this.ProfileModal = ProfileModal;
			var that = this;

			ipcRenderer.on('get-image-async-response', (event, arg) => {
				var response = JSON.parse(arg);
				console.log('get-image-async-response', response); // prints "pong"
				$scope.$apply(function() {
					that.chart = response.imagePath;
				});
			});
			ipcRenderer.on('upload-image-async-response', (event, arg) => {
				var response = JSON.parse(arg);
				console.log('upload-image-async-response', arg); // prints "pong"
				$scope.$apply(function() {
					that.chart = response.imagePath;
				});
			});
			ipcRenderer.on('get-profile-async-response', (event, arg) => {
				var response = JSON.parse(arg);
				console.log('get-profile-async-response', arg); // prints "pong"
				$scope.$apply(function() {
					that.profiles = JSON.parse(response.profileString);
				});
			});

			//setup default selections
			that.combination.raiseSize = 2;
			that.combination.RFI = 'Hero';
			that.combination.heroPosition = 'UTG';
			that.combination.villainPosition = null;

			that.posDef = {
				'BTN': 3,
				'SB': 4,
				'BB': 5,
				'UTG': 0,
				'MP': 1,
				'CO': 2,
			};

			that.profiles = [];
			that._getProfile();
			that.combinationChanged();
		}

		profileOpen(size) {
			var that = this;
			var modalInstance = this.ProfileModal.edit.open(ok, that.profiles);
			modalInstance();

			function ok(data) {
				that.profiles = data;
				that._setProfile({
					key: 'profiles',
					value: angular.toJson(data)
				});
				//just persist data
			}
		};

		//need to revisite for new cases with Frank
		positionEqualAfter(before, after) {
			var beforeNum = this.posDef[before],
				afterNum = this.posDef[after];
			return beforeNum <= afterNum;
		}

		positionEqualBefore(before, after) {
			var beforeNum = this.posDef[before],
				afterNum = this.posDef[after];
			return beforeNum >= afterNum;
		}

		impossibleHero(templatePosition) {
			if (this.combination.RFI === 'Hero') {
				return this.positionEqualBefore(templatePosition, this.combination.villainPosition);
			} else {
				return this.positionEqualBefore(this.combination.villainPosition, templatePosition);
			}
		}

		impossibleVillain(templatePosition) {
			if (this.combination.RFI === 'Hero') {
				return this.positionEqualAfter(templatePosition, this.combination.heroPosition);
			} else {
				return this.positionEqualAfter(this.combination.heroPosition, templatePosition);
			}
		}

		activeRaiseSize(templatePosition) {
			return templatePosition === this.combination.raiseSize;
		}

		activeRFI(templatePosition) {
			return templatePosition === this.combination.RFI;
		}

		activeHero(templatePosition) {
			return templatePosition === this.combination.heroPosition;
		}

		activeVillian(templatePosition) {
			return templatePosition === this.combination.villainPosition;
		}

		RFIChanged() {
			if (this.impossibleVillain(this.combination.villainPosition)) {
				this.combination.villainPosition = null;
			}
			this._autoSelect();
		}

		raiseSizeChanged() {
			this._autoSelect();
		}

		combinationChanged() {
			this._getCurrentImage(this.combination);
		}

		inputImageChange(e) {
			var msg = {
				key: this.combination,
				imageSourcePath: e.dataTransfer.files[0].path
			}
			this._setNewImage(msg);
		}

		_autoSelect() {
			if (this.combination.raiseSize == 1 && this.combination.RFI == 'Hero') {
				this.combination.heroPosition = 'SB';
				this.combination.villainPosition = 'BB';
			} else if (this.combination.raiseSize == 1 && this.combination.RFI == 'Villain') {
				this.combination.heroPosition = 'BB';
				this.combination.villainPosition = 'SB';
			}
		}

		_getCurrentImage(msg) {
			var hash = this._stringify(msg);
			console.log('_getCurrentImage', hash);
			ipcRenderer.send('get-image-async', hash);
		}

		_setNewImage(msg) {
			var hash = this._stringify(msg);
			console.log('_setNewImage', hash);
			ipcRenderer.send('upload-image-async', hash);
		}

		_setProfile(msg) {
			var hash = this._stringify(msg);
			console.log('_setProfile', hash);
			ipcRenderer.send('set-profile-async', hash);
		}

		_getProfile(key = 'profiles') {
			console.log('_getProfile', key);
			ipcRenderer.send('get-profile-async', key);
		}

		_stringify(msg) {
			return JSON.stringify(msg, this._replacerIgnoreNull);
		}

		_replacerIgnoreNull(key, value) {
			if (value === null) {
				return undefined;
			}
			return value;
		}
	}

	angular.module('pokertrainerwebApp')
		.component('main', {
			templateUrl: 'app/main/main.html',
			controller: MainController,
			controllerAs: 'vm'
		});

})();
