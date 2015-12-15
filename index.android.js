/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  BackAndroid,
  ToolbarAndroid,
  TouchableOpacity
} = React;

var log = require('loglevel');

var Route = require('./Route');
  
var IntroScreen = require('./JS/Screens/IntroScreen');
var GridScreen = require('./JS/Screens/GridScreen');
var ResultScreen = require('./JS/Screens/ResultScreen');

/** for the navigation
*/
var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  console.log('back button pressed');
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var FriendlyGame = React.createClass({
  render: function() {    
    
    console.log('FriendlyGame render');

    return (
      <View style= {styles.container}>
        <Navigator
          style= {styles.container}
          initialRoute={{component: 'IntroScreen', title: 'IntroScreen'}}
          configureScene={() => Navigator.SceneConfigs.FloatFromRight}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  },

  renderScene: function(route, navigator) {
    log.warn(route);

    var routeId = route.component;
    if (routeId === 'IntroScreen') {
      return (
        <IntroScreen
          navigator={navigator} />
      );
    }
    if (routeId === 'ResultScreen') {
      
      return (
        <ResultScreen
          navigator={navigator} user={route.passProps.user} state={route.passProps.state} selectedUser={route.passProps.selectedUser}/>
      );
    }
    if (routeId === 'GridScreen') {
      return (
        <GridScreen
            navigator={navigator} />
      );
    }
    
    return this.noRoute(navigator);
  },

  noRoute: function(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>no route defined</Text>
        </TouchableOpacity>
      </View>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929'
  },
  nav: {
    flex: 1
  }
});


AppRegistry.registerComponent('FriendlyGame', () => FriendlyGame);
