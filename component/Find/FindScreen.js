import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, ImageBackground, TextInput, DeviceEventEmitter
} from "react-native";

import color from "../Person/color";
import { font } from "../Public";
import CountDownButton from "../Public/countDownButton"

//找回密码页面
export default class FindScreen extends Component {
  static navigationOptions = {
    title: 'Find',
  }
  state = {
    userName: '',
    securityCode: '',
    password: '',
    passwordConfirm: '',
    name: '',
    warn: '',
  }
  async forgetPwd() {
    //接口发送参数
    let body = {
      tellAndEmail: this.state.userName,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      code: this.state.securityCode,
    }
    //接口URL
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/member/forgetPwd"
    if (this.state.password == '') {
      this.setState({
        warn:'密码不能为空!'
      })
      return;
    } else {
      await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }).then(resp => resp.json())
        .then(result => {
          alert(JSON.stringify(result))
        })
    }
  }
  shouldStartCountdown = async (shouldStartCountting) => {
    if (this.state.userName == '') {
      this.setState({
        warn:'电话号码不能为空!'
      })
      shouldStartCountting(false)
      return;
    } else {
      const url =
        "http://118.24.119.234:8087/vesal-jiepao-test/v1/app/member/getCodeCheck?tellAndEmail=" +
        this.state.userName;
      try {
        await fetch(url, {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(resp => resp.json())
          .then(result => {
            alert(JSON.stringify(result))
            if (result.code == 0) {
              alert("验证码发送成功!");
              shouldStartCountting(true)
            } else {
              alert(result.msg);
              shouldStartCountting(false)
            }
          });
      } catch (error) {
        shouldStartCountting(false)
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../img/background.png')}>
          <View style={styles.main}>
            <View style={[styles.body, color.border]}>
              <View style={{ position: "absolute", top: -20 }}>
                <Text style={font.font15NoBoldRed}>{this.state.warn}</Text>
              </View>
              <View style={[styles.input, color.borderBottom]}>
                <TextInput
                  style={[styles.textInput, font.font20NoBoldGray]}
                  maxLength={11}
                  placeholder='手机号' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={(text) => {
                    this.warnPhone(text)
                  }
                  }
                />
              </View>
              <View style={[styles.input, color.borderBottom]}>
                <TextInput
                  style={[styles.textInput, font.font20NoBoldGray]}
                  maxLength={6}
                  placeholder='短信验证码' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={(text) => this.setState({ securityCode: text })}
                />
                <View style={{ position: "absolute", right: 0 }}>
                  <CountDownButton
                    enable={true}
                    style={{ height: 30, width: 100, }}
                    textStyle={{ color: '#0094e1' }}
                    timerCount={60}
                    timerTitle={'获取验证码'}
                    timerActiveTitle={['请在（', 's）后重试']}
                    onClick={(shouldStartCountting) => {
                      // shouldStartCountting是一个回调函数，根据调用接口的情况在适当的时候调用它来决定是否开始倒计时
                      //随机模拟发送验证码成功或失败
                      // const requestSucc = Math.random() + 0.5 > 1;
                      // shouldStartCounting(requestSucc)
                      this.shouldStartCountdown(shouldStartCountting);
                    }} />
                </View>
              </View>
              <View style={[styles.input, color.borderBottom]}>
                <TextInput
                  style={[styles.textInput, font.font20NoBoldGray]}
                  maxLength={16} secureTextEntry={true}
                  placeholder='新密码' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={(text) => this.setState({ password: text })}
                />
              </View>
              <View style={[styles.input, color.borderBottom]}>
                <TextInput
                  style={[styles.textInput, font.font20NoBoldGray]}
                  maxLength={16} secureTextEntry={true}
                  placeholder='确认新密码' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={(text) => this.setState({ passwordConfirm: text })}
                />
              </View>

              <TouchableHighlight style={{ width: '100%' }}
                onPress={() => this.forgetPwd()}>
                <View style={styles.button}>
                  <Text style={font.font20}>找回</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => this.change()}>
                <Text style={font.font18NoBoldGray}>已有找回？登陆</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
  change() {
    this.props.navigation.navigate('Login');
    DeviceEventEmitter.emit("LoginWinEmitter", { back: true });
  }
  warnPhone(text) {
    this.setState({ userName: text })
    if (isNaN(text)) {
      this.setState({
        warn: '请输入正确手机号!'
      })
    } else {
      this.setState({
        warn: ''
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  main: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    marginBottom: "10%",
    alignItems: 'center',
  },
  body: {
    width: '30%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: '3%',
  },
  input: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: 'rgba(78,78,78,0)',
    borderWidth: 0,
    paddingLeft: 0,
    margin: 0,
    marginTop: 5,
    width: '100%',
    height: 35,
  },
  securityCode: {
    position: "absolute",
    right: 0,
    top: 3,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgb(13,192,217)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },

});