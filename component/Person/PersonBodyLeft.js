import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import {color, screen } from "./index";
import {font,getScreen} from "../Public/index";

//个人中心主体左侧
class PersonBodyLeft extends Component {
  state={
    currentIndex:'个人中心',
    isLabel:{},
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

          {this.renderLabel('个人中心')}

          {this.renderLabel('账户设置')}

          {this.renderLabel('我的书签')}

      </View>
    );
  }

  renderLabel(name){
    return(
      <TouchableHighlight
        style={[styles.label,color.borderBottom,this.state.isLabel]}
        onPress={() => {this.changeIndex(name);}}
        >
            <Text style={font.font20}>{name}</Text>
      </TouchableHighlight>
    )
  }
  changeIndex(name){
    if(name==this.state.currentIndex){
      this.setState({
        isLabel:{backgroundColor:"rgb(78,78,78)"}
      })
    }else{
      this.setState({
        isLabel:{}
      })
    }
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
