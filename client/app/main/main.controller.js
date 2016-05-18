'use strict';

const {ipcRenderer} = require('electron');

(function() {

  class MainController {

    constructor($http, $scope) {
      this.combination = {};
      this.$scope = $scope;

      ipcRenderer.on('get-image-async', (event, arg) => {
        console.log(arg); // prints "pong"
        chart = arg
      });
      ipcRenderer.on('upload-image-async-response', (event, arg) => {
        console.log(arg); // prints "pong"
      });

    }

    chart = '../uploads/123.png';

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

    CombinationChanged(){
      var combination = JSON.stringify(this.combination);
      console.log(combination);
      this.getCurrentImage(combination);
    }

    inputImageChange(e){
      var combination = JSON.stringify(this.combination);
      var msg = {
        key: combination,
        imageSourcePath: e.dataTransfer.files[0].path
      }
      console.log(msg);
      ipcRenderer.send('upload-image-async', JSON.stringify(msg));
    }

    getCurrentImage(hash){
      ipcRenderer.send('get-image-async-async', hash);
    }

  }

  angular.module('pokertrainerwebApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'vm'
  });

})();
