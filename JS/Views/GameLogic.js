'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image
} = React;

var log = require('loglevel');

var GameLogic = React.createClass({
  render: function() {
    var state = this.props.state;
    log.info('state ' + state);
    var user = this.props.user;
    log.warn('user ' +user.name);

    var selectedUser = this.props.selectedUser;
    log.info('selecteduser ' + selectedUser.name);
  
    var content;
    var content2;
    var image;

    if (state == "start") {
      log.info('in start flow');
      var text = user ? ('Who is') : 'no seleted user';
      var text2 = user ? user.name + '?' : '';
      content = <Text numberOfLines={1} style={styles.gameText}>{text}</Text>;
      content2 = <Text numberOfLines={1} style={styles.gameTextName}>{text2}</Text>;
    }
    else if (state == "won") {
      var text = user ? ('It totally was!') : 'no user';
      var text2 = user ? user.name : '';
      content = <Text numberOfLines={1} style={styles.gameText}>{text}</Text>;
      content2 = <Text numberOfLines={1} style={styles.gameTextName}>{text2}</Text>;
      image = <Image source={require("../../assets/blue_line.png")} style={_getImageStyle()} resizeMode={'contain'}/>;
    }
    else if (state == "lost") {
      var text = user ? ('Nope! that was ' + selectedUser.name +'.') : 'no user';

      content = <Text numberOfLines={1} style={styles.gameText}>{text}</Text>;
      image = <Image source={require("../../assets/red_line.png")} style={_getImageStyle()} resizeMode={'contain'}/>;
    } else {
      content = <Text numberOfLines={1} style={styles.gameText}>no users</Text>;
    }

    return (
        <View style={[styles.gameLogicContainer, styles.centerText]}>
          {content}
          {content2}
          {image}
        </View>
      );
  }
});


var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

function _getImageStyle(orientation): StyleObj {
  
  var pageWidth = windowSize.width;
  
  var width = Math.trunc(pageWidth -20);
  var height = 50;
  return {
    width: width,
    alignItems: 'center',
    height: height,
  };
}

var styles = StyleSheet.create({
  gameLogicContainer: {
    flex: 0.35,
    backgroundColor: '#292929',
  },
  centerText: {
    alignItems: 'center',
  },
  gameText: {
    marginTop: 80,
    fontSize: 20,
    color: '#dddddd',
  },
  gameTextName: {
    marginTop: 20,
    fontSize: 40,
    color: '#dddddd',
  },
  
});

module.exports = GameLogic;