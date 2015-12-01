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
  requireNativeComponent
} = React;

var AvatarCell = require('../Views/AvatarCell');
var Orientation = require('react-native-orientation'); //only for ios
var TimerMixin = require('react-timer-mixin');
var LoadingCircleView = require('../Views/LoadingCircleView');

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
	          component: GridScreen,
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
   		
    return (
      <View style={styles.container}>
      	<View style={styles.containerGameLogic}>
        	<GameLogic user= {this.props.user} selectedUser= {this.props.selectedUser} state= {this.props.state}/>
        </View>
      	<View style= {styles.containerDetails}>
      		<Image
            source={{uri: this.props.user.avatar}}
            style={styles.image}
          />
        	{correctPerson}
        	{label}
        	<View>
		        <TouchableElement
		          onPress={this._handleNextButtonPress}
		          onShowUnderlay={this.props.onHighlight}
		          onHideUnderlay={this.props.onUnhighlight}>
		          <View>
			      		<LoadingCircleView time={this.state.remainingTime}/>
		      		</View>
		        </TouchableElement>
		      </View> 
		      
        </View>
      </View>
    );
  },

});

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
  image: {
  	width: 200,
  	height: 200,
  },
  textMarginWin: {
		marginTop: 40,
  },
  textMarginLost: {
		marginTop: 25,
  },
  text: {
    fontSize: 15,
    color: '#dddddd',
  },
  rightUserText: {
    marginTop: 10,
    fontSize: 15,
    color: '#dddddd',
  },
});

module.exports = ResultScreen;