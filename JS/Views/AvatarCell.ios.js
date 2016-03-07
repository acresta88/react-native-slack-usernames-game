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

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var AvatarCell = React.createClass({
  getInitialState: function() {
    return {
      orientation: "PORTRAIT",
    };
  },

  render: function() {
    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
            <Image
              source={{uri: this.props.user.avatar}}
              style={_getImageStyle(this.state.orientation)}
            />
        </TouchableHighlight>
      </View>         
    );
  }
});

var elemsForLine = 3; //Device.isIpad() ? 5 : 
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
