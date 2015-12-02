'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;


var log = require("loglevel");
var Orientation = require('react-native-orientation'); //only for ios

var AvatarCell = React.createClass({
  //setting initial stato for loading and datasource
  getInitialState: function() {
    return {
      orientation: "UNKNOWN",
    };
  },
  _orientationDidChange: function(orientation) {
    this.setState({orientation: orientation});
  },

  componentDidMount: function(){
    Orientation.addOrientationListener(this._orientationDidChange);
  },

  componentWillUnmount: function() {
    Orientation.getOrientation((err,orientation)=> {
        log.info("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange);
  },

  render: function() {

    var TouchableElement = TouchableHighlight;

    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    log.warn("render cell " + this.props.user.name + " " + this.props.orientation);
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
            <Image
              source={{uri: this.props.user.avatar}}
              style={_getImageStyle(this.state.orientation)}
            />
        </TouchableElement>
      </View>         
    );
  }
});

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var elemsForLine = 3;
function _getImageStyle(orientation): StyleObj {
  
  var pageWidth = windowSize.width;

  var width = Math.trunc(pageWidth / elemsForLine);
  var height = width;
  return {
    width: width,
    backgroundColor: '#dddddd',
    height: height,
  };
}

var styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  
});

module.exports = AvatarCell;
