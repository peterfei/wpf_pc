import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, TextInput, DeviceEventEmitter
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CountDownButton from "../Public/countDownButton"


//个人中心修改手机

class PhoneNumberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step1: true,
      step2: false,
      step3: false,
      oldPhoneNumber:'',
      oldCode:'',
      newPhoneNumber:'',
      newCode:'',
    };
  }
  render() {
    return (
      <View style={styles.topView}>
        <View style={styles.bodyView}>
          <View style={styles.title}>
            <Text style={font.font20}>修改绑定手机号码</Text>
            <TouchableHighlight style={styles.close}
              onPress={() => this.close()}>
              <Image style={{ width: '100%', height: '100%' }}
                source={require('../../img/close.png')} />
            </TouchableHighlight>
          </View>

          {this.step()}


        </View>
      </View>

    );
  }
  step() {
    if (this.state.step3) {
      return (
        this.step3View()
      )
    } else if (this.state.step2) {
      return (
        this.step2View()
      )
    } else {
      return (
        this.step1View()
      )
    }
  }
  step1View() {
    return (
      <View style={{ alignItems: 'center', width: '100%', height: '100%' }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blue.png')} />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldGray2, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/gray.png')} />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldGray2}>绑定手机号</Text>
          </View>
          <Text style={[font.font18NoBoldGray2, styles.line, { marginRight: 10 }]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/grayRight.png')} />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>为了保护账号安全，请先完成身份验证</Text>

        <View>
          <View style={[styles.row, { marginTop: 30 }]}>
            <Text>手机号：</Text>
            <TextInput style={styles.input} placeholderTextColor="rgb(219,219,219)"
              placeholder='请输入手机号码'
              onChangeText={(text) => this.setState({ oldPhoneNumber: text })} />
          </View>
          <View style={[styles.row, { marginTop: 25 }]}>
            <Text>验证码：</Text>
            <TextInput style={[styles.input, { width: 80 }]} placeholderTextColor="rgb(219,219,219)"
              placeholder='请输入验证码'
              onChangeText={(text) => this.setState({ oldCode: text })} />
            <CountDownButton
              enable={true}
              style={{ height: 20, width: 100, }}
              textStyle={{ color: '#0094e1' }}
              timerCount={60}
              timerTitle={'获取验证码'}
              timerActiveTitle={['请在（', 's）后重试']}
              onClick={(shouldStartCountting) => {
                // shouldStartCountting是一个回调函数，根据调用接口的情况在适当的时候调用它来决定是否开始倒计时
                //随机模拟发送验证码成功或失败
                // const requestSucc = Math.random() + 0.5 > 1;
                // shouldStartCounting(requestSucc)
                //this.shouldStartCountdown(shouldStartCountting);
                this.stepNext()
              }}
            />
          </View>
        </View>
        <TouchableHighlight style={{ width: 150 }}
          onPress={() => this.stepNext()}>
          <View style={styles.button}>
            <Text style={font.font20}>确定</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  step2View() {
    return (
      <View style={{ alignItems: 'center', width: '100%', height: '100%' }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blue.png')} />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldBlue, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blue.png')} />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>绑定手机号</Text>
          </View>
          <Text style={[font.font18NoBoldGray2, styles.line, { marginRight: 10 }]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/grayRight.png')} />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>请输入您要绑定的手机号，绑定后可用该手机号登录</Text>

        <View>
          <View style={[styles.row, { marginTop: 30 }]}>
            <Text>手机号：</Text>
            <TextInput style={styles.input} placeholderTextColor="rgb(219,219,219)"
              placeholder='请输入手机号码'
              onChangeText={(text) => this.setState({ newPhoneNumber: text })} />
          </View>
          <View style={[styles.row, { marginTop: 25 }]}>
            <Text>验证码：</Text>
            <TextInput style={[styles.input, { width: 80 }]} placeholderTextColor="rgb(219,219,219)"
              placeholder='请输入验证码'
              onChangeText={(text) => this.setState({ newCode: text })} />
            <CountDownButton
              enable={true}
              style={{ height: 20, width: 100, }}
              textStyle={{ color: '#0094e1' }}
              timerCount={60}
              timerTitle={'获取验证码'}
              timerActiveTitle={['请在（', 's）后重试']}
              onClick={(shouldStartCountting) => {
                // shouldStartCountting是一个回调函数，根据调用接口的情况在适当的时候调用它来决定是否开始倒计时
                //随机模拟发送验证码成功或失败
                // const requestSucc = Math.random() + 0.5 > 1;
                // shouldStartCounting(requestSucc)
                //this.shouldStartCountdown(shouldStartCountting);
                this.stepNext()
              }}
            />
          </View>
        </View>
        <TouchableHighlight style={{ width: 150 }}
          onPress={() => this.stepNext()}>
          <View style={styles.button}>
            <Text style={font.font20}>确定</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  step3View() {
    return (
      <View style={{ alignItems: 'center', width: '100%', height: '100%' }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blue.png')} />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldBlue, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blue.png')} />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>绑定手机号</Text>
          </View>
          <Text style={[font.font18NoBoldBlue, styles.line, { marginRight: 10 }]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image style={styles.stepImg}
                source={require('../../img/blueRight.png')} />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>修改成功，新手机号码为：</Text>
        <Text style={{ color: 'rgb(230,140,43)', marginTop: 25 }}>12183249125</Text>
        <Text style={{ fontSize: 13, marginTop: 25 }}>手机号可登录维萨里所有软件应用</Text>
        <TouchableHighlight style={{ width: 150 }}
          onPress={() => this.close()}>
          <View style={styles.button}>
            <Text style={font.font20}>立即转跳</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  stepNext() {
    if (this.state.step2 == false) {
      this.setState({
        step1: false,
        step2: true,
      })
    } else {
      this.setState({
        step3: true,
      })
    }
  }
  close() {
    DeviceEventEmitter.emit("changephoneNumberView", { changephoneNumberView: false });
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
  step: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  stepBody: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepMain: {
    width: 30,
    height: 30,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepImg: {
    position: "absolute",
    width: '100%',
    height: '100%'
  },
  line: {
    paddingBottom: 20
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 3,
    width: 150,
    height: 25,
    fontSize: 15,
    margin: 0,
    padding: 0
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

module.exports = PhoneNumberView;
