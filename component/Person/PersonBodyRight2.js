import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, TextInput, DeviceEventEmitter
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";

//个人中心主体右侧

class PersonBodyRight2 extends Component {
  state = {
    securityLevel: '中',
    warn: '您的账号存在安全风险，建议您更改密码，提高安全性。',
    changePassword: false,
    changephoneNumber: false,
    phoneNumber: '17391973517'
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <View style={[styles.top, color.borderBottom]}>
          <Text style={font.font20}>|&nbsp;&nbsp;账号设置</Text>
        </View>
        <View style={styles.main}>
          {/* 修改头像 */}
          <View style={{
            flexDirection: 'row', marginTop: 40,
            marginBottom: 30,
          }}>
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 40,
              }}
              source={require('../../img/text.jpg')}
            />
            <View style={{
              justifyContent: 'space-around',
              marginLeft: 30,
            }}>
              <Text style={font.font20Blue}>点击修改头像</Text>
              <Text style={font.font15NoBold}>支持jpg、jpeg、png类型文件</Text>
            </View>
          </View>
          {/* 修改头像 */}
          <View style={styles.mainBody}>
            <View style={[styles.row1, { marginBottom: 10, alignItems: 'center' }]}>
              <Text style={[font.font25, { fontWeight: 'bold' }]}>安全等级：</Text>
              <View style={{ justifyContent: 'center' }}>
                <Image style={{ height: 20 }} resizeMode='contain'
                  source={require('../../img/safety.png')} />
                <Image style={{ height: 20, position: "absolute", left: 0 }} resizeMode='contain'
                  source={require('../../img/safety2.png')} />
              </View>
              <Text style={[font.font25, { fontWeight: 'bold' }]}>{this.state.securityLevel}</Text>
            </View>
            <Text style={[font.font15NoBold, { height: 20, marginBottom: 10 }]}>{this.state.warn}</Text>
            <View style={styles.row2}>
              <View style={styles.center}>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require('../../img/changephoneNumber.png')} />
                <Text style={font.font20}>手机绑定</Text>
              </View>
              <View style={styles.round}>
                <Text style={font.font18}>你已经绑定了手机号&nbsp;&nbsp;&nbsp;&nbsp;{this.state.phoneNumber.slice(0, 6) + '*****'}</Text>
                <Text style={font.font18NoBoldGray}>手机号用于快速登录、找回密码、提高用户安全性</Text>
              </View>
              <View>
                <Text style={font.font20Blue}
                  onPress={() => {
                    this.changephoneNumber();
                  }}>
                  修改手机号</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.center}>
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require('../../img/changPassword.png')} />
                <Text style={font.font20}>密码保护</Text>
              </View>
              <View style={styles.round}>
                <View style={styles.row}>
                  <Text style={font.font18}>密码强度</Text>
                  <View style={{ justifyContent: 'center' }}>
                    <Image style={{ height: 10 }} resizeMode='contain'
                      source={require('../../img/safety.png')} />
                    <Image style={{ height: 10, position: "absolute", left: 0 }} resizeMode='contain'
                      source={require('../../img/safety2.png')} />
                  </View>
                  <Text style={font.font18}>{this.state.securityLevel}</Text>
                </View>
                <Text style={font.font18NoBoldGray}>密码用于一般登录、找回密码、保证用户安全性</Text>
              </View>
              <View>
                <Text style={font.font20Blue}
                  onPress={() => {
                    this.changePassword();
                  }}>
                  修改密码</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
  changephoneNumber() {
    this.setState({
      changephoneNumber: true
    })
    DeviceEventEmitter.emit("changephoneNumberView", { changephoneNumberView: true });
  }
  changePassword() {
    this.setState({
      changePassword: true
    })
    DeviceEventEmitter.emit("changePasswordView", { changePasswordView: true });
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '83%',
    paddingTop: 100,
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
  mainBody: {
    marginBottom: 30,
    borderTopWidth: 1,
    borderColor: "rgb(110,110,110)",
    alignItems: 'center',
  },
  round: {
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = PersonBodyRight2;
