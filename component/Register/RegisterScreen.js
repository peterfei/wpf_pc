import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ImageBackground, TextInput, DeviceEventEmitter, NativeModules
} from "react-native";
import color from "../Person/color";
import { font } from "../Public";
import CountDownButton from "../Public/countDownButton"
import api from "../../screen/api";
//注册页面
export default class RegisterScreen extends Component {
  static navigationOptions = {
    title: 'Register',
  }
  state = {
    warn: '',
    phoneNumber: '',
    securityCode: '', //验证码
    password: '',
    userName: '',
    imgURL: '', //接收接口返回的图形码
    uuid: '',//随机生成的数字,
    code: '',// 图形验证码
    MacAddress: ''
  }
  async componentDidMount() {
    let MacAddress = await NativeModules.DeviceInfoG.GetFirstMacAddress();
    this.setState({
      MacAddress: MacAddress,
    })
  }

  componentWillMount() {
    //在本地随机生成数字发送给接口 接口返回图片验证码
    this.setUUID();
  }
  setUUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
    }
    let url = api.base_uri_test +"appCaptcha?uuid=" + guid;
    this.setState({
      imgURL: url,
      uuid: guid
    })
  }

  async register() {

    //接口发送参数
    let body = {
      tellAndEmail: this.state.phoneNumber,
      password: this.state.password,
      passwordConfirm: this.state.password,
      mbRegSource: "pc",
      code: this.state.securityCode,
      deviceId: this.state.MacAddress,
      business: 'anatomy',
    }
    //接口URL
    let url = api.base_uri_test +"pc/member/register"
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
    if (this.state.phoneNumber == '') {
      this.setState({
        warn:'电话号码不能为空!'
      })
      shouldStartCountting(false)
      return;
    } else if (this.state.code == '') {
      alert("");
      this.setState({
        warn:'图形码不能为空!'
      })
      shouldStartCountting(false);
      return;
    } else {
      const url =
      api.base_uri_test +"v1/app/member/getCodeAndCheckCapt?tellAndEmail=" +
        this.state.phoneNumber + "&uuid=" + this.state.uuid + "&captchaCode=" + this.state.code + "&option=register";
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
                  }}
                />
              </View>

              <View style={[styles.input, color.borderBottom]}>
                <TextInput
                  style={[styles.textInput, font.font20NoBoldGray]}
                  maxLength={6}
                  placeholder='输入图形码' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={text => this.setState({ code: text })}
                />
                <Image source={{ uri: this.state.imgURL }} style={{ width: 100, height: 30, position: "absolute", right: 0 }} />
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
                  placeholder='密码' placeholderTextColor='rgb(78,78,78)'
                  onChangeText={(text) => this.setState({ password: text })}
                />
              </View>

              <TouchableOpacity style={{ width: '100%' }} onPress={() => {
                this.register()
              }}>
                <View style={styles.button}>
                  <Text style={font.font20}>注册</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.change()}>
                <Text style={font.font18NoBoldGray}>已有账号？登陆</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
  warnPhone(text) {
    this.setState({ phoneNumber: text });
    if (isNaN(this.state.phoneNumber)) {
      this.setState({
        warn: '请输入正确手机号!'
      })
    } else {
      this.setState({
        warn: ''
      })
    }
  }
  change() {
    this.props.navigation.navigate('Login');
    DeviceEventEmitter.emit("LoginWinEmitter", { back: true });
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