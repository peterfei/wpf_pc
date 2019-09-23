import React, { Component } from "react";
import { StyleSheet, View, DeviceEventEmitter, Text } from "react-native";

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
      dataList: [],
    };
  }

  componentDidMount() {
    this.myOrder(1)
  }
  listeners = {
    update: DeviceEventEmitter.addListener(
      "checkBotton",
      ({ ...passedArgs }) => {
        let nowBottomIndex = passedArgs.nowBottomIndex?passedArgs.nowBottomIndex:1
        this.myOrder(nowBottomIndex)
      }
    )
  };
  componentWillUnmount() {
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }

  async myOrder(nowBottomIndex) {
    this.Loading.show('加载中……');
    let token = await storage.get("token", "")
    let url = api.base_uri_test + "/pc/order/myOrder?business=anatomy&limit=4&token=" + token + "&ordState=" + this.props.orderState + '&page=' + nowBottomIndex
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        //alert(JSON.stringify(result))
        if (result.msg == 'success') {
          this.Loading.close();
          this.setState({
            dataList: result.page.list
          })
          this.props.getOrderNumber(result.page.totalPage)
        }
      })
  }

  _renderCell() {
    let arr = []
    if (this.state.dataList.length == 0) {
      arr.push(
        <Text style={{ color: 'white', textAlign: "center" }}>您还没有此类订单信息</Text>
      )
    } else {
      for (let i = 0; i < this.state.dataList.length; i++) {
        arr.push(
          <Cell info={this.state.dataList[i]} navigation={this.props.navigation} />
        )
      }
    }
    return arr
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderCell()}
        <Loading ref={r => { this.Loading = r }} hide={true} />
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
    width: '100%',
    borderColor: '#383838',
    borderWidth: 1,
    paddingLeft: 30,
    paddingRight: 30,
  }
});
