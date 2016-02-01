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
  Component,
  requireNativeComponent
} = React;

var AvatarCell = require('../Views/AvatarCell');
import TimerMixin from 'react-timer-mixin';

var LoadingCircleView = require('../Views/LoadingCircleView');

var log = require('loglevel');

class ResultScreen extends Component {

  constructor(props) {
    super(props);
    this.timer = undefined;
    this.state = {
      remainingTime: 4,
      isTimerActive: false
    };
  }

	_handleBackButtonPress() {
    this.props.navigator.pop();
  }

  _handleNextButtonPress() {
  	if(this.state.isTimerActive) {
  		log.warn('trying to close results while the timer is active');
  	}
  	else {
	   	var GridScreen = require('./GridScreen');

      log.warn('pushing ' + GridScreen);
	    this.props.navigator.push({
	          component: 'GridScreen',
	          title: 'GridScreen',
	    });  		
  	}
  }

  componentDidMount() {
    log.warn('componentDidMount time = ' + this.state.remainingTime);

    this._triggerTimerBehaviour();
  }

  componentWillUnmount () {
    log.warn('componentWillUnmount ' + this.timer);
    TimerMixin.clearTimeout(this.timer);
  }

  _triggerTimerBehaviour() {
  	if(this.state.remainingTime == 0) {
      log.warn('_triggerTimerBehaviour time = ' + this.state.remainingTime);

  		this.setState({isTimerActive: false});
	    this._handleNextButtonPress();
   	}
    else {
      log.warn('_triggerTimerBehaviour time = ' + this.state.remainingTime);

    	this.setState({isTimerActive: true});
    	var value = this.state.remainingTime - 1;
      this.setState({remainingTime: value});

      this.timer = TimerMixin.setTimeout(
        () => { 
          this._triggerTimerBehaviour();
        },
        1000
      );

   	}
  }

	render() {
    log.info('ResultScreen');
    log.warn('render grid result with props ' + this.props);
    log.warn('render grid with time' + this.state.remainingTime);
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
            style={_getImageStyle()}
          />
        	{correctPerson}
        	{label}
        	<View>
		        <TouchableElement
		          onPress={this._handleNextButtonPress}>
              <View>
                <LoadingCircleView time={this.state.remainingTime}/>
              </View>
		        </TouchableElement>
		      </View> 
		      
        </View>
      </View>
    );
  }
};

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