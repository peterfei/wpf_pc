import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput, DeviceEventEmitter
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
      nowTopIndex: 0,//顶部索引页码
      nowBottomIndex: 0,//底部索引页码
      num: 1,//总页码数
      renderRightDot: false,//页码左侧点点
      renderLeftDot: false,//页码右侧点点
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
  changePage(i, type, value) {
    if (type == 'top') {
      this.setState({
        nowTopIndex: i,
        nowBottomIndex: 0,
      })
      DeviceEventEmitter.emit("checkBotton");
    } else if (type == 'bottom') {
      value ? i = value : i = i
      this.setState({
        nowBottomIndex: i
      }, () => {
        DeviceEventEmitter.emit("checkBotton", { nowBottomIndex: this.state.nowBottomIndex + 1 });
      })
    }
  }
  getOrderNumber(totalPage) {
    this.setState({
      num: totalPage
    })
  }
  _renderTopButton() {
    let arr = []
    for (let i = 0; i < this.state.buttonData.length; i++) {
      arr.push(
        <TouchableOpacity key={i} style={styles.buttonBody} onPress={() => { this.changePage(i, 'top') }} >
          <Text style={[{ fontSize: 18 }, this.state.nowTopIndex == i ? { color: '#02BAE6' } : { color: '#8C8C8C' }]}>
            {this.state.buttonData[i].title}
          </Text>
        </TouchableOpacity>
      )
    }
    return arr
  }

  _renderBottomButton() {
    let arr = []
    arr.push(
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(0, 'bottom') }} >
        <Text style={{ fontSize: 18, color: 'white' }}>首页</Text>
      </TouchableOpacity>
    )
    arr.push(
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(0, 'bottom', this.state.nowBottomIndex - 1) }} >
        <Text style={{ fontSize: 18, color: 'white' }}>上一页</Text>
      </TouchableOpacity>
    )
    if (this.state.renderLeftDot) {
      arr.push(
        <Text style={{ paddingRight: 30, fontSize: 18, color: 'white' }}>···</Text>
      )
    }
    
    if(this.state.num>5){
      for (let i = 0; i < this.state.num; i++) {
        if (i < this.state.nowBottomIndex + 3 && i > this.state.nowBottomIndex - 3) {//只显示当前左右共五个页面
          arr.push(
            <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(i, 'bottom') }} >
              <View style={[{ padding: 5, borderWidth: 1 }, this.state.nowBottomIndex == i ? { borderColor: '#02BAE6' } : { borderColor: 'white' }]}>
                <Text style={[{ fontSize: 18 }, this.state.nowBottomIndex == i ? { color: '#02BAE6' } : { color: 'white' }]}>
                  {i + 1}
                </Text>
              </View>
            </TouchableOpacity>
          )
        } else if (!this.state.renderLeftDot && i < this.state.nowBottomIndex - 3) {
          this.setState({
            renderLeftDot: true
          })
        } else if (!this.state.renderRightDot && i > this.state.nowBottomIndex + 3) {
          this.setState({
            renderRightDot: true
          })
        }else if (this.state.renderLeftDot && this.state.nowBottomIndex < 3) {
          this.setState({
            renderLeftDot: false
          })
        }else if (this.state.renderRightDot && this.state.nowBottomIndex > this.state.num - 1 - 3) {
          this.setState({
            renderRightDot: false
          })
        }
      }
    }else{
      if(this.state.renderRightDot||this.state.renderLeftDot){
        this.setState({
          renderLeftDot: false,
          renderRightDot: false
        })
      }
      for (let i = 0; i < this.state.num; i++) {
        arr.push(
          <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(i, 'bottom') }} >
            <View style={[{ padding: 5, borderWidth: 1 }, this.state.nowBottomIndex == i ? { borderColor: '#02BAE6' } : { borderColor: 'white' }]}>
              <Text style={[{ fontSize: 18 }, this.state.nowBottomIndex == i ? { color: '#02BAE6' } : { color: 'white' }]}>
                {i + 1}
              </Text>
            </View>
          </TouchableOpacity>
        )
      }
    }
    
    if (this.state.renderRightDot) {
      arr.push(
        <Text style={{ paddingRight: 25, fontSize: 18, color: 'white' }}>···</Text>
      )
    }
    arr.push(
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(0, 'bottom', this.state.nowBottomIndex + 1) }} >
        <Text style={{ fontSize: 18, color: 'white' }}>下一页</Text>
      </TouchableOpacity>
    )
    arr.push(
      <TouchableOpacity style={{ paddingRight: 25 }} onPress={() => { this.changePage(0, 'bottom', this.state.num - 1) }} >
        <Text style={{ fontSize: 18, color: 'white' }}>尾页</Text>
      </TouchableOpacity>
    )
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
            {this._renderTopButton()}
          </View>

          <OrderItem
            orderState={this.state.buttonData[this.state.nowTopIndex].orderState}
            getOrderNumber={(num) => this.getOrderNumber(num)} />

          <View style={[styles.button, { justifyContent: 'flex-end' }]}>
            {this._renderBottomButton()}
          </View>

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
    // justifyContent: 'center',
    paddingTop:20,
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
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  buttonBody: {
    paddingRight: 50
  }
});

module.exports = PersonBodyRightFour;
