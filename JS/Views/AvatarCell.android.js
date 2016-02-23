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
  View,
  Component
} = React;

var log = require("loglevel");

var Orientation = require('react-native-orientation-listener'); //TODO:change

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

class AvatarCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: "UNKNOWN",
    };
  }

  render() {
    return ( 
      <View style={_getImageStyle()}>
        <TouchableNativeFeedback
          onPress={this.props.onSelect}>
            <Image
              source={{uri: this.props.user.avatar}}
              style={_getImageStyle("PORTRAIT")}
            />
        </TouchableNativeFeedback>
      </View>         
    );
  }
};

var elemsForLine = 3; //var elemsForLine = Device.isIpad() ? 5 : 3;

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
