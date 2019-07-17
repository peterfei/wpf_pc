import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import {NavigationActions} from "react-navigation";
import { color} from "./index";
import {font} from "../Public";

  //支付页面顶部
class PayTop extends Component {
  render() {
    return (
      <View style={color.topBackground}>
        <View style={styles.top}>
          <Text style={font.font30}>支付界面</Text>
          <TouchableHighlight style={styles.buttonImage}
          onPress={() => { 
            this.props.navigation.dispatch(NavigationActions.back())
            // setTimeout(()=>{
            //   DeviceEventEmitter.emit("UnityWinEmitter", {
            //     modalVisible: "flex"
            //   });
            // },200)
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
  
  module.exports = PayTop;
  