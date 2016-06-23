'use strict';

class ProfileModalController {

	constructor($scope, $uibModalInstance, profiles) {
		this.$scope = $scope;
    this.selected = null;
		this.profiles = profiles;
		this.$uibModalInstance = $uibModalInstance;

	}

	addProfile(profiles, profileName) { //pass in param for profiles and new name
		if (!(profileName = profileName.trim())) {
			return;
		}
		profiles.push(profileName);
		this._clearProfileName();
	};
	removeProfile(profiles, profile) {
		var pos = profiles.indexOf(profile);
		if (pos != -1) {
			profiles.splice(pos, 1);
		}
	};


	ok() {
		this.$uibModalInstance.close(this.profiles);
	};

	cancel() {
		this.$uibModalInstance.dismiss('cancel');
	};

	_clearProfileName() {
		this.profileName = '';
	}

}

angular.module('pokertrainerwebApp')
	.controller('ProfileModalController', ProfileModalController);
