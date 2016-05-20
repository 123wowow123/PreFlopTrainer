'use strict';

const {ipcRenderer} = require('electron');

(function() {

  class MainController {

    constructor($http, $scope) {
      this.combination = {};
      this.$scope = $scope;
      this.chart = '/Users/Ian/Code/PreFlopTrainer/uploads/123.png';
      var that = this;

      ipcRenderer.on('get-image-async-response', (event, arg) => {
        var response = JSON.parse(arg);
        console.log(response); // prints "pong"
        console.log(response.imagePath); // prints "pong"
        that.chart = response.imagePath;
      });
      ipcRenderer.on('upload-image-async-response', (event, arg) => {
        //var response = JSON.parse(arg); dosn't work because it's string
        console.log(arg); // prints "pong"
      });

    }

    activeRaiseSize(templatePosition){
      return templatePosition === this.combination.raiseSize;
    }

    activeRFI(templatePosition){
      return templatePosition === this.combination.RFI;
    }

    activeHero(templatePosition){
      return templatePosition === this.combination.HeroPosition;
    }

    activeVillian(templatePosition){
      return templatePosition === this.combination.VillainPosition;
    }

    //Raise Size
    RS2X(){
      this.combination.raiseSize = 2;
    }

    RS25X(){
      this.combination.raiseSize = 2.5;
    }

    RS3X(){
      this.combination.raiseSize = 3;
    }

    //RFI Position
    HeroPosition(){
      this.combination.RFI = 'Hero';
    }

    VillainPosition(){
      this.combination.RFI = 'Villain';
    }

    //Hero Position
    HeroUTG(){
      this.combination.HeroPosition = 'UTG';
    }

    HeroMP(){
      this.combination.HeroPosition = 'MP';
    }

    HeroCO(){
      this.combination.HeroPosition = 'CO';
    }

    HeroBTN(){
      this.combination.HeroPosition = 'BTN';
    }

    HeroSB(){
      this.combination.HeroPosition = 'SB';
    }

    HeroBB(){
      this.combination.HeroPosition = 'BB';
    }

    //Villain Position
    VillainUTG(){
      this.combination.VillainPosition = 'UTG';
    }

    VillainMP(){
      this.combination.VillainPosition = 'MP';
    }

    VillainCO(){
      this.combination.VillainPosition = 'CO';
    }

    VillainBTN(){
      this.combination.VillainPosition = 'BTN';
    }

    VillainSB(){
      this.combination.VillainPosition = 'SB';
    }

    VillainBB(){
      this.combination.VillainPosition = 'BB';
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
      ipcRenderer.send('get-image-async', hash);
    }

  }

  angular.module('pokertrainerwebApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'vm'
  });

})();
