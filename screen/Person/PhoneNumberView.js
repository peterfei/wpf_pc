import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CountDownButton from "../Public/countDownButton";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import Loading from "../common/Loading";
//个人中心修改手机

class PhoneNumberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyPerson: true,
      bindingPhone: false,
      finish: false,
      oldPhoneNumber: "",
      oldCode: "",
      newPhoneNumber: "",
      newCode: "",
      imgCode: "",
      imgURL: "",
      uuid: "",
      warn: ""
    };
  }
  async componentDidMount() {
    this.setUUID();
    let userName = await storage.get("userName", "");
    this.setState({
      oldPhoneNumber: userName
    });
  }
  // componentWillMount() {
  //   this.setUUID();
  // }
  setUUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
    }
    let url = api.base_uri + "appCaptcha?uuid=" + guid;
    this.setState({
      imgURL: url,
      uuid: guid
    });
  }
  shouldStartCountdown = async shouldStartCountting => {
    let userName = this.state.oldPhoneNumber;
    if (userName == "") {
      this.setState({
        warn: "电话号码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else {
      const url =
        api.base_uri + "v1/app/member/getCodeCheck?tellAndEmail=" + userName;
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
              this.setUUID();
              this.Loading.show(result.msg);
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(false);
            }
          });
      } catch (error) {
        shouldStartCountting(false);
        this.setUUID();
      }
    }
  };
  bingdingShouldStartCountdown = async shouldStartCountting => {
    let userName = this.state.newPhoneNumber;
    let uuid = this.state.uuid;
    let code = this.state.imgCode;
    if (userName == "") {
      this.setState({
        warn: "电话号码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else if (code == "") {
      this.setState({
        warn: "图形码不能为空!"
      });
      shouldStartCountting(false);
      return;
    } else {
      const url =
        api.base_uri +
        "v1/app/member/getCodeAndCheckCapt?tellAndEmail=" +
        userName +
        "&uuid=" +
        uuid +
        "&captchaCode=" +
        code +
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
            //alert(JSON.stringify(result))
            if (result.code == 0) {
              this.Loading.show("验证码发送成功!");
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(true);
            } else {
              this.setUUID()
              this.Loading.show(result.msg);
              this.timer = setTimeout(() => {
                this.Loading.close();
              }, 1000);
              shouldStartCountting(false);
            }
          });
      } catch (error) {
        this.setUUID()
        shouldStartCountting(false);
      }
    }
  };
  async checkCode() {
    let token = await storage.get("token", "");
    // let body = {
    //   tell: this.state.oldPhoneNumber,
    //   code: this.state.oldCode,
    //   token: token,
    // }
    //接口URL
    let url =
      api.base_uri +
      "pc/member/checkCode?tell=" +
      this.state.oldPhoneNumber +
      "&code=" +
      this.state.oldCode +
      "&token=" +
      token;
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
      //body: JSON.stringify(body)
    })
      .then(resp => resp.json())
      .then(result => {
        //alert('短信验证' + JSON.stringify(result))
        if (result.result == "true") {
          this.Loading.show("验证码正确");
          this.timer = setTimeout(() => {
            this.Loading.close();
          }, 1000);
          this.setState({
            verifyPerson: false,
            bindingPhone: true
          });
        } else {
          this.setUUID()
          this.Loading.show("验证码错误");
          this.timer = setTimeout(() => {
            this.Loading.close();
          }, 1000);
        }
      });
  }
  async changeTellNumber() {
    let token = await storage.get("token", "");
    // let body = {
    //   token: token,
    //   newTell: this.state.newPhoneNumber,
    //   oldTell: this.state.oldPhoneNumber,
    //   code: this.state.newCode,
    // }
    //接口URL
    let url =
      api.base_uri +
      "pc/member/changeTellNumber?code=" +
      this.state.newCode +
      "&newTell=" +
      this.state.newPhoneNumber +
      "&oldTell=" +
      this.state.oldPhoneNumber +
      "&token=" +
      token;
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => resp.json())
      .then(result => {
        //alert(result.msg)
        if (result.msg == "success") {
          this.setState({
            finish: true
          });
          storage.remove("userName");
          storage.save("userName", "", this.state.newPhoneNumber);
          this.Loading.show("修改成功");
          this.timer = setTimeout(() => {
            this.Loading.close();
          }, 1000);
        } else {
          this.Loading.show("修改失败");
          this.timer = setTimeout(() => {
            this.Loading.close();
          }, 1000);
        }
      });
  }
  render() {
    return (
      <View style={styles.topView}>
        <View style={styles.bodyView}>
          <View style={styles.title}>
            <Text style={font.font20}>修改绑定手机号码</Text>
            <TouchableOpacity style={styles.close} onPress={() => this.close()}>
              <Image
                style={{ width: "100%", height: "100%" }}
                source={require("../img/close.png")}
              />
            </TouchableOpacity>
          </View>

          {this.step()}
        </View>
        <Loading
          ref={r => {
            this.Loading = r;
          }}
          hide={true}
        />
      </View>
    );
  }
  step() {
    if (this.state.finish) {
      return this.finishScreen();
    } else if (this.state.bindingPhone) {
      return this.bindingPhoneScreen();
    } else {
      return this.verifyPersonScreen();
    }
  }
  verifyPersonScreen() {
    return (
      <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blue.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldGray2, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/gray.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldGray2}>绑定手机号</Text>
          </View>
          <Text
            style={[font.font18NoBoldGray2, styles.line, { marginRight: 10 }]}>
            -----------
          </Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/grayRight.png")}
              />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>
          为了保护账号安全，请先完成身份验证
        </Text>

        <View>
          <View style={[styles.row, { marginTop: 30 }]}>
            <Text>手机号：</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgb(219,219,219)"
              value={this.state.oldPhoneNumber}
              editable={false}
            />
          </View>
          <View style={[styles.row, { marginTop: 25 }]}>
            <Text>验证码：</Text>
            <TextInput
              style={[styles.input, { width: 80 }]}
              placeholderTextColor="rgb(219,219,219)"
              placeholder="请输入验证码"
              onChangeText={text => this.setState({ oldCode: text })}
            />
            <CountDownButton
              enable={true}
              style={{ height: 20, width: 100 }}
              textStyle={{ fontSize: 14, color: "#0094e1" }}
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
        </View>
        <TouchableOpacity
          style={{ width: 150 }}
          onPress={() =>
            this.stepNext(this.state.oldPhoneNumber, this.state.oldCode)
          }>
          <View style={styles.button}>
            <Text style={font.font20}>确定</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  bindingPhoneScreen() {
    return (
      <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blue.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldBlue, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blue.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>绑定手机号</Text>
          </View>
          <Text
            style={[font.font18NoBoldGray2, styles.line, { marginRight: 10 }]}>
            -----------
          </Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/grayRight.png")}
              />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 25 }}>
          请输入您要绑定的手机号，绑定后可用该手机号登录
        </Text>

        <View>
          <View style={[styles.row, { marginTop: 20 }]}>
            <Text>手机号：</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgb(219,219,219)"
              placeholder="请输入手机号码"
              editable={true}
              onChangeText={text => this.setState({ newPhoneNumber: text })}
            />
          </View>
          <View style={[styles.row, { marginTop: 16 }]}>
            <TextInput
              style={[styles.input, { width: 140 }]}
              placeholderTextColor="rgb(219,219,219)"
              placeholder="输入图形验证码"
              maxLength={6}
              onChangeText={text => this.setState({ imgCode: text })}
            />
            <Image
                source={{ uri: this.state.imgURL }}
                style={{ width: 80, height: 25, marginLeft: 10 }}
            />
          </View>
          <View style={[styles.row, { marginTop: 16 }]}>
            <Text>验证码：</Text>
            <TextInput
              style={[styles.input, { width: 80 }]}
              placeholderTextColor="rgb(219,219,219)"
              placeholder="请输入验证码"
              defaultValue=""
              onChangeText={text => this.setState({ newCode: text })}
            />
            <CountDownButton
              enable={true}
              style={{ height: 20, width: 100 }}
              textStyle={{ fontSize: 14, color: "#0094e1" }}
              timerCount={60}
              timerTitle={"获取验证码"}
              timerActiveTitle={["请在（", "s）后重试"]}
              onClick={shouldStartCountting => {
                // shouldStartCountting是一个回调函数，根据调用接口的情况在适当的时候调用它来决定是否开始倒计时
                //随机模拟发送验证码成功或失败
                // const requestSucc = Math.random() + 0.5 > 1;
                // shouldStartCounting(requestSucc)
                this.bingdingShouldStartCountdown(shouldStartCountting);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{ width: 150 }}
          onPress={() =>
            this.stepNext(this.state.newPhoneNumber, this.state.newCode)
          }>
          <View style={[styles.button, { marginTop: 20 }]}>
            <Text style={font.font20}>更换</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  finishScreen() {
    return (
      <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
        <View style={styles.step}>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blue.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>1</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>验证身份</Text>
          </View>
          <Text style={[font.font18NoBoldBlue, styles.line]}>-----------</Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blue.png")}
              />
              <Text style={[styles.stepTitle, font.font18]}>2</Text>
            </View>
            <Text style={font.font18NoBoldBlue}>绑定手机号</Text>
          </View>
          <Text
            style={[font.font18NoBoldBlue, styles.line, { marginRight: 10 }]}>
            -----------
          </Text>
          <View style={styles.stepBody}>
            <View style={styles.stepMain}>
              <Image
                style={styles.stepImg}
                source={require("../img/blueRight.png")}
              />
            </View>
            <Text style={font.font18NoBoldGray2}>完成</Text>
          </View>
        </View>

        <Text style={{ marginTop: 30 }}>修改成功，新手机号码为：</Text>
        <Text style={{ color: "rgb(230,140,43)", marginTop: 25 }}>
          {this.state.newPhoneNumber}
        </Text>
        <Text style={{ fontSize: 13, marginTop: 25 }}>
          手机号可登录维萨里所有软件应用
        </Text>
        <TouchableOpacity style={{ width: 150 }} onPress={() => this.close()}>
          <View style={styles.button}>
            <Text style={font.font20}>立即转跳</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  stepNext(PhoneNumber, Code) {
    if (PhoneNumber == "" || Code == "") {
      this.Loading.show("手机号/验证码不能为空");
      this.timer = setTimeout(() => {
        this.Loading.close();
      }, 1000);
      return;
    }
    if (this.state.bindingPhone == false) {
      this.checkCode();
    } else {
      this.changeTellNumber();
    }
  }
  close() {
    DeviceEventEmitter.emit("changephoneNumberView", {
      changephoneNumberView: false
    });
  }
}

const styles = StyleSheet.create({
  topView: {
    position: "absolute",
    top: 0,
    zIndex: 999,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  bodyView: {
    width: 400,
    height: 350,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    width: "100%",
    height: 50,
    backgroundColor: "rgb(13,192,217)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  close: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 15,
    right: 15
  },
  step: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  stepBody: {
    justifyContent: "center",
    alignItems: "center"
  },
  stepMain: {
    width: 30,
    height: 30,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  stepImg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  line: {
    paddingBottom: 20
  },
  input: {
    borderRadius: 3,
    width: 170,
    height: 25,
    fontSize: 15,
    margin: 0,
    padding: 0
  },
  button: {
    width: 150,
    height: 25,
    backgroundColor: "rgb(13,192,217)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 25
  }
});

module.exports = PhoneNumberView;
