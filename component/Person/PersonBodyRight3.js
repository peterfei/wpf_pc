import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,TextInput } from "react-native";

import {color, screen } from "./index";
import { font,getScreen } from "../Public";

//个人中心主体右侧

class PersonBodyRight3 extends Component {
  render() {
    return (
      <View><Text>PersonBodyRight3</Text></View>
    )}
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'83%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  
});

module.exports = PersonBodyRight3;
