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

var log = require('loglevel');

// var Spinner = require('react-native-circle-view');

// var value = PixelRatio.get();

// let CIRCLE_SIZE = 50 + 10 * value;
// let CIRCLE_MARGIN = 10 + 5 * value;

class LoadingCircleView extends React.Component {

//      <Spinner style= {styles.spinner} isVisible={true} size={CIRCLE_SIZE} type={'ArcAlt'} color={'#04b6cd'} >

  render() {
  	log.warn("rendering LoadingCircleView");

  	return (
              <View styles={styles.progress}>
                <View style={styles.textContainer}>
                  <Text style={styles.countdown}>{this.props.time}</Text>
                  <Text style={styles.countdownUnit}>s</Text>
                </View>
              </View>	  
    );
  }
};

var styles = StyleSheet.create({
  progress: {
    width: 50,
    height: 50
  },
  spinner: {
    marginTop: 0,
  },
  textContainer: {
    flex: 1, 
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  countdown: {
    fontSize: 30,
    color: "#dddddd",
  },
  countdownUnit: {
    fontSize: 16,
    backgroundColor: 'green',
  }
});

module.exports = LoadingCircleView;