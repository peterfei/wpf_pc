import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableOpacity } from "react-native";

import { PayTop, PayBody} from "./index";

  //支付页面
export default class PayScreen extends Component {
  static navigationOptions = {
    title:'PayScreen',
  }
  render() {
    return (
      <View style={styles.container}>
        <PayTop navigation={this.props.navigation}/>
        <PayBody navigation={this.props.navigation} comboId={this.props.navigation.state.params.comboId}/>
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