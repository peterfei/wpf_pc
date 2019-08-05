import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { screen, system } from "../common";
import { color, Separator, SpacingView } from "../widget";
type State = {
  infos: Array<Object>
};
type Props = {
  navigation: any
};
export default class MoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <View>
        <Text>111</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15
  }
});
