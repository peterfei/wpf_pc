import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableOpacity ,DeviceEventEmitter} from "react-native";

import {NavigationActions} from "react-navigation";
import { color} from "./index";
import {font} from "../Public";

  //商城顶部
class MallsTop extends Component {
  render() {
    return (
      <View style={color.topBackground}>
        <View style={styles.top}>
          <Text style={font.font30}>商城中心</Text>
          <TouchableOpacity style={styles.buttonImage}
          onPress={() => { 
            this.props.navigation.dispatch(NavigationActions.back())
            setTimeout(()=>{
              DeviceEventEmitter.emit("UnityWinEmitter", {
                modalVisible: "flex"
              });
            },100)
          }}>
          <Image
          style={styles.Image}
            source={require('../img/close.png')}
          />
          </TouchableOpacity>
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
  
  module.exports = MallsTop;
  