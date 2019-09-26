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
  TouchableOpacity,
  DeviceEventEmitter,
  AsyncStorage, NativeModules
} from 'react-native';
import _ from "lodash";

import UnityView from "../../UnityView";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'Home',
  }
  state = {
    modalVisible: "flex",
    width: 0,
    height: 0,
  };
  listeners = {
    update: [DeviceEventEmitter.addListener(
      "UnityWinEmitter",
      ({ ...passedArgs }) => {
        let _key = passedArgs.modalVisible;
        if (_key != "") {
          this.setState({
            modalVisible: _key
          });
        }
      }
    ),
    DeviceEventEmitter.addListener("testBind", data => {
      // alert(data);
      if (data == "hide") {
        this.sendMsg()
      }
      else if (data == 'OpenClientCenter') {
        this.showPerson();
        // alert(1111)
      }
      else if (data == 'ShowMall') {
        this.showMalls();
      }
      else if (data == 'OpenSearching') {
        this.showSearch();
      }
    })
    ]
  };
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lod.ash
    _.each(this.listeners, listener => {
      listener[0].remove();
      listener[1].remove();
    });
    this.timer && clearInterval(this.timer);
  }
  showPerson() {
    this.setState({
      modalVisible: "none"
    });
    this.props.navigation.navigate('Person');
  };
  showMalls() {
    this.setState({
      modalVisible: "none"
    });
    this.props.navigation.navigate('Malls');
  };
  showSearch() {
    this.setState({
      modalVisible: "none"
    });
    this.props.navigation.navigate('Search');
  }
  async componentDidMount() {
    let mainHeight = await NativeModules.MyDialogModel.getMainHeight();
    let mainWidth = await NativeModules.MyDialogModel.getMainWidth();
    this.setState({
      height: mainHeight - 5,
      width: mainWidth
    })
  }
  async sendMsg() {

    let member = await storage.get("member", "")
    let token = await storage.get("token", "")
    // alert(`tokens is ${JSON.stringify(tokens)}`)
    let data = { "mb_id": member.mbId, "token": token, "height": this.state.height }
    let _content = { "type": "ClientInfo", "data": data }
    // alert(JSON.stringify(_content))
    NativeModules.MyDialogModel.SendMessageToUnity(
      JSON.stringify(_content)
    );
  }
  onUnityMessage(handler) {
    // alert(JSON.stringify(handler))
    if (handler.name == "hide") {
      this.setState({
        height: 0,
        width: 0
      })
    }
    if (handler.name == "OpenClientCenter") {
      this.showPerson();
    }
    if (handler.name == "ShowMall") {
      this.showMalls();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <UnityView
          height={this.state.height}
          width={this.state.width}
          display={this.state.modalVisible}

        >
        </UnityView> */}

        {/* 1.1.主界面按钮 */}
        <View style={{
          position: "absolute",
          right: 50,
          top: 50,
        }}>
          <TouchableOpacity
            onPress={() => {
              this.sendMsg();
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>sendMsg</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.showSearch();
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>搜索</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.showPerson();
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>个人中心</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.showMalls();
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>商城</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(16,16,16)"
  },
  component: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  }
});
