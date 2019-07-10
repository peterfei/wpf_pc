import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import { PersonBodyLeft, PersonBodyRight, PersonTop} from "./index";

//个人中心
export default class PersonScreen extends Component {
  static navigationOptions = {
    title:'Person',
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <PersonTop navigation={this.props.navigation}/>
        {/* Body */}
        <View style={styles.body}>
          <PersonBodyLeft/>
          <PersonBodyRight/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%'
  },
  body:{
    flexDirection:'row',
    width:'100%',
    height:'100%',
  }
});