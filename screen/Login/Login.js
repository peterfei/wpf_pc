import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ImageBackground
} from "react-native";
import {
  color,
  Button,
  NavigationItem,
  SpacingView,
  Separator
} from "../widget";
import LoginForm from "./LoginForm";
import { storage } from "../common/storage";

class Login extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentWillMount() {
    // debugger;
    // alert(Dimensions.get("window").height);
    let tokens = await storage.get("userTokens", "");
    //alert("tokens is " + JSON.stringify(tokens));

    if (tokens == -1 || tokens == -2) {
      return false;
    } else {
      this.props.navigation.push("Tab");
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <LoginForm navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1
    backgroundColor: color.primary
  },
  loginContainer: {
    // alignItems: 'center',
    // flexGrow: 1,
    justifyContent: "center"
  }
});
export default Login;
