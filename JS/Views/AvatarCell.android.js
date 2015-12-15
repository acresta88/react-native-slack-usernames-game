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

  render: function() {

    log.info('rendering user ' + this.props.user.avatar);
    return ( 
      <View style={_getImageStyle()}>
        <TouchableHighlight
          onPress={this.props.onSelect}>
            <Image
              source={{uri: this.props.user.avatar}}
              style={_getImageStyle()}
            />
        </TouchableHighlight>
      </View>         
    );
  }
});

var elemsForLine = 3;
function _getImageStyle(): StyleObj {
  
  var pageWidth = windowSize.width;

  var width = Math.trunc(pageWidth / elemsForLine);
  var height = width;

  log.info(width + '-' + height);
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
