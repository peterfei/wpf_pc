import React, { PureComponent, Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Alert,
  ImageBackground,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  TextInput,
  Text,
  Dimensions
} from "react-native";
import { storage } from "../common/storage";

import { screen, system } from "../common";
import api from "../api";
import {
  StackNavigator,
  TabNavigator,
  TabBarTop,
  createStackNavigator,
  TabBarBottom,
  NavigationActions
} from "react-navigation";
import { NativeModules } from "react-native";
import { RadioButtons } from "react-native-radio-buttons";
class LoginForm extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      msg: "请输入账号和密码"
    };
  }

  componentWillReceiveProps(nextProps) {}
  async componentWillMount() {
    // alert(111);
    // console.log("11" + _reactNativeDeviceInfo2.default);
    // let macAddress = await DeviceInfo.getMACAddress();
    // debugger;
    // debugger;
    // alert("uuid is " + DeviceInfo.getUniqueID());
    // debugger;
    // alert(Dimensions.get("window").height);
    // let tokens = await storage.get("userTokens", "");
    // // debugger;
    // if (tokens == -1 || tokens == -2) {
    //   return false;
    // } else {
    //   this.props.navigation.push("Tab");
    //   // const resetAction = NavigationActions.reset({
    //   //   index: 0,
    //   //   actions: [
    //   //     NavigationActions.navigate({
    //   //       routeName: "Tab"
    //   //     })
    //   //   ]
    //   // });
    //   // this.props.navigation.dispatch(resetAction);
    //   // return;
    // }
  }
  msg(msg) {
    let curr = this;
    this.setState({
      msg: msg
    });
    setTimeout(function() {
      curr.setState({
        msg: ""
      });
    }, 3000);
  }

  onButtonPress = async () => {
    if (this.state.username == "" || this.state.password == "") {
      this.msg("请输入账号和密码!");
      return;
    }
    let deviceInfo = await NativeModules.DeviceInfoG;
    let mac_addr = await deviceInfo.GetFirstMacAddress();

    const url = api.base_uri + "/v1/app/member/pcLogin";
    // debugger;
    try {
      let responseData = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tellAndEmail: this.state.username,
          password: this.state.password,
          device_id: mac_addr
        })
      })
        .then(resp => resp.json())
        .then(
          result => {
            //   debugger;
            if (result.code == 0) {
              // debugger;
              storage.save("userTokens", "", result);
              // console.log(result);

              this.msg("登录成功!");
              this.props.navigation.navigate("Tab");
            } else {
              this.msg(result.msg);
            }
          },
          err => {
            this.msg(result.msg);
          }
        );
    } catch (error) {
      console.log(error);
      this.msg("账号或密码错误!");
    }
  };

  render() {
    // const options = ["学生登录", "教工登录"];
    // function setSelectedOption(selectedOption) {
    //   this.setState({
    //     selectedOption
    //   });
    // }
    // function renderOption(option, selected, onSelect, index) {
    //   const style = selected ? { fontWeight: "500" } : {};
    //   return (
    //     <TouchableOpacity onPress={onSelect} key={index}>
    //       <Text style={style}>{option}</Text>
    //     </TouchableOpacity>
    //   );
    // }
    // function renderContainer(optionNodes) {
    //   return <View>{optionNodes}</View>;
    // }
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.imgStyle}
          source={require("../img/login/pc_bg.jpg")}>
          <View>
            <View style={styles.textInputViewStyle}>
              <TextInput
                autoFocus={true}
                style={styles.textInputStyle}
                placeholder=""
                onChangeText={text =>
                  this.setState({
                    username: text
                  })
                }
              />
            </View>
            <View style={styles.textInputViewStyle}>
              <TextInput
                style={styles.textInputStyle}
                placeholder=""
                secureTextEntry
                onChangeText={password =>
                  this.setState({
                    password: password
                  })
                }
              />
            </View>
            {/* <RadioButtons
              options={options}
              onSelection={setSelectedOption.bind(this)}
              selectedOption={this.state.selectedOption}
              renderOption={renderOption}
              renderContainer={renderContainer}
            /> */}
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
              <View style={styles.textLoginViewStyle}>
                <Text style={styles.textLoginStyle}>登录</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ color: "#ff440b", marginTop: 10 }}>
              {this.state.msg}
            </Text>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    height: 40,
    backgroundColor: "rgba(225,225,225,0.2)",
    marginBottom: 10,
    padding: 10,
    color: "#fff"
  },
  buttonContainer: {
    backgroundColor: "#2980b6",
    paddingVertical: 15
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  },
  loginButton: {
    backgroundColor: "#2980b6",
    color: "#fff"
  },
  buttonGroups: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screen.width / 2
  },

  imgStyle: {
    // paddingTop: 10,
    width: screen.width != 0 ? screen.width : 1920,
    height: screen.height != 0 ? screen.height : 1020,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  }, //包裹输入框View样式
  textInputViewStyle: {
    //设置宽度减去30将其居中左右便有15的距离
    width: screen.width != 0 ? screen.width - 40 : 1860,
    // height: 50,
    borderRadius: 10,
    //设置边框的宽度
    borderWidth: 0,
    //内边距
    paddingLeft: 10,
    paddingRight: 10,
    //外边距
    // marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    //设置相对父控件居中
    alignSelf: "center"
  }, //输入框样式
  textInputStyle: {
    fontSize: 16,
    width: screen.width != 0 ? screen.width * 0.2 : 1920 * 0.2,
    height: 40,
    lineHeight: 80,
    paddingLeft: 8,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#dadada",
    // alignSelf: 'center',
    //根据不同平台进行适配
    marginTop: 8
  }, //登录按钮View样式
  textLoginViewStyle: {
    width: screen.width != 0 ? screen.width * 0.2 : 1920 * 0.2,
    height: 40,
    backgroundColor: "#2980b6",
    borderRadius: 20,
    marginTop: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  //登录Text文本样式
  textLoginStyle: {
    fontSize: 18,
    color: "white"
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20
  },
  f1: {
    flex: 2,
    marginLeft: 20,
    fontSize: 16
  },
  f2: {
    flex: 4,
    fontSize: 16
  },
  f3: {
    fontSize: 16,
    flex: 2,
    marginRight: 20
  }
});

//make this component available to the app
export default LoginForm;
