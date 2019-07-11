import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight } from "react-native";

import { color} from "./index";
import {font} from "../Public";

  //商城主体
class MallsBody extends Component {
  state={
    currentIndex:'个人中心',
    isLabel:{},
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.imgBackGround}
          source={require('../../img/text.jpg')}
        />
        <View style={[styles.container,color.rightBackground]}>
        </View>

        <View style={styles.content}>
          <TouchableHighlight>
            <Image
              style={styles.leftRightImg}
              source={require('../../img/leftImg.png')}
            />
          </TouchableHighlight>

          <View style={styles.commodity}>
            {this.renderCommodity()}
          </View>

          <TouchableHighlight>
            <Image
              style={styles.leftRightImg}
              source={require('../../img/rightImg.png')}
            />
          </TouchableHighlight>
        </View>

        <View style={styles.bottom}>
          <Text style={font.font30}>······</Text>
        </View>

      </View>
      
    );
  }

  renderCommodity(){
    return(
      <View style={[styles.commodityInformation,color.borderBackground]}>
        <Text style={font.font25}>系统解剖全集</Text>
        <Text style={font.font20NoBold}>全面升级，全面提供了携带知识库的肌肉系统</Text>
        <Text style={font.font20NoBold}>$99.99&nbsp;&nbsp;1/年</Text>
        <View onPress={() => {alert('没钱')}} style={styles.button}>
          <Text style={{fontSize:16}}>立即购买</Text>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
  },
  imgBackGround:{
    height:'37%',
    width:'100%',
  },
  content:{
    position:"absolute",
    top:'-3%',
    height:'100%',
    width:'100%',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection:'row',
  },
  leftRightImg:{
    width:80,
    height:80,
  },
  commodity:{
    marginLeft:'3%',
    marginRight:'3%',
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexDirection:'row',
    width:'67%',
    height:'55%'
  },
  bottom:{
    position:"absolute",
    bottom:'15%',
    width:'100%',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection:'row',
  },
  commodityInformation:{
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingLeft:'5%',
    paddingRight:'5%',
    width:'31%',
    height:'100%',
    borderRadius:5,
    borderColor:'rgb(13,192,217)',
    borderWidth:2
  },
  button:{
    backgroundColor:'white',
    borderRadius:3,
    width:'70%',
    height:40,
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

module.exports = MallsBody;
