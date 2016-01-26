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
  Component
} = React;

var log = require('loglevel');

var GridScreen = require('./GridScreen');
import TimerMixin from 'react-timer-mixin';

class IntroScreen extends Component {  
  
  constructor(props) {
    super(props);
    this.timer = undefined;
  }

  _handleBackButtonPress () {
    this.props.navigator.pop();
  }

  _handleNextButtonPress () {
    this.props.navigator.push({
      component: 'GridScreen',
      title: 'GridScreen',
    });      
  }

  _onClick () {
    console.log("_onClick");
    this._handleNextButtonPress();
  }
  
  componentDidMount () {
    this.timer = TimerMixin.setTimeout(
      () => { 
        this._handleNextButtonPress();
      },
      1000
    );
  }
  
  componentWillUnmount () {
    TimerMixin.clearTimeout(this.timer);
  }

  render () {

    return ( 
    <TouchableHighlight 
      style={{flex:1}}
      onPress={this._onClick}>       
        
      <View style={styles.imageContainer}>  
          <Image 
          style={styles.image} 
          resizeMode={'contain'}
          source={require('../../assets/logo.png')}
          />
      </View>
    </TouchableHighlight>
    );
  }
};

var styles = StyleSheet.create({
image: {
    width: 200,
    height: 100,
  },
  imageContainer: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});

module.exports = IntroScreen;