PlayersList  = new Mongo.Collection("players");
//UserAccounts = new Mongo.Collection('users');

if (Meteor.isClient) {
  Template.hello.helpers({
    'player':function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({createdBy:currentUserId},
             {sort:{score:-1,name:1}});
  },
    'selectedClass':function() {
      var playerId = this._id//._str;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    },
      'showSelectedPlayer':function(){
        var selectedPlayer = Session.get('selectedPlayer');
        return PlayersList.findOne(selectedPlayer);
      }
    }
  );

  Template.hello.events({
  'click .player':function(){
    var playerId = this._id;
    Session.set('selectedPlayer',playerId);
    var selectedPlayer = Session.get('selectedPlayer');
    console.log(selectedPlayer);
  },
    'click .increment':function(){
      var selectedPlayer = Session.get('selectedPlayer');
      //PlayersList.update(selectedPlayer,{$inc:{score:5}})
      Meteor.call('modifyPlayerScore',selectedPlayer,5);
    },
    'click .decrement':function(){
      var selectedPlayer = Session.get('selectedPlayer');
     // PlayersList.update(selectedPlayer,{$inc:{score:-5}})
      Meteor.call('modifyPlayerScore',selectedPlayer,-5);
    },

    'click .remove':function(){
      var selectedPlayer = Session.get('selectedPlayer');
     // PlayersList.remove(selectedPlayer);
      Meteor.call('removePlayerData',selectedPlayer);
    }
  });

  Template.addPlayerForm.events({
    'submit form':function(evt){
      evt.preventDefault();
      var playerNameVar = evt.target.playerName.value;
      //  var currentUserId = Meteor.userId();
      //PlayersList.insert({
      //  name:playerNameVar, score:0,
      //    createdBy: currentUserId
      //});
      console.log(playerNameVar);
      //console.log("Form submitted!");
      //console.log(evt.type);
      Meteor.call('insertPlayerData',playerNameVar);
    }
  });

    Meteor.subscribe('thePlayers');
}

if(Meteor.isServer){
   // console.log(PlayersList.find().fetch());
   Meteor.publish('thePlayers', function () {
        var currentUserId = this.userId;
       return PlayersList.find({createdBy: currentUserId});
   });

  Meteor.methods({
    'insertPlayerData': function(playerNameVar){
      //console.log("Hello World!");
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name:playerNameVar,//"David",
        score:0,
        createdBy: currentUserId
      });
    },
    'removePlayerData':function(selectedPlayer){
      var currentUserId = Meteor.userId();
       //PlayersList.remove(selectedPlayer);
       PlayersList.remove({_id:selectedPlayer, createdBy:currentUserId});
    },
    'modifyPlayerScore': function (selectedPlayer, scoreValue) {
      //PlayersList.update(selectedPlayer,{$inc:{score:scoreValue}});
      var currentUserId = Meteor.userId();
      PlayersList.update({_id:selectedPlayer, createdBy:currentUserId},
         {$inc:{score:scoreValue}});
    }
  })
}


