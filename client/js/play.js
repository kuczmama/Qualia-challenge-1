/*
 * Mark Kuczmarski
 * File : play.js
 * Purpose : This file handles the game logic of playing rock
 *           paper scissors
 */
Game = new Mongo.Collection("game");

var shoot = function (choice) {
    if(getCurrentOpponent() != getSelectedOpponent()) {
      alert('You must play against the player you are currently battling');
      return;
    }
    alert('move request made to opponent ' + getSelectedOpponent());

    if(getGameRequest()){
      displayImage(choice);
      alert(determineOutcome(choice, getGameRequest()[2]));
      reset();
      //play Game
    } else if (hasSentGameRequest()) {
      alert('cannot make a new game... must finish game first with ' + getCurrentOpponent());
    } else {
      //send requests to other opponenet... src, dest, choice
      Game.insert({
        source : Meteor.user().username,
        destination : getSelectedOpponent(),
        choice : choice
      });
      displayImage(choice);
    }
  },
  //reset the game after playing
  reset = function (){
    var id = getGameRequest()[0]._id;
    Game.remove(id);
    displayImage('default');//show default image
  },
  //get the selected opponent on the screen
  getSelectedOpponent = function () {
    return document.getElementById('opponents').value;
  },
  /*check if an opponent started a game.  If
   * If it did return the game
   * else return false
   */
  getGameRequest = function () {
    if(Meteor.user()) {
      var request = Game.find({destination : Meteor.user().username}).fetch();
      return request.length > 0 ? request : null;
    } else {
      return null;
    }
  },
  //gets the current opponent
  getCurrentOpponent = function () {
    var request = getGameRequest();

    return request ? request[0].source : null;
  },
  //find if player has created a game with an opponent
  hasSentGameRequest = function () {
    return Game.find({source : Meteor.user().username}).fetch().length > 0;
  },
  //determine who won the game and return a status
  determineOutcome = function (choice, other) {
    if(choice === other) {
      return 'You tied with ' + getCurrentOpponent();
    } else if ((choice === 'rock' && other === 'paper') ||
                (choice === 'paper' && other === 'scissors') ||
                (choice === 'scissors' && other === 'rock')) {
      return 'You lost to ' + getCurrentOpponent();
    } else {
      return 'You beat ' + getCurrentOpponent();
    }
  },
  //change the image on the screen according the the status
  displayImage = function (status) {
    //update the image on the screen
    if(status == 'paper') {
      document.getElementById('status').src = 'paper.png';
    } else if (status == 'rock') {
      document.getElementById('status').src = 'rock.png';
    } else if (status == 'scissors') {
      document.getElementById('status').src = 'scissors.png';
    } else if (status == 'default') {
      document.getElementById('status').src = 'rock_paper_scissors.png';
    }
  };
  //run everytime a button is clicked
Template.playerTemplate.events({
  "click" : function (event, template) {
    //handle the players choice
    shoot(event.target.id);
  }
});

//output a list of all of the possible opponents
Template.play.helpers({
  opponents : function () {
    return Meteor.users.find({username : {$ne : Meteor.user().username}},{}).fetch();
  },
});

//get the current logged in user
Template.main.helpers({
  currentUser : function () {
    return Meteor.user().username;
    }
  });

  //displays if a user is playing a game
  Template.play.onCreated(function(){
    //alert the player if another opponent has started a game
    if(getGameRequest()) {
      alert('You are playing a game with ' + getCurrentOpponent());
    }
  });
