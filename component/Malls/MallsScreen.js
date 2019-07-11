import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import { MallsTop, MallsBody} from "./index";

  //商城
export default class MallsScreen extends Component {
  static navigationOptions = {
    title:'Malls',
  }
  render() {
    return (
      <View style={styles.container}>
        <MallsTop navigation={this.props.navigation}/>
        <MallsBody/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%'
  },
});