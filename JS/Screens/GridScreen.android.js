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
  ListView,
  Component
} = React;


var AvatarCell = require('../Views/AvatarCell');

var config = require('../../config');

// var Orientation = require('react-native-orientation-listener');

var ResultScreen = require('./ResultScreen');

var log = require('loglevel');

let maxDifferentUsers = 5;
var lastUsers = [];

var guessedPeople = 0;
var totalAttempts = 0;

class GridScreen extends Component {  
  //setting initial stato for loading and datasource
  constructor(props) {
    super(props);
    // this.orientationListener = undefined;
    this.state = {
      isLoading: false,
      // orientation: "UNKNOWN",
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
  }
  
  getDataSource (users: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(users);
  }

  getAvatars() {
    this.setState({ isLoading: true });

    var URL = config.getSlackUserListURL();
    log.info(URL);

    fetch(URL)
      .then(response => this._handleSlackResponse(response))
      .catch(error => 
        this.setState({
            isLoading: false,
            message: 'Something bad happened ' + error
        }));
  }

  //parsing the profile to get the thumbnail and combine it with the name
  _handleSlackResponse (response) {
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
  }

  //called when all the users are retrieved
  _completionAvatarRequest () {
    log.warn("_completionAvatarRequest " + this.state.users);
    this.setState({
      isLoading: false,
      dataSource: this.getDataSource(this.state.users),
    });

    //once all the avatars are gotten select a target
    this._getRandomUser()
  }

  componentDidMount (){
    this.getAvatars();

    // this.orientationListener = Orientation.addListener(this._setOrientation);

  }

  componentWillUnmount() {
    log.error("removeListener");

    // this.orientationListener.remove();
  }

  // _setOrientation(data) {

  //   log.error(data);

  //   if (data.orientation != this.state.orientation) {
  //     this.setState({
  //       orientation: data.orientation,
  //     });
  //   }
  // }

  _handleBackButtonPress () {
    this.props.navigator.pop();
  }

  _handleNextButtonPress () {
    log.warn(this.state.target.name + '-' + this.state.selectedUser.name + '-' + this.state.gameStatus);

    this.props.navigator.push({
          component: 'ResultScreen',
          title: 'ResultScreen',
          passProps: { user: this.state.target,
                selectedUser: this.state.selectedUser,
                state: this.state.gameStatus}
        });
  }

  _selectUser (user: Object) {
    log.info('selected ' + user.name);

    this.setState({selectedUser: user});

    totalAttempts++;
    if(user.name === this.state.target.name) {
      guessedPeople++;
      this._win();
    }
    else {
      this._lose();
    }
  }

  _win () {
    this.setState({gameStatus: "won"});
    this._handleNextButtonPress();
  }

  _lose () {
    this.setState({gameStatus: "lost"});
    this._handleNextButtonPress();
  }

  renderRow (
    user: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    log.info("row " + user.name + " - " + this);
    return (
      <AvatarCell
        key={user.id}
        onSelect={() => this._selectUser(user)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        user={user}
      />
    );
  }

  _getRandomUser () : obj {
    log.info('_getRandomUser');

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

          log.info("lastUsers " + lastUsers);
          for (var i = lastUsers.length - 1; i >= 0; i--) {
            log.info("checking if " + target.name + "is in lastUsers, compared with " + lastUsers[i].name);

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
            log.info("pushing " + target.name + " in lastUsers");
          }
          else {
            lastUsers.shift();
            log.info("shift in lastUsers");
            lastUsers.push(target);
            log.info("pushing " + target.name + " in lastUsers");
          }

          log.info("updating lastUsers " + lastUsers.length);

          this.setState({target: target, isTargetSet: true});
        };
      };
    };

    log.info('target ' + target);
    return target;
  }

  render () {

    var GameLogic = require('../Views/GameLogic');

    log.info('render grid ' + this.state.dataSource.getRowCount() + ' target ' + this.state.target);
    var content = this.state.dataSource.getRowCount() === 0 ?
      <Label
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
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
        <GameLogic user= {this.state.target} selectedUser= {this.state.selectedUser} state= {"start"}/>
        <View style={styles.listContainer}>
          {content}
        </View>
      </View>
    );
  }
};

class Label extends Component {

  render() {

    let text = 'No results';

    return (
      <View style={[styles.LabelContainer, styles.centerText]}>
        <Text style={styles.LabelText}>{text}</Text>
      </View>
    );
  }
};

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