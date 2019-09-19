import React, { Component } from "react";
import { StyleSheet, View, DeviceEventEmitter,Text } from "react-native";

import Cell from "./Cell";
import api from '../api';
import { storage } from "../Public/storage";
import CryptoJS from "crypto-js";
import _ from "lodash";
import Loading from '../common/Loading'

export default class OrderItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nowIndex: 1,
      dataList: [],
    };
  }

  componentDidMount() {
    this.myOrder()
  }
  listeners = {
    update: DeviceEventEmitter.addListener(
      "checkBotton",
      () => {
        this.myOrder()
      }
    )
  };
  componentWillUnmount() {
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }

  async myOrder() {
    this.Loading.show('加载中……');
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = api.base_uri_test + "/pc/order/myOrder?business=anatomy&limit=4&token=" + token + "&ordState=" + this.props.orderState + '&page=' + this.state.nowIndex
    //alert(url)
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        // alert(JSON.stringify(result))
        if (result.msg == 'success') {
          this.Loading.close();
          this.setState({
            dataList: result.page.list
          })
        }
      })
  }

  _renderCell() {
    let arr = []
    for (let i = 0; i < this.state.dataList.length; i++) {
      arr.push(
        <Cell info={this.state.dataList[i]} navigation={this.props.navigation} />
      )
    }
    return arr
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderCell()}
        <Loading ref={r=>{this.Loading = r}} hide = {true} /> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    fontSize: 20,
    textAlign: "center"
  },
  container: {
    width:'100%',
    borderColor:'#383838',
    borderWidth:1,
    paddingLeft:30,
    paddingRight:30,
  }
});
