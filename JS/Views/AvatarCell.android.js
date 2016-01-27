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
    this.orientationListener = undefined;
    this.state = {
      orientation: "UNKNOWN",
    };
  }

  componentDidMount() {
    log.error("addListener");

    this.orientationListener = Orientation.addListener(this._setOrientation.bind(this));
  }

  componentWillUnmount() {
    log.error("removeListener");
    this.orientationListener.remove();
  }

  _setOrientation(data) {
    if (data.orientation !== this.state.orientation) {
      log.error("updating state " + data.orientation + " - " + this.state.orientation);

      this.setState({
        orientation: data.orientation,
      });
    }
  }

  render() {

    log.info('rendering user ' + this.props.user.avatar);
    return ( 
      <View style={_getImageStyle()}>
        <TouchableHighlight
          onPress={this.props.onSelect}>
            <Image
              source={{uri: this.props.user.avatar}}
              style={_getImageStyle(this.state.orientation)}
            />
        </TouchableHighlight>
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
