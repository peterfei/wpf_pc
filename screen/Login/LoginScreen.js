import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ImageBackground, TextInput, AsyncStorage, DeviceEventEmitter, NativeModules
} from "react-native";
import api from "../api"
import color from "../Person/color";
import { font } from "../Public";
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
    weixinLogin: false,
  }
  async pcNormalLogin() {
    if(this.state.userName==''||this.state.password==''){
      this.setState({
        warn: '账号或密码不能为空！'
      })
      return
    }
    this.setState({
      warn: '登陆中……'
    })
    let MacAddress = await NativeModules.DeviceInfoG.GetFirstMacAddress();
    //接口发送参数
    let body = {
      tellAndEmail: this.state.userName,
      password: this.state.password,
      device_id: MacAddress,
      business: 'pc',
    }
    //接口URL
    let url = api.base_uri + "pc/member/pcNormalLogin"
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
            warn: ''
          }, () => this.loding(result.token, result.member))
        } else {
          this.setState({
            warn: result.msg
          })
        }
      })
  }
  listeners = {
    update: DeviceEventEmitter.addListener(
      "LoginWinEmitter",
      ({ ...passedArgs }) => {
        let back = passedArgs.back;
        let phoneNumber =passedArgs.phoneNumber;
        if (back) {
          this.refs.TextInput1.setNativeProps({
            placeholder: '用户名/手机号'
          });
          this.refs.TextInput2.setNativeProps({
            placeholder: '密码'
          });
        }
        if(phoneNumber){
          this.setState({
            userName:phoneNumber
          })
          this.refs.TextInput1.setNativeProps({
            text:phoneNumber
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
    let userName = await storage.get("userName", "")
    let AESpassword = await storage.get("password", "")
    let token = await storage.get("token", "")
    if (userName != '' && AESpassword != -1 && token != '') {
      this.props.navigation.navigate('Home');
      this.refs.TextInput1.setNativeProps({
        placeholder: ''
      });
      this.refs.TextInput2.setNativeProps({
        placeholder: ''
      });
    }
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

        <Image style={styles.logo}
          source={require('../img/loading/logo.png')} />

        <Text style={{ marginBottom: 15, color: 'rgba(247, 57, 57, 1)' }}>
          {this.state.warn}
        </Text>

        <ImageBackground
          source={require('../img/loading/textInput1.png')}
          style={styles.content}
          imageStyle={{ resizeMode: 'stretch' }}
        >
          <Image
            style={styles.icon}
            source={require('../img/loading/user.png')} />
          <TextInput
            ref='TextInput1'
            style={[styles.textInput, font.font20NoBoldGray]}
            maxLength={11}
            placeholder='用户名/手机号' placeholderTextColor='rgb(78,78,78)'
            onChangeText={(text) => this.setState({ userName: text })}
          />
        </ImageBackground>

        <ImageBackground
          source={require('../img/loading/textInput2.png')}
          style={styles.content}
          imageStyle={{ resizeMode: 'stretch' }}
        >
          <Image
            style={styles.icon}
            source={require('../img/loading/passWord.png')} />
          <TextInput
            ref='TextInput2'
            style={[styles.textInput, font.font20NoBoldGray]}
            secureTextEntry={true}
            placeholder='密码' placeholderTextColor='rgb(78,78,78)'
            onChangeText={(text) => this.setState({ password: text })}
          />
        </ImageBackground>

        <TouchableOpacity style={{ width: '100%' }}
          onPress={() => { this.pcNormalLogin() }} >
          <ImageBackground style={styles.button}
           source={require('../img/loading/button.png')} >
            <Text style={font.font20}>登陆</Text>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.index}>
          <TouchableOpacity
            onPress={() => this.change1()}>
            <Text style={font.font18NoBoldGray}>忘记密码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.change2()}>
            <Text style={{ color: 'rgba(247, 57, 57, 1)' }}>立即注册</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity style={{ marginTop: 15 }}
          onPress={() => this.change3()}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../img/weixin.png')}
            />
            <Text style={font.font18NoBoldGray}>微信登陆</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    )
  }
  weixinLogin() {
    return (
      <View style={styles.body}>
        <Image
          resizeMode='contain'
          style={{ height: '40%' }}
          source={require('../img/weixin.png')}
        />
        <TouchableOpacity style={{ marginTop: 15 }}
          onPress={() => this.change4()}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../img/userName.png')}
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
  loding(token, member) {
    let AESpassword = CryptoJS.AES.encrypt(this.state.password, 'CB3EC842D7C69578').toString();
    storage.save("userName", "", this.state.userName);
    storage.save("password", "", AESpassword);
    storage.save("token", "", token);
    storage.save("member", "", member);
    this.props.navigation.navigate('Home');
    this.setState({
      warn: '',
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../img/loading/bg.png')}>
          <View style={styles.main}>
            {this.Login()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgb(16,16,16)"
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '33%',
    borderWidth: 1,
    borderColor: "rgba(255, 210, 74, 0.1)",
    borderRadius: 5,
    padding: 30,
    paddingLeft: 80,
    paddingRight: 80
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
    marginBottom: 25
  },
  content: {
    width: '100%', 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  icon: {
    marginLeft: 25,
    marginRight: 15,
    width: 15,
    height: 15,
  },
  textInput: {
    flex: 0.9,
    borderWidth: 0,
    padding: 0,
    marginTop: 8,
    height: 33,
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  index: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});