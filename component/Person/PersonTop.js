import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import {color, screen } from "./index";
import {font} from "../Public/index";
import {
  StackNavigator,
  TabNavigator,
  TabBarTop,
  createStackNavigator,
  TabBarBottom,
  NavigationActions
} from "react-navigation";
//个人中心顶部

class PersonTop extends Component {
  render() {
    return (
      <View style={color.topBackground}>
        <View style={styles.top}>
          
          <TouchableHighlight onPress={() => 
            this.props.navigation.dispatch(NavigationActions.back())


          }>
          <Text style={font.font30}>个人中心</Text>

          </TouchableHighlight>
          <Image
            style={styles.buttonImage}
            
            source={require('../../img/close.png')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  top:{
    height:70,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:"row",
  },
  buttonImage:{
    position:"absolute",
    top:70/2/2,
    right:70/2/2,
    width:70/2,
    height:70/2,
  }
});

module.exports = PersonTop;
