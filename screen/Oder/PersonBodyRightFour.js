import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput,DeviceEventEmitter
} from "react-native";

import { color, screen } from "../Person/index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import OrderItem from './OrderItem';
import Loading from '../common/Loading'
//个人中心主体右侧

class PersonBodyRightFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowIndex: 0,
      buttonData: [
        { title: "全部订单", orderState: '' },
        { title: "已完成", orderState: 'finished' },
        { title: "待支付", orderState: 'waitPayment' },
        { title: "已取消", orderState: 'canceled' },
      ]
    }
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  changePage(i) {
    this.setState({
      nowIndex: i
    })
    DeviceEventEmitter.emit("checkBotton");
  }
  _renderButton() {
    let arr = []
    for (let i = 0; i < this.state.buttonData.length; i++) {
      arr.push(
        <TouchableOpacity key={i} style={styles.buttonBody} onPress={() => { this.changePage(i) }} >
          <Text style={[{ fontSize: 18 }, this.state.nowIndex == i ? { color: '#02BAE6' } : {color:'#8C8C8C'}]}>
            {this.state.buttonData[i].title}
          </Text>
        </TouchableOpacity>
      )
    }
    return arr
  }

  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <View style={[styles.top, color.borderBottom]}>
          <Text style={font.font20}>|&nbsp;&nbsp;我的订单</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.button}>
            {this._renderButton()}
          </View>
          <OrderItem orderState={this.state.buttonData[this.state.nowIndex].orderState} />
        </View>
        <Loading ref={r => { this.Loading = r }} hide={true} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '83%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    position: "absolute",
    top: 0,
    width: '100%',
    height: 70,
    justifyContent: 'center',
    paddingLeft: 30
  },
  main: {
    padding: 70,
    width: '90%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
  },
  buttonBody: {

  }
});

module.exports = PersonBodyRightFour;
