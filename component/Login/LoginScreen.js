import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ImageBackground, TextInput, AsyncStorage, DeviceEventEmitter, NativeModules
} from "react-native";
import api from "../../screen/api"
import color from "../Person/color";
import { font } from "../Public";
import TestData from "../../LocalData/TestData.json"
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import _ from "lodash";
//登陆页面
export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Login',
  }
  state = {
    warn: '',
    userName: '',
    password: '',
    MacAddress: '',
    dataSource: [],
    weixinLogin: false,
    token: '',
    member:'',
  }
  async pcNormalLogin() {
    //接口发送参数
    let body = {
      tellAndEmail: this.state.userName,
      password: this.state.password,
      device_id: this.state.MacAddress,
      business: 'anatomy',
    }
    //接口URL
    let url = api.base_uri_test+"pc/member/pcNormalLogin"
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    }).then(resp => resp.json())
      .then(result => {
        // alert(JSON.stringify(result))
        if (result.msg == 'success') {
          this.setState({
            token: result.token,
            member:result.member
          }, () => this.loding())
        } else {
          this.setState({
            warn: '账号/密码错误，请重试！',
          })
        }
      })
  }
  async componentDidMount() {
    let MacAddress = await NativeModules.DeviceInfoG.GetFirstMacAddress();
    this.setState({
      dataSource: TestData,
      MacAddress: MacAddress,
    })
  }
  listeners = {
    update: DeviceEventEmitter.addListener(
      "LoginWinEmitter",
      ({ ...passedArgs }) => {
        let back = passedArgs.back;
        let login = passedArgs.login;
        if (back) {
          this.refs.TextInput1.setNativeProps({
            placeholder: '用户名/手机号'
          });
          this.refs.TextInput2.setNativeProps({
            placeholder: '密码'
          });
        }
      }
    ),

  };
  componentWillUnmount() {
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }
  async componentWillMount() {            //本地缓存账号自动登录
    let AESuserName = await storage.get("userName", "")
    let AESpassword = await storage.get("password", "")
    let AEStoken = await storage.get("token", "")
    if (AESuserName != -1 && AESpassword != -1 && AEStoken != -1) {
      this.props.navigation.navigate('Main');
      this.refs.TextInput1.setNativeProps({
        placeholder: ''
      });
      this.refs.TextInput2.setNativeProps({
        placeholder: ''
      });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../img/background.png')}>

          {this.Login()}

        </ImageBackground>
      </View>
    );
  }
  Login() {
    if (this.state.weixinLogin) {
      return (
        this.weixinLogin()
      )
    } else {
      return (
        this.userLogin()
      )
    }
  }
  userLogin() {
    return (
      <View style={styles.body}>

        <Text style={[font.font15NoBoldRed, { marginBottom: 15 }]}>
          {this.state.warn}
        </Text>

        <View style={styles.content}>
          <Image
            style={styles.icon}
            source={require('../../img/userName.png')} />
          <View style={styles.input}>
            <TextInput
              ref='TextInput1'
              style={[styles.textInput, font.font20NoBoldGray]}
              maxLength={11}
              placeholder='用户名/手机号' placeholderTextColor='rgb(78,78,78)'
              onChangeText={(text) => this.setState({ userName: text })}
            />
          </View>
        </View>
        <View style={styles.content}>
          <Image
            style={styles.icon}
            source={require('../../img/password.png')} />
          <View style={styles.input}>
            <TextInput
              ref='TextInput2'
              style={[styles.textInput, font.font20NoBoldGray]}
              secureTextEntry={true} maxLength={16}
              placeholder='密码' placeholderTextColor='rgb(78,78,78)'
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
        </View>

        <TouchableOpacity style={{ width: '25%' }}
          onPress={() => { this.pcNormalLogin() }} >
          <View style={styles.button}>
            <Text style={font.font20}>登陆</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.index}>
          <TouchableOpacity
            onPress={() => this.change1()}>
            <Text style={font.font18NoBoldGray}>忘记密码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.change2()}>
            <Text style={font.font18NoBoldRed}>立即注册</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginTop: 15 }}
          onPress={() => this.change3()}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../img/weixin.png')}
            />
            <Text style={font.font18NoBoldGray}>微信登陆</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  weixinLogin() {
    return (
      <View style={styles.body}>
        <Image
          resizeMode='contain'
          style={{ height: '40%' }}
          source={require('../../img/weixin.png')}
        />
        <TouchableOpacity style={{ marginTop: 15 }}
          onPress={() => this.change4()}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../../img/userName.png')}
            />
            <Text style={font.font18NoBoldGray}>账户登陆</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  change1() {
    this.props.navigation.navigate('Find');
    this.refs.TextInput1.setNativeProps({
      placeholder: ''
    });
    this.refs.TextInput2.setNativeProps({
      placeholder: ''
    })
  }
  change2() {
    this.props.navigation.navigate('Register');
    this.refs.TextInput1.setNativeProps({
      placeholder: ''
    });
    this.refs.TextInput2.setNativeProps({
      placeholder: ''
    })
  }
  change3() {
    this.setState({
      weixinLogin: true
    })
  }
  change4() {
    this.setState({
      weixinLogin: false
    })
  }
  loding() {
    let AESuserName = CryptoJS.AES.encrypt(this.state.userName, 'X2S1B5GS1F6G2X5D').toString();
    let AESpassword = CryptoJS.AES.encrypt(this.state.password, 'X2S1B5GS1F6G2X5D').toString();
    let AEStoken = CryptoJS.AES.encrypt(this.state.token, 'X2S1B5GS1F6G2X5D').toString();
    //console.log(this.state.token)
    storage.save("userName", "", AESuserName);
    storage.save("password", "", AESpassword);
    storage.save("token", "", AEStoken);
    storage.save("member", "", this.state.member);
    this.props.navigation.navigate('Main');
    this.setState({
      warn: '',
    });
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
  body: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    marginBottom: "20%",
    alignItems: 'center',
  },
  content: {
    paddingBottom: 15,
  },
  icon: {
    position: "absolute",
    left: 5,
    top: 5,
    width: 25,
    height: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgb(78,78,78)",
    borderRadius: 5,
    width: '25%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(78,78,78,0)',
    borderWidth: 0,
    padding: 0,
    marginTop: 5,
    paddingLeft: 35,
    width: '100%',
    height: 35,
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
  index: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%',
  },
});