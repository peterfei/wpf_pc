import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight ,DeviceEventEmitter} from "react-native";

import {color, screen } from "./index";
import {font,getScreen} from "../Public/index";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
//个人中心主体左侧
class PersonBodyLeft extends Component {
  state={
    currentIndex:'个人中心',
    title:['个人中心','账户设置','Mac地址'],
    Image:[{"Image":require('../../img/tab1.png')},{"Image":require('../../img/tab2.png')},{"Image":require('../../img/tab3.png')}],
    userName:''
  }
  async componentDidMount(){
    let mbName = await storage.get("mbName", "")
    this.setState({
      userName: mbName,
    })
  }
  render() {
    return (
      <View style={[color.rightBackground,styles.container]}>
        <View style={[styles.personInformation,color.borderBottom]}>
          <Image
            style={styles.headPortrait}
            source={require('../../img/text.jpg')}
          />
          <Text style={font.font20}>{this.state.userName}</Text>
        </View>

          {this.renderLabel()}


      </View>
    );
  }

  renderLabel(){
    let indicator=[],isLabel;
    let title=this.state.title;
    for(let i=0;i<title.length;i++){
      if(title[i]==this.state.currentIndex){
          isLabel={backgroundColor:"rgb(78,78,78)",borderRightWidth:1,borderColor:"rgb(110,110,110)"}
      }else{
          isLabel={}
      };
      indicator.push(
        <TouchableHighlight key={i}
        onPress={() => this.change(i,title[i])}
        >
          <View style={[styles.label,color.borderBottom,isLabel]}>
            <Image  style={{width:25,height:25,margin:10}}
              source={this.state.Image[i].Image}
            />
            <Text style={font.font20}>{title[i]}</Text>
          </View>
        </TouchableHighlight>
      )
    }
    return indicator;
  }
  change(i,title){
    // alert(`i is ${i} and title is ${title}`)
    this.setState({currentIndex:title});
    DeviceEventEmitter.emit("PersonBodyRightNum", {
      num: i
    });
  }
}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'17%',
    borderRightWidth:1,
    borderColor:"rgb(110,110,110)"
  },
  personInformation:{
    height:170,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headPortrait:{
    height:100,
    width:100,
    borderRadius:50,
  },
  label:{
    width:'100%',
    height:70,
    paddingLeft:30,
    alignItems: 'center',
    flexDirection:'row',
  }
});

module.exports = PersonBodyLeft;
