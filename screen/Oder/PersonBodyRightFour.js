import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";
import OrderItem from './OrderItem';
import Loading from '../common/Loading'
//个人中心主体右侧

class PersonBodyRightFour extends Component {
  componentDidMount() {
    this.currMbAllDeviceIds();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <View style={[styles.top, color.borderBottom]}>
          <Text style={font.font20}>|&nbsp;&nbsp;我的订单</Text>
        </View>
        <View style={styles.main}>
          <ScrollableTabView
            style={styles.container}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={styles.lineStyle}
            tabBarTextStyle={{ marginTop: 10 }}
            tabBarActiveTextColor={color.main}>

            <View style={styles.textStyle} tabLabel="全部订单">
              <OrderItem orderState="" navigation={this.props.navigation} />
            </View>

            <View style={styles.textStyle} tabLabel="已完成">
              <OrderItem orderState="finished" navigation={this.props.navigation} />
            </View>

            <View style={styles.textStyle} tabLabel="待支付">
              <OrderItem orderState="waitPayment" navigation={this.props.navigation} />
            </View>
            <View style={styles.textStyle} tabLabel="已取消">
              <OrderItem orderState="canceled" navigation={this.props.navigation} />
            </View>

          </ScrollableTabView>
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
});

module.exports = PersonBodyRightFour;
