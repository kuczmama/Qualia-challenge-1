/*
 * Mark Kuczmarski
 * File : play.js
 * Purpose : This file handles the game logic of playing rock
 *           paper scissors
 */
Player = new Mongo.Collection("player");

var shoot = function (choice) {
    alert('move request made to opponent ' + document.getElementById('opponents').value);
    var sent = getSent();
    if(getGameRequest()){
      displayImage(choice);
      alert(determineOutcome(choice, getGameRequest()[2]));
      reset();
      //play Game
    } else if (hasSentGameRequest()) {
      alert('cannot make a new game... must finish game first with ' + getCurrentOpponent());
    } else {
        //send requests to other opponenet... src, dest, choice
      sent.push(Meteor.user().username + "," + document.getElementById('opponents').value + "," + choice);
      Session.set({
        send : sent
      })
      displayImage(choice);
    }
  },
  //reset the game after playing
  reset = function (){
    Session.keys = {};//reset the session
    displayImage('default');//show default image
  },
  //return the sent array
  getSent = function () {
    if(Session.get('send')) {
      return Session.get('send');
    } else {
      return new Array();
    }
  },
  /*check if an opponent started a game.  If
   * If it did return the game
   * else return false
   */
  getGameRequest = function () {
    var i,
        sent,
        dest;
    for(i = 0; i < getSent().length; i++) {
      sent = getSent()[i].split(',');
      dest = sent[1];
      if(Meteor.user().username == dest) {
        return getSent()[i].split(',');
      }
    }
    return false;
  },
  //gets the current opponent
  getCurrentOpponent = function () {
    return getGameRequest()[0];
  },
  //find if player has created a game with an opponent
  hasSentGameRequest = function () {
    var i,
        sent,
        src;
    for(i = 0; i < getSent().length; i++) {
      sent = getSent()[i].split(',');
      src = sent[0];
      if(Meteor.user().username == src) {
        return true;
      }
    }
    return false;
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
