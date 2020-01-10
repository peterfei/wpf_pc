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
  DeviceEventEmitter,
  NetInfo,
  NativeModules
} from "react-native";
import color from "../Person/color";
import { font } from "../Public";
import CountDownButton from "../Public/countDownButton";
import api from "../api";
import Loading from "../common/Loading";
//注册页面
export default class RegisterScreen extends Component {
  static navigationOptions = {
    title: "Register"
  };
  state = {
    warn: "",
    phoneNumber: "",
    securityCode: "", //验证码
    password: "",
    userName: "",
    imgURL: "", //接收接口返回的图形码
    uuid: "", //随机生成的数字,
    code: "", // 图形验证码
    MacAddress: "",
    isConn: true
  };
  async componentDidMount() {
    let MacAddress = await NativeModules.DeviceInfoG.GetCpuID();
    this.setState({
      MacAddress: MacAddress
    });
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
    let url = api.base_uri + "appCaptcha?uuid=" + guid;
    if (!this.checkImgExists(url)) {
      this.setState({
        isConn: false
      })
    }
    this.setState({
      imgURL: url,
      uuid: guid
    });
  }

  checkImgExists(imgUrl) {
    let imgObj = new Image()
    imgUrl.src = imgUrl
    //存在图片
    if (imgObj.fileSize > 0 || (imgObj.width > 0 && imgObj.height > 0)) {
      return true;
    } else {
      return false;
    }
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
      business: "anatomy"
    };
    //接口URL
    let url = api.base_uri + "pc/member/register";
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
          //alert(JSON.stringify(result))
          this.Loading.show(result.msg);
          this.setState({
            warn: ""
          });
          if (result.msg == "注册成功!") {
            this.timer = setTimeout(() => {
              this.Loading.close();
              this.change(this.state.phoneNumber);
            }, 1000);
          } else {
            this.timer = setTimeout(() => {
              this.Loading.close();
            }, 1000);
          }
        })
          .catch(err => {
            this.Loading.autoClose("请检查您的网络环境")
          })
    }
  }
  shouldStartCountdown = async shouldStartCountting => {
    if (this.state.phoneNumber == "") {
      this.setState({
        warn: "电话号码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else if (this.state.code == "") {
      this.setState({
        warn: "图形码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else {
      const url =
        api.base_uri +
        "v1/app/member/getCodeAndCheckCapt?tellAndEmail=" +
        this.state.phoneNumber +
        "&uuid=" +
        this.state.uuid +
        "&captchaCode=" +
        this.state.code +
        "&option=register";
      try {
        await fetch(url, {
          method: "get",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(resp => resp.json())
          .then(result => {
            if (result.code == 0) {
              this.Loading.show("验证码发送成功!");
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(true);
            } else {
              this.setUUID()
              this.Loading.show(
                result.msg == "图形验证码错误"
                  ? result.msg + ",可点击图形码更新"
                  : result.msg
              );
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(false);
            }
          });
      } catch (error) {
        this.Loading.autoClose('请检查您的网络环境！')
        this.setUUID()
        shouldStartCountting(false);
      }
    }
  };
  netInfo() {
    NetInfo.fetch().done((connectionInfo) => {
      if (connectionInfo === 'None') {
        this.Loading.autoClose('请检查您的网络环境！')
      }
    });
  }

  warnPhone(text) {
    this.setState({ phoneNumber: text });
    if (isNaN(this.state.phoneNumber)) {
      this.setState({
        warn: "请输入正确手机号!"
      });
    } else {
      this.setState({
        warn: ""
      });
    }
  }
  change(phoneNumber) {
    this.props.navigation.navigate("Login");
    DeviceEventEmitter.emit("LoginWinEmitter", {
      back: true,
      phoneNumber: phoneNumber
    });
  }
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
                onBlur={() => this.netInfo()}
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
                onBlur={() => this.netInfo()}
                placeholder="输入图形码"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => this.setState({ code: text })}
              />
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 30,
                  position: "absolute",
                  right: 10
                }}
                onPress={() => this.setUUID()}>
                <Image
                  source={{ uri: this.state.imgURL }}
                  style={{ width: 100, height: 30 }}
                />
              </TouchableOpacity>
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
                placeholder="密码"
                placeholderTextColor="rgb(78,78,78)"
                onChangeText={text => this.setState({ password: text })}
              />
            </ImageBackground>

            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={() => {
                this.register();
              }}>
              <ImageBackground
                style={styles.button}
                source={require("../img/loading/button.png")}>
                <Text style={font.font20}>注册</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.change()}>
              <Text style={{ color: "rgba(247, 57, 57, 1)" }}>
                已有账号，立即登录
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
        <Loading ref={r => { this.Loading = r }} hide={true} />
      </View>
    );
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
