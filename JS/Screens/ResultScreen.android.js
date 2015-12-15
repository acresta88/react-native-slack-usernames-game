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
  PixelRatio,
  PropTypes,
  requireNativeComponent
} = React;

var AvatarCell = require('../Views/AvatarCell');
var TimerMixin = require('react-timer-mixin');

var log = require('loglevel');


var ResultScreen = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			remainingTime: 4,
			isTimerActive: false
		};
	},

	_handleBackButtonPress: function() {
    this.props.navigator.pop();
  },
  _handleNextButtonPress: function() {
  	
  	if(this.state.isTimerActive) {
  		
  	}
  	else {
	   	var GridScreen = require('./GridScreen');

	    this.props.navigator.push({
	          component: 'GridScreen',
	          title: 'GridScreen',
	          passProps: { myProp: 'foo' }
	    });  		
  	}
  },

  componentDidMount: function() {
    this._triggerTimerBehaviour();
  },

  _triggerTimerBehaviour: function() {
  	if(this.state.remainingTime == 0) {
  		this.setState({isTimerActive: false});
	    this._handleNextButtonPress();
   	}
    else {
    	this.setState({isTimerActive: true});
    	var value = this.state.remainingTime - 1;
      this.setState({remainingTime: value});
      this.setTimeout(
	      () => { 
	      	console.log(this.state.remainingTime);

	      	this._triggerTimerBehaviour();
	      },
	      1000
	    );
   	}
  },

	render: function() {
    log.warn('ResultScreen');
    log.warn('render grid result with props ' + this.props);

    var correctPerson = this.props.state == 'lost' ? <Text style={styles.rightUserText}>This is {this.props.user.name}</Text> : <Text />;
		var label = this.props.state == 'lost' ? 
			<Text style={[styles.text, styles.textMarginLost]}>Next challenge in...</Text> :
      <Text style={[styles.text, styles.textMarginWin]}>Next challenge in...</Text>

		var TouchableElement = TouchableHighlight;

    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
     
     	var GameLogic = require('../Views/GameLogic');
   		
      log.warn('props result screen ');
      for (var key in this.props) {
        log.warn(key + '-' + this.props[key]);
      };
    return (
      <View style={styles.container}>
      	<View style={styles.containerGameLogic}>
        	<GameLogic user= {this.props.user} selectedUser= {this.props.selectedUser} state= {this.props.state}/>
        </View>
      	<View style= {styles.containerDetails}>
      		<Image
            source={{uri: this.props.user.avatar}}
            style={_getImageStyle()}
          />
        	{correctPerson}
        	{label}
        	<View>
		        <TouchableElement
		          onPress={this._handleNextButtonPress}>
		          <View style={{width: 50, height: 50}}>
			      		<Text style={styles.text}>{this.state.remainingTime}</Text>
		      		</View>
		        </TouchableElement>
		      </View> 
		      
        </View>
      </View>
    );
  },

});

function _getImageStyle (){
  var value = PixelRatio.get();
  var size = 70 * value;
  return {
    width: size,
    height: size,
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGameLogic: {
    flex: 0.35,
  },
  containerDetails: {
  	flex: 0.65,
  	alignItems: 'center',
  },
  textMarginWin: {
		marginTop: 30,
  },
  textMarginLost: {
		marginTop: 15,
  },
  text: {
    fontSize: 30,
    color: '#dddddd',
  },
  rightUserText: {
    marginTop: 10,
    fontSize: 15,
    color: '#dddddd',
  },
});

module.exports = ResultScreen;