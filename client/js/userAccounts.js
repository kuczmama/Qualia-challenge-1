Template.register.events({
  'submit form' : function () {
    event.preventDefault();//prevent callback
    var username = $('[name=username').val();
    var password = $('[name=password]').val();
    //Create a new User account
    Accounts.createUser({
      username : username,
      password : password
    });
    Router.go('login');//redirect back to home page
  }
});

Template.main.events({
  'click .logout' : function () {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

Template.login.events({
    'submit form': function(event){
        $('.login').validate();
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(username, password, function(error){
          if(error){
            //handle error...
          } else {
            Router.go('play');
          }
        });

    }
});
