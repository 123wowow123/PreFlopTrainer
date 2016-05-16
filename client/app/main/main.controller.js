'use strict';

(function() {

  class MainController {

    constructor($http, $scope) {
      this.combination = {};
      this.$scope = $scope;
      }



      activeRFI(templatePosition){
        return templatePosition === this.combination.RFI;
      }

      activePosition(templatePosition){
        return templatePosition === this.combination.position;
      }

    //Raise Size
    RS2X(){
      this.combination.raiseSize = 2;
      this.combination.RFI = 'UTG';
    }

    RFIMP(){
      this.combination.RFI = 'MP';
    }

    RFICO(){
      this.combination.RFI = 'CO';
    }

    RFIBTN(){
      this.combination.RFI = 'BTN';
    }

    RFISB(){
      this.combination.RFI = 'SB';
    }

    RFIBB(){
      this.combination.RFI = 'BB';
    }

    //Your Position
    PositionUTG(){
      this.combination.position = 'UTG';
    }

    PositionMP(){
      this.combination.position = 'MP';
    }

    PositionCO(){
      this.combination.position = 'CO';
    }

    PositionBTN(){
      this.combination.position = 'BTN';
    }

    PositionSB(){
      this.combination.position = 'SB';
    }

    PositionBB(){
      this.combination.position = 'BB';
    }

    inputImageChange(e){
      var file = e.dataTransfer.files[0];
    }

  }

  angular.module('pokertrainerwebApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'vm'
  });

})();
