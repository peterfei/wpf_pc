import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,
  DeviceEventEmitter
} from "react-native";

import {color, screen } from "./index";
import {font} from "../Public/index";
import {
  StackNavigator,
  TabNavigator,
  TabBarTop,
  createStackNavigator,
  TabBarBottom,
  NavigationActions,
  
} from "react-navigation";
//个人中心顶部

class PersonTop extends Component {
  render() {
    return (
      <View style={color.topBackground}>
        <View style={styles.top}>
          <Text style={font.font30}>个人中心</Text>
          <TouchableHighlight style={styles.buttonImage}
          onPress={() => { 
            this.props.navigation.dispatch(NavigationActions.back())
            setTimeout(()=>{
              DeviceEventEmitter.emit("UnityWinEmitter", {
                modalVisible: "flex"
              });
            },200)
          }}>
          <Image
          style={styles.Image}
            source={require('../../img/close.png')}
          />
          </TouchableHighlight>
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
  },
  Image:{
    width:70/2,
    height:70/2,
  }
});

module.exports = PersonTop;
