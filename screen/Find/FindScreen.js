import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  DeviceEventEmitter
} from "react-native";

import color from "../Person/color";
import { font } from "../Public";
import CountDownButton from "../Public/countDownButton";
import api from "../api";
import Loading from "../common/Loading";
//找回密码页面
export default class FindScreen extends Component {
  static navigationOptions = {
    title: "Find"
  };
  state = {
    userName: "",
    securityCode: "",
    password: "",
    passwordConfirm: "",
    name: "",
    warn: ""
  };
  async forgetPwd() {
    //接口发送参数
    let body = {
      tellAndEmail: this.state.userName,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      code: this.state.securityCode
    };
    //接口URL
    let url = api.base_uri + "pc/member/forgetPwd";
    if (this.state.password == "") {
      this.setState({
        warn: "密码不能为空!"
      });
      return;
    } else if (this.state.password.length < 6) {
      this.setState({
        warn: "请输入6-12位密码"
      });
      return;
    } else {
      await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
        .then(resp => resp.json())
        .then(result => {
          if (result.msg == "success") {
            this.Loading.show("密码修改成功");
            this.timer = setTimeout(() => {
              this.Loading.close();
            }, 1000);
          } else {
            this.Loading.show(result.msg);
            this.timer = setTimeout(() => {
              this.Loading.close();
            }, 1000);
          }
          this.setState({
            warn: ""
          });
        })
          .catch(err => {
            this.Loading.close()
          })
    }
  }
  shouldStartCountdown = async shouldStartCountting => {
    if (this.state.userName == "") {
      this.setState({
        warn: "电话号码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else {
      const url =
        api.base_uri +
        "v1/app/member/getCodeCheck?tellAndEmail=" +
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
            // alert('返回结果：' + JSON.stringify(result))
            if (result.code == 0) {
              console.log('返回正确结果')
              this.Loading.show("验证码发送成功!");
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 600);
              shouldStartCountting(true);
            } else {
              this.Loading.show(result.msg);
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(false);
            }
          });
      } catch (error) {
        this.Loading.autoClose('请检查您的网络环境！')
        shouldStartCountting(false);
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require("../img/loading/bg.png")}>
          <View style={styles.main}>
            <Image
              style={styles.logo}
              source={require("../img/loading/logo.png")}
            />

            <Text style={{ marginBottom: 15, color: "rgba(247, 57, 57, 1)" }}>
              {this.state.warn}
            </Text>

            <ImageBackground
              source={require("../img/loading/textInput2.png")}
              style={styles.content}
              imageStyle={{ resizeMode: "stretch" }}>
              <TextInput
                style={[styles.textInput, font.font20NoBoldGray]}
                maxLength={11}
                placeholder="手机号"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => {
                  this.warnPhone(text);
                }}
              />
            </ImageBackground>

            <ImageBackground
              source={require("../img/loading/textInput2.png")}
              style={styles.content}
              imageStyle={{ resizeMode: "stretch" }}>
              <TextInput
                style={[styles.textInput, font.font20NoBoldGray]}
                maxLength={6}
                placeholder="短信验证码"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => this.setState({ securityCode: text })}
              />
              <View style={{ position: "absolute", right: 0 }}>
                <CountDownButton
                  enable={true}
                  style={{ height: 30, width: 100 }}
                  textStyle={{ color: "#0094e1" }}
                  timerCount={60}
                  timerTitle={"获取验证码"}
                  timerActiveTitle={["请在（", "s）后重试"]}
                  onClick={shouldStartCountting => {
                    // shouldStartCountting是一个回调函数，根据调用接口的情况在适当的时候调用它来决定是否开始倒计时
                    //随机模拟发送验证码成功或失败
                    // const requestSucc = Math.random() + 0.5 > 1;
                    // shouldStartCounting(requestSucc)
                    this.shouldStartCountdown(shouldStartCountting);
                  }}
                />
              </View>
            </ImageBackground>

            <ImageBackground
              source={require("../img/loading/textInput2.png")}
              style={styles.content}
              imageStyle={{ resizeMode: "stretch" }}>
              <TextInput
                style={[styles.textInput, font.font20NoBoldGray]}
                maxLength={12}
                secureTextEntry={true}
                placeholder="新密码"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => this.setState({ password: text })}
              />
            </ImageBackground>
            <ImageBackground
              source={require("../img/loading/textInput2.png")}
              style={styles.content}
              imageStyle={{ resizeMode: "stretch" }}>
              <TextInput
                style={[styles.textInput, font.font20NoBoldGray]}
                maxLength={12}
                secureTextEntry={true}
                placeholder="确认新密码"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => this.setState({ passwordConfirm: text })}
              />
            </ImageBackground>

            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => {
                this.forgetPwd();
              }}>
              <ImageBackground
                style={styles.button}
                source={require("../img/loading/button.png")}>
                <Text style={font.font20}>确认修改</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.change()}>
              <Text style={{ color: "rgba(247, 57, 57, 1)" }}>
                已有找回？登录
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Loading
          ref={r => {
            this.Loading = r;
          }}
          hide={true}
        />
      </View>
    );
  }
  change() {
    this.props.navigation.navigate("Login");
    DeviceEventEmitter.emit("LoginWinEmitter", { back: true });
  }
  warnPhone(text) {
    this.setState({ userName: text });
    if (isNaN(text)) {
      this.setState({
        warn: "请输入正确手机号!"
      });
    } else {
      this.setState({
        warn: ""
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    height: 70,
    resizeMode: "contain",
    marginBottom: 25
  },
  main: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "33%",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 74, 0.1)",
    borderRadius: 5,
    padding: 30,
    paddingLeft: 80,
    paddingRight: 80,
    alignItems: "center"
  },
  body: {
    width: "100%",
    alignItems: "center"
  },
  content: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  textInput: {
    flex: 0.9,
    borderWidth: 0,
    padding: 0,
    marginTop: 8,
    height: 33,
    marginLeft: 50
  },
  securityCode: {
    position: "absolute",
    right: 0,
    top: 3
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  }
});
