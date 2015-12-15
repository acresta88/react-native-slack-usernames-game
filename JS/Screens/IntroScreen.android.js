/**
* Copyright (c) 2015-present, Facebook, Inc. All rights reserved.
*
* You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
* copy, modify, and distribute this software in source code or binary form for use
* in connection with the web services and APIs provided by Facebook.
*
* As with any software that integrates with the Facebook platform, your use of
* this software is subject to the Facebook Developer Principles and Policies
* [http://developers.facebook.com/policy/]. This copyright notice shall be
* included in all copies or substantial portions of the software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Navigator
} = React;

var GridScreen = require('./GridScreen');
var TimerMixin = require('react-timer-mixin');

var IntroScreen = React.createClass({
  
  mixins: [TimerMixin],

  _handleBackButtonPress: function() {
    this.props.navigator.pop();
  },

  _handleNextButtonPress: function() {
    console.log("_handleNextButtonPress");
    
    this.props.navigator.push({
      component: 'GridScreen',
      title: 'GridScreen',
    });
  },

  _onClick: function() {
    console.log("_onClick");
    this._handleNextButtonPress();
  },
  

  componentDidMount: function() {
    this.setTimeout(
      () => { 
        this._handleNextButtonPress();
      },
      1000
    );
  },
  
  render: function() {

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
});

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