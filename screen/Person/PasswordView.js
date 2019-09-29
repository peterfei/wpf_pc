import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput, DeviceEventEmitter
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import Loading from '../common/Loading'

//个人中心修改密码

class PasswordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      sureNewPassword: '',
      warn: '',
    };
  }
  async updatePassWord() {
    let token = await storage.get("token", "")
    let userName = await storage.get("userName", "")
    let url = api.base_uri_test + "pc/member/updatePassWord?tell="
      + userName + "&password=" + this.state.oldPassword + "&newPassword=" + this.state.newPassword + "&newPasswordConfirm=" + this.state.sureNewPassword + "&token=" + token
    if (this.state.newPassword.length < 6) {
      this.setState({
        warn: '请输入6-12位密码'
      })
      return;
    } {
      await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(resp => resp.json())
        .then(result => {
          if (result.msg == "success") {
            this.Loading.show('密码修改成功');
            this.timer = setTimeout(() => {
              this.Loading.close()
            }, 1000);
            this.setState({
              warn: ' '
            })
            storage.remove("password");
            let AESpassword = CryptoJS.AES.encrypt(this.state.newPassword, 'CB3EC842D7C69578').toString();
            storage.save("password", "", AESpassword);
          } else {
            this.Loading.show(result.msg);
            this.timer = setTimeout(() => {
              this.Loading.close()
            }, 1000);
          }
        })
    }

  }

  close() {
    DeviceEventEmitter.emit("changePasswordView", { changePasswordView: false });
  }

  render() {
    let str = this.state.newPassword
    let num = /\d+/
    let letter = /[a-zA-Z]+/
    return (
      <View style={styles.topView}>
        <View style={styles.bodyView}>
          <View style={styles.title}>
            <Text style={font.font20}>修改密码</Text>
            <TouchableOpacity style={styles.close}
              onPress={() => this.close()}>
              <Image style={{ width: '100%', height: '100%' }}
                source={require('../img/close.png')} />
            </TouchableOpacity>
          </View>

          <View style={[styles.row, { marginTop: 30 }]}>
            <Text>当前密码：&nbsp;&nbsp;&nbsp;&nbsp;</Text>
            <TextInput style={styles.input} placeholderTextColor="rgb(219,219,219)"
              maxLength={12} secureTextEntry={true}
              placeholder='请输入密码'
              onChangeText={(text) => this.setState({ oldPassword: text })} />
          </View>
          <View style={[styles.row, { marginTop: 30 }]}>
            <Text>新密码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
            <TextInput style={styles.input} placeholderTextColor="rgb(219,219,219)"
              maxLength={12} secureTextEntry={true}
              placeholder='请输入新密码'
              onChangeText={(text) => this.setState({ newPassword: text })} />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 60 }}>
            <Text>{num.test(str) && letter.test(str) && str.length > 6 ? '高' : num.test(str) || letter.test(str) ? '中' : '低'}</Text>
            <View style={{ justifyContent: 'center' }}>
              <Image style={{ height: 10 }} resizeMode='contain'
                source={require('../img/safety.png')} />
              {str == "" || str == null ? null :
                num.test(str) && letter.test(str) && str.length > 6 ? <Image style={{ height: 10, position: "absolute", left: 0 }} resizeMode='contain'
                  source={require('../img/safety3.png')} /> :
                  <Image style={{ height: 10, position: "absolute", left: 0 }} resizeMode='contain'
                    source={require('../img/safety2.png')} />
              }

            </View>
          </View>
          <View style={[styles.row, { marginTop: 15 }]}>
            <Text>确定新密码：</Text>
            <TextInput style={styles.input} placeholderTextColor="rgb(219,219,219)"
              secureTextEntry={true}
              placeholder='请确认密码'
              onChangeText={(text) => this.setState({ sureNewPassword: text })} />
          </View>
          <Text style={[font.font15NoBoldRed, { marginTop: 10 }]}>{this.state.warn}</Text>
          <TouchableOpacity style={{ width: 150 }}
            onPress={() => this.updatePassWord()}>
            <View style={styles.button}>
              <Text style={font.font20}>确定</Text>
            </View>
          </TouchableOpacity>

        </View>
        <Loading ref={r => { this.Loading = r }} hide={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    position: 'absolute',
    top: 0,
    zIndex: 999,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  bodyView: {
    width: 400,
    height: 350,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(13,192,217)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  close: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 15,
    right: 15
  },
  input: {
    borderRadius: 3,
    width: 150,
    height: 25,
    fontSize: 11,
    margin: 0,
    padding: 0,
  },
  button: {
    width: 150,
    height: 25,
    backgroundColor: 'rgb(13,192,217)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 25,
  },
});

module.exports = PasswordView;
