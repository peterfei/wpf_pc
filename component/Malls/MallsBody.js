import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

  //商城
export default class MallsScreen extends Component {
  static navigationOptions = {
    title:'Person',
  }
  render() {
    return (
      <View>
        <View>
          <Text>商城</Text>
        </View>
      </View>
    );
  }
}
