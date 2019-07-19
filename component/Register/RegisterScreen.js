import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,ImageBackground,TextInput } from "react-native";

import color from "../Person/color";
import { font } from "../Public";

  //登陆页面
export default class RegisterScreen extends Component {
  static navigationOptions = {
    title:'Register',
  }
  state={
    userName:'',
    securityCode:'',
    password:'',
    name:'',
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../img/background.jpg')}>
          <View style={styles.main}>
          <View style={[styles.body,color.border]}>
            <View style={[styles.input,color.borderBottom]}>
              <TextInput
                style={[styles.textInput,font.font20NoBoldGray]}
                maxLength={11}
                placeholder='手机号' placeholderTextColor='rgb(78,78,78)'
                onChangeText={(userName) => {const newText = userName.replace(/[^\d]+/, '');
                this.setState({userName:newText})
                }}
                value={this.state.userName}
              />
            </View>
            <View style={[styles.input,color.borderBottom]}>
              <TextInput
                style={[styles.textInput,font.font20NoBoldGray]}
                maxLength={6}
                placeholder='验证码' placeholderTextColor='rgb(78,78,78)'
                onChangeText={(securityCode) => this.setState({securityCode})}
              />
              <TouchableHighlight style={styles.securityCode}>
                <View style={[styles.button,{height:25,margin:5}]}>
                  <Text style={font.font15NoBold}>获取验证码</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={[styles.input,color.borderBottom]}>
              <TextInput
                style={[styles.textInput,font.font20NoBoldGray]}
                maxLength={16} secureTextEntry={true}
                placeholder='密码' placeholderTextColor='rgb(78,78,78)'
                onChangeText={(password) => this.setState({password})}
              />
            </View>
            <View style={[styles.input,color.borderBottom]}>
              <TextInput
                style={[styles.textInput,font.font20NoBoldGray]}
                maxLength={10}
                placeholder='姓名' placeholderTextColor='rgb(78,78,78)'
                onChangeText={(name) => this.setState({name})}
              />
            </View>

            <TouchableHighlight style={{width:'100%'}}>
              <View style={styles.button}>
                <Text style={font.font20}>注册</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight>
              <Text style={font.font18NoBoldGray}>已有账号？登陆</Text>
            </TouchableHighlight>
          </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%'
  },
  background:{
    flex: 1,
    width:'100%',
    height:'100%'
  },
  main:{
    flex: 1,
    width:'100%',
    height:'100%',
    justifyContent: 'flex-end', 
    marginBottom:"10%",
    alignItems: 'center',
  },
  body:{
    width:'30%',
    height:'50%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'white',
    borderRadius:5,
    padding:'3%',
  },
  input:{
    width:'100%',
    height:40,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom:15,
  },
  textInput:{
    backgroundColor:'rgba(78,78,78,0)',
    borderWidth:0,
    paddingLeft:0,
    margin:0,
    marginTop:5,
    width:'100%',
    height:35,
  },
  securityCode:{
    position:"absolute",
    right:0,
    top:3,
  },
  button:{
    width:'100%',
    height:40,
    backgroundColor:'rgb(13,192,217)',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius:5,
    marginBottom:15,
  },

});