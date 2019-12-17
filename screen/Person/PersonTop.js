import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules
} from "react-native";

import {color, screen } from "./index";
import {font} from "../Public/index";
import {NavigationActions} from "react-navigation";
//个人中心顶部

class PersonTop extends Component {
  render() {
    return (
      <View style={color.topBackground}>
        <View style={styles.top}>
          <Text style={font.font30}>个人中心</Text>
          <TouchableOpacity style={styles.buttonImage}
          onPress={async() => { 
            this.props.navigation.dispatch(NavigationActions.back())
            let _w =  await NativeModules.MyDialogModel.getMainWidth();
            let _h =  await NativeModules.MyDialogModel.getMainHeight();
            setTimeout(async()=>{
              DeviceEventEmitter.emit("UnityWinEmitter", {
                // modalVisible: "flex"
                width:_w,
                height:(_h),
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

module.exports = PersonTop;
