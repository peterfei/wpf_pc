import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight ,DeviceEventEmitter} from "react-native";

import {color, screen } from "./index";
import {font,getScreen} from "../Public/index";

//个人中心主体左侧
class PersonBodyLeft extends Component {
  state={
    currentIndex:'个人中心',
  }
  render() {
    return (
      <View style={[color.leftBackground,styles.container]}>
        <View style={[styles.personInformation,color.borderBottom]}>
          <Image
            style={styles.headPortrait}
            source={require('../../img/text.jpg')}
          />
          <View style={styles.information}>
            <Text style={font.font18}>某某某</Text>
            <Text style={font.font18}>普通用户</Text>
          </View>
        </View>

          {this.renderLabel()}


      </View>
    );
  }

  renderLabel(){
    let indicator=[],isLabel;
    let title=['个人中心','账户设置','我的书签']
    for(let i=0;i<title.length;i++){
      if(title[i]==this.state.currentIndex){
          isLabel={backgroundColor:"rgb(78,78,78)"}
      }else{
          isLabel={}
      };
      indicator.push(
        <TouchableHighlight key={i}
        onPress={() => this.change(i,title[i])}
        >
          <View style={[styles.label,color.borderBottom,isLabel]}>
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
  },
  personInformation:{
    flexDirection:'row',
    paddingTop:30,
    paddingBottom:30,
    justifyContent: 'center',
  },
  information:{
    justifyContent: 'space-around',
  },
  headPortrait:{
    height:80,
    width:80,
    borderRadius:40,
    marginRight:20
  },
  label:{
    width:'100%',
    height:70,
    paddingLeft:30,
    justifyContent: 'center',
  }
});

module.exports = PersonBodyLeft;
