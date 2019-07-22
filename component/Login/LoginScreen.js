import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,ImageBackground,TextInput,AsyncStorage} from "react-native";

import color from "../Person/color";
import { font } from "../Public";
import TestData from "../../LocalData/TestData.json"
import  CryptoJS from  "crypto-js";
  //登陆页面
export default class LoginScreen extends Component {
  static navigationOptions = {
    title:'Login',
  }
  state={
    warn:'',
    userName:'',
    password:'',
    dataSource:[],
  }
  // static defaultProps ={
  //   api_url:'sss'
  // }
  componentDidMount(){
    // this.loadDataFormNet();
    this.setState({
      dataSource:TestData
    })
  }
  // loadDataFormNet(){
  //   fetch(this.props.api_url)
  //     .then((response)=>response.json())
  //     .then((responseData)=>{
  //       this.setState({
  //         dataSource:responseData.data
  //       })
  //     })
  //     .catch((error)=>{
  //       this.setState({
  //         dataSource:TestData.data
  //       })
  //     })
  // }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../img/background.jpg')}>
            
            <View style={styles.body}>

              <Text style={[font.font15NoBoldRed,{marginBottom:15}]}>
                {this.state.warn}
              </Text>

              <View style={styles.content}>
                <Image
                  style={styles.icon}
                  source={require('../../img/userName.png')}/>
                <View style={styles.input}>
                  <TextInput
                    style={[styles.textInput,font.font20NoBoldGray]}
                    maxLength={11}
                    placeholder='用户名/手机号' placeholderTextColor='rgb(78,78,78)'
                    onChangeText={(userName) => this.setState({userName})}
                  />
                </View>
              </View>
              <View style={styles.content}>
                <Image
                  style={styles.icon}
                  source={require('../../img/password.png')}/>
                <View style={styles.input}>
                  <TextInput
                    style={[styles.textInput,font.font20NoBoldGray]}
                    secureTextEntry={true} maxLength={16}
                    placeholder='密码' placeholderTextColor='rgb(78,78,78)'
                    onChangeText={(password) => this.setState({password})}
                  />
                </View>
              </View>

              <TouchableHighlight style={{width:'25%'}}
                onPress={() => this.login()} >
                <View style={styles.button}>
                  <Text style={font.font20}>登陆</Text>
                </View>
              </TouchableHighlight>

              <View style={styles.index}>
                <TouchableHighlight>
                  <Text style={font.font18NoBoldGray}>忘记密码</Text>
                </TouchableHighlight>
                <TouchableHighlight>
                  <Text style={font.font18NoBoldRed}>立即注册</Text>
                </TouchableHighlight>
              </View>
            </View>
            
        </ImageBackground>
      </View>
    );
  }
  login(){
    let AESuserName = CryptoJS.AES.encrypt(this.state.userName,'X2S1B5GS1F6G2X5D').toString();
    let AESpassword = CryptoJS.AES.encrypt(this.state.password,'X2S1B5GS1F6G2X5D').toString();
    if(this.state.userName != null && this.state.userName != "" && this.state.password != null && this.state.password != ""){
      for(let i=0;i<this.state.dataSource.data.length;i++){
        if(this.state.userName==this.state.dataSource.data[i].userName && this.state.password==this.state.dataSource.data[i].password){
          AsyncStorage.setItem("userName", JSON.stringify(AESuserName),
           function (error) {
            if (error) {
              console.log('存储失败')
            }else {
              console.log('存储完成')
            }});
          AsyncStorage.setItem("password", JSON.stringify(AESpassword),
          function (error) {
            if (error) {
              console.log('存储失败')
            }else {
              console.log('存储完成')
            }});
          this.props.navigation.navigate('Main');
          this.setState({
            warn:''
          });
          return;
        }else{
          this.setState({
            warn:'账号或密码错误!'
          })
        }
      }
      }else{
        this.setState({
          warn:'账号或密码不能为空！'
        })
      }
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
  body:{
    flex: 1,
    width:'100%',
    height:'100%',
    justifyContent: 'flex-end', 
    marginBottom:"20%",
    alignItems: 'center',
  },
  content:{
    paddingBottom:15,
  },
  icon:{
    position:"absolute",
    left:5,
    top:5,
    width:25,
    height:25,
  },
  input:{
    borderWidth:1,
    borderColor:"rgb(78,78,78)",
    borderRadius:5,
    width:'25%',
    height:40,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  textInput:{
    backgroundColor:'rgba(78,78,78,0)',
    borderWidth:0,
    padding:0,
    marginTop:5,
    paddingLeft:35,
    width:'100%',
    height:35,
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
  index:{
    flexDirection:'row',
    justifyContent: 'space-between',
    width:'25%',
  },
});