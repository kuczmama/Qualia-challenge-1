Player = new Mongo.Collection("player");

var shoot = function (choice) {
    alert('move made');
    var sent = getSent();
    if(hasGameRequest()){
      alert("get Request" + getRequest());
      displayImage(choice);
      alert(determineOutcome(choice, getRequest()[2]));
      reset();
      //play Game
    } else if (hasSentGameRequest()) {
      alert('cannot make a new game... must finish game first');
    } else {
        //send requests to other opponenet... src, dest, choice
      sent.push(Meteor.user().username + "," + document.getElementById('opponents').value + "," + choice);
      Session.set({
        send : sent
      })
    }
  },
  reset = function (){
    Session.keys = {};
  },
  getRequest = function () {
    var i,
        sent,
        dest;
    for(i = 0; i < getSent().length; i++) {
      sent = getSent()[i].split(',');
      dest = sent[1];
      if(Meteor.user().username == dest) {
        return sent;
      }
    }
  },
  getSent = function () {
    if(Session.get('send')) {
      return Session.get('send');
    } else {
      return new Array();
    }
  },
  //check if an opponent started a game
  hasGameRequest = function () {
    var i,
        sent,
        dest;
    for(i = 0; i < getSent().length; i++) {
      sent = getSent()[i].split(',');
      dest = sent[1];
      if(Meteor.user().username == dest) {
        return true;
      }
    }
    return false;
  },
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
  determineOutcome = function (choice, other) {
    if(choice === other) {
      return 'tie';
    } else if ((choice === 'rock' && other === 'paper') ||
                (choice === 'paper' && other === 'scissors') ||
                (choice === 'scissors' && other === 'rock')) {
      return 'lose';
    } else {
      return 'win';
    }
  },
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


Template.play.helpers({
  opponents : function () {
    return Meteor.users.find({username : {$ne : Meteor.user().username}},{}).fetch();
  },
});

Template.main.helpers({
  currentUser : function () {
    return Meteor.user().username;
  }
});
