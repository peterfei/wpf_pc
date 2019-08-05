import React, { PureComponent, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  DeviceEventEmitter
} from "react-native";
import { color, Button, NavigationItem, SpacingView } from "../widget";
import { Heading1, Heading2, Heading3, Paragraph } from "../widget/Text";

import { screen, system } from "../common";
type Props = {
  navigation: any
};

export default class MenuView extends Component {
  componentDidMount() {
    // alert(JSON.stringify(this.props.navigation));
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeTabList = async (navigation, _k, _n) => {
    // alert(_k);
    if (_k == "3") {
      this.props.navigation.navigate("Tab2", { key: _k, name: _n });
    } else if (_k == "24") {
      this.props.navigation.navigate("Tab3", { key: _k, name: _n });
    } else if (_k == "44") {
      this.props.navigation.navigate("Tab4", { key: _k, name: _n });
    } else if (_k == "99") {
      navigation.navigate("Game", { key: _k, name: _n });
    } else if (_k == "13") {
      navigation.navigate("WeikeScreen", { key: _k, name: _n });
    } else {
      this.props.navigation.navigate("Tab", { key: _k, name: _n });
    }

    // this.getStorageByStructList("jubu")
  };
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          // paddingTop: 20,
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          backgroundColor: "white",
          padding: 25,
          flex: 1
        }}>
        <View style={{ flex: 3, marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "2", "gouzao");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "Home"
                    ? "red"
                    : "black",
                fontSize: 18
              }}>
              系统
            </Heading3>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3, marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "3", "jujie");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "Home2"
                    ? "red"
                    : "black",
                fontSize: 18
              }}>
              局部
            </Heading3>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3, marginLeft: 20, zIndex: 9999 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "44", "yiyong");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "Home4"
                    ? "red"
                    : "black",
                fontSize: 18
              }}>
              临床
            </Heading3>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3, marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "24", "xuewei");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "Home3"
                    ? "red"
                    : "black",
                fontSize: 18
              }}>
              经脉
            </Heading3>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 3, marginLeft: 20, zIndex: 9999 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "99", "youxi");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "PingJieScreen"
                    ? "#00bee8"
                    : "black",
                fontSize: 18
              }}>
              互动游戏
            </Heading3>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 3, marginLeft: 20, zIndex: 9999 }}>
          <TouchableOpacity
            onPress={() => {
              this.changeTabList(this.props.navigation, "13", "weike");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: -5,
                marginTop: 10,
                color:
                  this.props.navigation.state.routeName == "WeikeScreen"
                    ? "#00bee8"
                    : "black",
                fontSize: 18
              }}>
              微课
            </Heading3>
          </TouchableOpacity>
        </View>

        {/* <View style={{ flex: 3, marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => {
              // this.changeTabList(this.props.navigation, "24", "xuewei");
              storage.clearMapForKey("userTokens");
              //NativeModules.MyDialogModel.getMainWidth();
              this.props.navigation.navigate("Login");
            }}>
            <Heading3
              style={{
                marginBottom: 2,
                marginLeft: 10,
                marginTop: 10,
                fontSize: 18
              }}>
              退出到登录
            </Heading3>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}
