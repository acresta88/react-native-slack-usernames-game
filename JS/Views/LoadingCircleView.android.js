'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  ListView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
  Animated,
  Component,
  PropTypes,
  PixelRatio,
  requireNativeComponent
} = React;


var Spinner = require('react-native-spinkit');

var value = PixelRatio.get();

let CIRCLE_SIZE = 50 + 10 * value;
let CIRCLE_MARGIN = 10 + 5 * value;

class LoadingCircleView extends React.Component {

  constructor(props: Object): void {
    super();
    this.state = {
      isActive: false,
      pop: new Animated.Value(0),
    };
  }

  render(): ReactElement {
  	console.log(this.props.time);
  	return (
      <Spinner style= {styles.spinner} isVisible={true} size={CIRCLE_SIZE} type={'ArcAlt'} color={'#04b6cd'} >
        <View style={[styles.textContainer, styles.centralAlignment]}>
          <Text style={styles.countdown}>{this.props.time}</Text>
          <Text style={styles.countdownUnit}>s</Text>
        </View>
      </Spinner>
	);
  }
}

var styles = StyleSheet.create({
  centralAlignment: {
  	justifyContent: 'center', 
  	alignItems: 'center'
  },
  spinner: {
    marginTop: CIRCLE_MARGIN,
  },
  textContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0)'
  },
  countdown: {
  	fontSize: 30,
  	color: "#dddddd",
  },
  countdownUnit: {
  	fontSize: 16,
  	color: "#dddddd",
  }
});

module.exports = LoadingCircleView;