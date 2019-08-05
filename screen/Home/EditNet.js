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
class EditNet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      msg: ""
    };
  }

  componentWillReceiveProps(nextProps) {}
  async componentWillMount() {}
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
    // alert(`selectedOption is ${this.state.selectedOption}`);
    if (this.state.ip_address == "") {
      // if (this.state.username == "" || this.state.password == "") {
      this.msg("请输入服务端地址");
      return;
    }
    if (this.state.selectedOption == undefined) {
      // if (this.state.username == "" || this.state.password == "") {
      this.msg("请选择角色");
      return;
    }
    let deviceInfo = await NativeModules.DeviceInfoG;
    let ip_addr_result = await deviceInfo.WriteLocalFileWithIpAddress({
      ip_address: this.state.ip_address,
      role: this.state.selectedOption == "教师" ? "server" : "client"
    });
    let _content = Object.assign(
      {},
      {
        app_type: "web_socket"
      }
    );
    // NativeModules.MyDialogModel.SendMessageToUnity(JSON.stringify(_content));
    // alert("==StopUnity==");
    NativeModules.MyDialogModel.restartUnity();
    // alert("==StopUnity==");
    NativeModules.MyDialogModel.testMethod();
    NativeModules.MyDialogModel.hide();
    this.msg(ip_addr_result);
  };

  render() {
    const options = ["教师", "学生"];
    function setSelectedOption(selectedOption) {
      this.setState({
        selectedOption
      });
    }
    function renderOption(option, selected, onSelect, index) {
      const style = selected ? { fontWeight: "500" } : {};
      return (
        <TouchableOpacity
          onPress={onSelect}
          key={index}
          style={{ border: 1, marginLeft: 5 }}>
          <Text style={[style, { border: 1, borderWidth: 1 }]}>{option}</Text>
        </TouchableOpacity>
      );
    }
    function renderContainer(optionNodes) {
      return (
        <View
          style={{
            marginTop: 30,
            // alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignSelf: "center"
          }}>
          <Text>请选择角色:</Text>
          {optionNodes}
        </View>
      );
    }
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
                placeholder="输入服务端地址"
                onChangeText={text =>
                  this.setState({
                    ip_address: text
                  })
                }
              />
            </View>
            <View style={styles.textInputViewStyle}>
              <RadioButtons
                options={options}
                onSelection={setSelectedOption.bind(this)}
                selectedOption={this.state.selectedOption}
                renderOption={renderOption}
                renderContainer={renderContainer}
              />
            </View>
            <TouchableOpacity onPress={this.onButtonPress.bind(this)}>
              <View style={styles.textLoginViewStyle}>
                <Text style={styles.textLoginStyle}>确认提交</Text>
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
export default EditNet;
