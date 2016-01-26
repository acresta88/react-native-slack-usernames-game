/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component,
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
  
//TODO: try to replace this long require with a proper one
var IntroScreen = require('./JS/Screens/IntroScreen');
var GridScreen = require('./JS/Screens/GridScreen');
var ResultScreen = require('./JS/Screens/ResultScreen');

// TODO: check what to do with back button, not working atm
// for the navigation
var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {

  log.error('navigator is ' + _navigator);
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

/**
 * FriendlyGame main Component, where navigation is handled and initial rendering done.
 */
class FriendlyGame extends Component{

  /**
   * render method for the app, it contains a View defining the background of the app and
   * a Navigator object that sets the initial screen and the renderScene function that link
   * the route name to a screen, if possible.
   */
  render() {      
    log.info('FriendlyGame render');

    return (
      <View style= {styles.container}>
        <Navigator
          style= {styles.nav}
          initialRoute={{component: 'IntroScreen', title: 'IntroScreen'}}
          configureScene={() => Navigator.SceneConfigs.FloatFromRight}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }

  renderScene(route, navigator) {
    log.info('going to route: ' + route);

    const routeId = route.component;
    if (routeId === 'IntroScreen') {
      return (
        <IntroScreen navigator={navigator} />
      );
    } 

    if (routeId === 'ResultScreen') {
      return (
        <ResultScreen navigator={navigator} 
                      user={route.passProps.user} 
                      state={route.passProps.state} 
                      selectedUser={route.passProps.selectedUser}/>
      );
    }

    if (routeId === 'GridScreen') {
      return (
        <GridScreen navigator={navigator} />
      );
    }
    
    return this.noRoute(navigator);
  }

  noRoute(navigator) {
    return (
      <View style={styles.noRouteContainer}>
        <TouchableOpacity style={styles.noRouteTouchableArea}
            onPress={() => navigator.pop()}>
          <Text style={styles.errorMessage}>no route defined</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929'
  },
  nav: {
    flex: 1
  },
  noRouteContainer: {
    flex: 1, 
    alignItems: 'stretch', 
    justifyContent: 'center'
  },
  noRouteTouchableArea: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  errorMessage: {
    color: 'red', 
    fontWeight: 'bold'
  }
});

AppRegistry.registerComponent('FriendlyGame', () => FriendlyGame);
