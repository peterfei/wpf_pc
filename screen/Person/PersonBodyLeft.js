import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, DeviceEventEmitter,Alert
} from "react-native";

import { StackActions, NavigationActions } from 'react-navigation';
import { color, screen } from "./index";
import { font, getScreen } from "../Public/index";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
//个人中心主体左侧
class PersonBodyLeft extends Component {
  state = {
    currentIndex: 0,
    title: ['个人中心', '账户设置', 'Mac地址', '我的订单'],
    Image: [{ "Image": require('../img/tab1.png') }, { "Image": require('../img/tab2.png') }, { "Image": require('../img/tab3.png') }, { "Image": require('../img/tab4.png') }],
    userName: '',
    mbHeadUrl: '',
  }
  async componentDidMount() {
    let member = await storage.get("member", "")
    let mbName = member.mbName
    let mbHeadUrl = member.mbHeadUrl=='RYKJ/'||member.mbHeadUrl== null?'':member.mbHeadUrl
    this.setState({
      userName: mbName,
      mbHeadUrl: mbHeadUrl
    })
  }

  renderLabel() {
    let indicator = [], isLabel;
    let title = this.state.title;
    for (let i = 0; i < title.length; i++) {
      i == this.state.currentIndex ?
        isLabel = { backgroundColor: "rgb(78,78,78)", borderRightWidth: 1, borderColor: "rgb(110,110,110)" }
        :
        isLabel = {}
      indicator.push(
        <TouchableOpacity key={i}
          onPress={() => this.change(i)}
        >
          <View style={[styles.label, color.borderBottom, isLabel]}>
            <Image style={{ width: 25, height: 25, margin: 10 }}
              source={this.state.Image[i].Image}
            />
            <Text style={font.font20}>{title[i]}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    indicator.push(
      <TouchableOpacity
        onPress={() => {this.props.backLoding()}}
      >
        <View style={[styles.label, color.borderBottom]}>
          <Image style={{ width: 25, height: 25, margin: 10 }}
            source={require('../img/backLoding.png')}
          />
          <Text style={font.font20}>退出登录</Text>
        </View>
      </TouchableOpacity>
    )
    return indicator;
  }
  change(i) {
    this.setState({
      currentIndex: i
    });
    DeviceEventEmitter.emit("PersonBodyRightNum", {
      num: i
    });
  }
  render() {
    return (
      <View style={[color.rightBackground, styles.container]}>
        <View style={[styles.personInformation, color.borderBottom]}>
          <Image
            style={styles.headPortrait}
            source={this.state.mbHeadUrl!=='' ? { uri: this.state.mbHeadUrl } : require('../img/text.jpeg')}
          />
          <Text style={font.font20}>{this.state.userName}</Text>
        </View>

        {this.renderLabel()}

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '17%',
    borderRightWidth: 1,
    borderColor: "rgb(110,110,110)"
  },
  personInformation: {
    height: 170,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headPortrait: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  label: {
    width: '100%',
    height: 70,
    paddingLeft: 30,
    alignItems: 'center',
    flexDirection: 'row',
  }
});

module.exports = PersonBodyLeft;
