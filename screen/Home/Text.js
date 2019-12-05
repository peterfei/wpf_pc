/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity,NativeModules
} from 'react-native';
import _ from "lodash";

import { storage } from "../Public/storage";

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'Home',
  }
  state = {
  };

  componentDidMount() {

  }



  change(){
    NativeModules.Dialog.OpenShowDialog();
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={()=>this.change()} >
          <Image style={{ width: 200, height: 200 }}
            source={require("../img/text.jpeg")}
          />
        </TouchableOpacity>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(16,16,16)",
    justifyContent: 'center',
    alignItems: 'center'
  },
});
