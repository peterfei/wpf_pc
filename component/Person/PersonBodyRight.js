import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,TextInput } from "react-native";

import {color, screen } from "./index";
import { font,getScreen } from "../Public";

import RadioModal from 'react-native-radio-master';

//个人中心主体右侧

class PersonBodyRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initId:'1',
      initItem:'女',

      phoneNumber:'17391973517',
      emil:'2438325121@qq.com',
      passWord:'123456789',
      editable:false,
      saveArray:""
    };
  }
  render() {
    return (
      <View style={[styles.container,color.rightBackground]}>
        <View style={[styles.top,color.borderBottom]}>
          <Text style={font.font25}>|&nbsp;&nbsp;个人中心</Text>
        </View>
        <View style={[styles.main,color.border]}>
          <View style={styles.mainTop}>
            <Image
              style={styles.headPortrait}
              source={require('../../img/text.jpg')}
            />
            <View style={styles.mainTopRight}>
              <Text style={font.font20Blue}>点击修改头像</Text>
              <Text style={font.font15NoBold}>支持jpg、jpeg、png类型文件</Text>
            </View>
          </View>
          
          {this.main()}
        </View>
      </View>
    );
  }

  main(){
    return(
      <View style={styles.mainBody}>
            {/* 第一行 */}
            <View style={styles.row}>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>姓名：</Text>
                <Text style={font.font20NoBold}>某某某</Text>
              </View>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>性别：</Text>
                {this.radioModal()}
              </View>
            </View>

            {/* 第二行 */}
            <View style={styles.row}>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>手机：</Text>
                <TextInput
                  defaultValue={this.state.phoneNumber}
                  keyboardType='numeric'
                  editable={this.state.editable}
                  ref='phoneNumber'
                  style={[styles.textInput1,font.font20NoBold]}
                  onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                />
                <Text style={[font.font20Blue,styles.textButton]}
                  onPress={()=>this.change(this.refs.phoneNumber)}>绑定</Text>
              </View>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>登陆邮箱：</Text>
                <TextInput
                  defaultValue={this.state.emil}
                  keyboardType='email-address'
                  editable={this.state.editable}
                  ref='emil'
                  style={[styles.textInput1,font.font20NoBold]}
                  onChangeText={(emil) => this.setState({emil})}
                />
                <Text style={[font.font20Blue,styles.textButton]}
                onPress={()=>{
                  this.change(this.refs.emil);
                }
                }>绑定</Text>
              </View>
            </View>

            {/* 第三行 */}
            <View style={styles.row}>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>密码：</Text>
                <TextInput
                  defaultValue={this.state.passWord}
                  secureTextEntry={true}
                  editable={this.state.editable}
                  ref='passWord'
                  style={[styles.textInput1,{color:'white'}]}
                  onChangeText={(passWord) => this.setState({passWord})}
                />
                <Text style={[font.font20Blue,styles.textButton]}
                onPress={()=>this.change(this.refs.passWord)}>修改</Text>
              </View>
            </View> 

          </View>
    )
  }
  change(e){
    if(this.state.editable==false){
      this.setState({ 
      editable:true
      })
      e.setNativeProps({
        style:{
          borderWidth:1,
          borderColor:"rgb(78,78,78)",
          borderRadius:3,
          padding:0,
          width:170,
          height:25,}
      })
    }else{
      this.setState({
        editable:false
      })
      e.setNativeProps({
        style:{
          borderWidth:0,
          padding:0,
          backgroundColor:"rgb(47,47,47)",
          width:170,
          height:25,}
      })
    }
  }
  radioModal(){
    return(
      <RadioModal
        selectedValue={this.state.initId}
        onValueChange={(id,item) => this.setState({initId: id,initItem:item})}
        selImg={require('../../img/selImg.png')}
        seledImg={require('../../img/seledImg.png')}
        style={{ flexDirection:'row',flexWrap:'wrap',
        alignItems:'flex-start',
        flex:1,}} 
      >
        <Text value="0" style={{width:100}}>男</Text>
        <Text value="1" style={{width:100}}>女</Text>
      </RadioModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'83%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  top:{
    position:"absolute",
    top:0,
    width:'100%',
    height:70,
    justifyContent: 'center', 
    paddingLeft:30
  },
  main:{
    padding:70,
    width:'80%',
    height:'60%',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom:50,
  },
  mainTop:{
    flexDirection:'row',
    marginBottom:10,
  },
  headPortrait:{
    height:80,
    width:80,
    borderRadius:40,
  },
  mainTopRight:{
    justifyContent: 'space-around',
    marginLeft:30,
  },
  mainBody:{
    marginBottom:30
  },
  row:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop:40,
  },
  mainBodyContent:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'flex-start',
  },
  mainBodyContentLeft:{
    marginRight:15,
  },
  textButton:{
    marginLeft:10,
    flexWrap:'wrap',
    alignItems:'flex-start',
  },
  textInput1:{
    borderWidth:0,
    padding:0,
    backgroundColor:"rgb(47,47,47)",
    width:170,
    height:25,
  },
});

module.exports = PersonBodyRight;
