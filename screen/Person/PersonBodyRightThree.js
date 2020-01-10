import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput, NativeModules
} from "react-native";

import { StackActions, NavigationActions } from 'react-navigation';
import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import Loading from '../common/Loading'
//个人中心主体右侧-Mac设置

class PersonBodyRightThree extends Component {
  state = {
    deviceIds: '',
    MacAddress: '',
    isConn: true
  }
  async componentDidMount() {
    this.currMbAllDeviceIds();
    let MacAddress = await NativeModules.DeviceInfoG.GetCpuID();
    this.setState({
      MacAddress: MacAddress
    })
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  async currMbAllDeviceIds(state) {
    state?null:this.Loading2.show('加载中……');
    let token = await storage.get("token", "")
    let url = api.base_uri + "pc/member/currMbAllDeviceIds?token=" + token + "&business=pc"
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        state?null:this.Loading2.close();
        //alert(JSON.stringify(result) )
        this.setState({
          deviceIds: result.deviceIds
        })
      })
        .catch(err => {
          this.Loading2.close()
          this.Loading.autoClose("请检查您的网络环境！")
        })
  }
  async clearCurrMbDeviceIds() {
    let token = await storage.get("token", "")
    let url = api.base_uri + "pc/member/clearCurrMbDeviceIds?token=" + token + "&business=pc"
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        if (result.msg == "success") {
          this.Loading2.show('解除成功,正在退出登录……');
          this.timer = setTimeout(() => {
            this.Loading2.close()
            this.Loading.logout()
          }, 1000);
          this.currMbAllDeviceIds('will go out');
        } else {
          this.Loading2.show('解除失败,'+JSON.stringify(result.msg));
          this.timer = setTimeout(() => {
            this.Loading2.close()
          }, 1000);
        }
      })
        .catch(err => {
          this.Loading.close()
          this.setState({
              isConn: false
          })
          this.Loading.autoClose("请检查您的网络环境！")
        })
  }

  _renderMac() {
    let itemArr = [];
    let deviceIds = this.state.deviceIds;
    let MacAddress = this.state.MacAddress
    for (let i = 0; i < deviceIds.length; i++) {
      itemArr.push(
        <View style={styles.row} key={i}>
          <Image style={{ width: 23, resizeMode: 'contain' }} source={require('../img/person/computer.png')} />
          <Text style={font.font20}>&nbsp;&nbsp;&nbsp;您的设备({i + 1})&nbsp;&nbsp;:&nbsp;&nbsp;{deviceIds[i].deviceId}</Text>
          {MacAddress == deviceIds[i].deviceId ? <Text style={[font.font18NoBoldBlue, { position: 'absolute', right: -80 }]}>(当前设备)</Text> : null}
        </View>
      )
    }
    return itemArr
  }

  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <View style={[styles.top, color.borderBottom]}>
          <Text style={font.font20}>|&nbsp;&nbsp;Mac地址</Text>
        </View>
        <View style={styles.main}>
          {this.state.isConn ? this._renderMac() : null}
          {/*<TouchableOpacity style={styles.button}*/}
          {/*  onPress={() => this.Loading.alertChoose('确定解绑所有设备')}  >*/}
          {/*  <Text style={[font.font18NoBoldBlue, { fontSize: 18 }]}>解绑所有设备</Text>*/}
          {/*</TouchableOpacity>*/}
          <Loading ref={r => { this.Loading = r }} hide={true} yes={()=>{this.Loading.no();this.clearCurrMbDeviceIds()}} navigation={this.props.navigation} />
          <Loading ref={r => { this.Loading2 = r }} hide={true} />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 56, 56, 1)',
    padding: 50,
    paddingLeft: 150,
    paddingRight: 150
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  button: {
    backgroundColor: 'rgba(48, 48, 48, 1)',
    borderRadius: 15,
    height: 30,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = PersonBodyRightThree;
