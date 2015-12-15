'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Navigator,
  ListView
} = React;


var AvatarCell = require('../Views/AvatarCell');

var config = require('../../config');

var Orientation = require('react-native-orientation'); //only for ios
var ResultScreen = require('./ResultScreen');

var log = require('loglevel');

let maxDifferentUsers = 5;
var lastUsers = [];

var guessedPeople = 0;
var totalAttempts = 0;

var GridScreen = React.createClass({

  //setting initial stato for loading and datasource
  getInitialState: function() {
    return {
      orientation: "UNKNOWN",
      isLoading: false,
      message: "",
      users: [],
      target: "",
      selectedUser: 0,
      isTargetSet: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      gameStatus: "start",
    };
  },

  getDataSource: function(users: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(users);
  },

getAvatars: function() {
  this.setState({ isLoading: true });

  var URL = config.getSlackUserListURL();
  console.log(URL);

  fetch(URL)
    .then(response => this._handleSlackResponse(response))
    .catch(error => 
      this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
      }));
},

//parsing the profile to get the thumbnail and combine it with the name
_handleSlackResponse: function(response) {
      this.setState({ isLoading: false , message: '' });
      
      
      var jsonValue = JSON.parse(response._bodyInit);

      log.info(jsonValue);

      if (jsonValue.members) {
        var users = [];

        for (var i = jsonValue.members.length - 1; i >= 0; i--) {
          var obj = jsonValue.members[i];
          if ((obj.real_name !== undefined) && (obj.profile.image_192 !== undefined && !obj.is_restricted)) {
            log.info('adding ' + obj.real_name);
            users.push({"name": obj.real_name, "avatar": obj.profile.image_192});            
          }
        };
        
        log.info('setting users ' + users.length);
        this.setState({ users: users});
        
      };

    this._completionAvatarRequest();
  },

  //called when all the users are retrieved
  _completionAvatarRequest: function() {
    log.info("_completionAvatarRequest " + this.state.users);
    this.setState({
      isLoading: false,
      dataSource: this.getDataSource(this.state.users),
    });
  },

  _orientationDidChange: function(orientation) {
    this.setState({orientation: orientation});
    this.render();

    if(orientation == 'LANDSCAPE'){
      //do something with landscape layout
      log.info("landscape");
    }else{
      //do something with portrait layout
      log.info("portrait");
    }
  },

  componentDidMount: function(){
    this.getAvatars();

    Orientation.addOrientationListener(this._orientationDidChange);
  },

  componentWillUnmount: function() {
    Orientation.getOrientation((err,orientation)=> {
        log.info("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange);
  },

  _handleBackButtonPress: function() {
    this.props.navigator.pop();
  },
  _handleNextButtonPress: function() {
    log.warn(this.state.target.name + '-' + this.state.selectedUser.name + '-' + this.state.gameStatus);

    this.props.navigator.push({
          component: ResultScreen,
          title: 'ResultScreen',
          passProps: { user: this.state.target,
                selectedUser: this.state.selectedUser,
                state: this.state.gameStatus}
        });
  },

  _selectUser: function(user: Object) {
    log.warn('selected ' + user.name);

    this.setState({selectedUser: user});

    totalAttempts++;
    if(user.name === this.state.target.name) {
      guessedPeople++;
      this._win();
    }
    else {
      this._lose();
    }

  },

  _win: function() {
    this.setState({gameStatus: "won"});
    this._handleNextButtonPress();
  },

  _lose: function() {
    this.setState({gameStatus: "lost"});
    this._handleNextButtonPress();
  },

  renderRow: function(
    user: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    log.info("row " + user.name);
    return (
      <AvatarCell
        key={user.id}
        onSelect={() => this._selectUser(user)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        user={user}
        orientation={this.state.orientation}
      />
    );
  },

  _getRandomUser: function(): obj {
    var users = this.state.users.slice();

    var target = this.state.target;

    if (!(this.state.isTargetSet)) {
      if (users.length > 0) {
        
        var contained = false;
        var firstAttempt = true;
        while (contained || firstAttempt) {

          contained = false;
          firstAttempt = false;

          var randomInt = Math.round(Math.random() * users.length);
          log.info(randomInt)
          target = users[randomInt];

          console.log("lastUsers " + lastUsers);
          for (var i = lastUsers.length - 1; i >= 0; i--) {
            console.log("checking if " + target.name + "is in lastUsers, compared with " + lastUsers[i].name);

            if(lastUsers[i].name === target.name) {
              contained = true;
              break;
            }
          };
        }

        if (target !== undefined) {
          log.info('setting state ' + target);

          if (lastUsers.length < maxDifferentUsers) {
            lastUsers.push(target);
            console.log("pushing " + target.name + " in lastUsers");
          }
          else {
            lastUsers.shift();
            console.log("shift in lastUsers");
            lastUsers.push(target);
            console.log("pushing " + target.name + " in lastUsers");
          }

          console.log("updating lastUsers " + lastUsers.length);

          this.setState({target: target, isTargetSet: true});
        };
      };
    };

    log.info('target ' + target);
    return target;
  },

  render: function() {

    var GameLogic = require('../Views/GameLogic');

    log.warn('render grid ' + this.state.dataSource.getRowCount());
    var content = this.state.dataSource.getRowCount() === 0 ?
      <Label
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={true}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    var score = "your score is " + (totalAttempts == 0 ? 0 : Math.floor((guessedPeople / totalAttempts) * 100)) + "%";
    return (
      <View style={styles.container}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <GameLogic user= {this._getRandomUser()} selectedUser= {this.state.selectedUser} state= {"start"}/>
        <View style={styles.listContainer}>
          {content}
        </View>
      </View>
    );
  },
});

var Label = React.createClass({

  render: function() {
    log.info("render label");
    var text = '';
    if (this.props.filter) {
      text = `No results"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No users found';
    }

    return (
      <View style={[styles.LabelContainer, styles.centerText]}>
        <Text style={styles.LabelText}>{text}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scoreContainer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
  },
  scoreText: {
    marginBottom: 0,
    fontSize: 15,
    color: "#dddddd",
  },
  listContainer: {
    flex: 0.55,
    backgroundColor: '#cccccc',
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 10,
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cellContainer: {
    flex: 0.5,
    backgroundColor: 'green'
  },
  LabelContainer: {
    flex: 0.65,
    backgroundColor: '#dddddd',
  },
  centerText: {
    alignItems: 'center',
  },
});

module.exports = GridScreen;