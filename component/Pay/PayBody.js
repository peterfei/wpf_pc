import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight ,ScrollView,AsyncStorage} from "react-native";

import { color} from "./index";
import {font} from "../Public";

  //支付页面主体
class PayBody extends Component {
  state={
    dataAll:[{
      'title':'系统解剖全集',
      'intro':'全面升级，全面提供了携带知识库的肌肉系统',
      'content':'整体人、运动系统、内脏学、脉管系统、感觉其、神经系统、内分泌、肌肉起止点、肌肉动画、练习内容合集',
      'price1':'$99.99/年',
      'price2':'低至0.99/天',
      'nowPrice':'$99.99',
      'source':require('../../img/text.jpg')
    },{
      'title':'局部解剖全集',
      'intro':'真实数据局部切割逐层剥离，局解学习神器',
      'content':'整体人、运动系统、神经系统、内分泌、肌肉起止点、肌肉动画、练习内容合集',
      'price1':'$99.99/年',
      'price2':'低至0.99/天',
      'nowPrice':'$55.99',
      'source':require('../../img/text.jpg')
    },{
      'title':'经络俞穴',
      'intro':'针灸模式，真正直观，易学易用',
      'content':'整体人、运动系统、肌肉动画、练习内容合集',
      'price1':'$99.99/年',
      'price2':'低至0.99/天',
      'nowPrice':'$45.99',
      'source':require('../../img/text.jpg')
    },{
      'title':'解剖全集',
      'intro':'全面升级，全面提供了携带知识库的肌肉系统',
      'content':'整体人肌肉动画、练习内容合集',
      'price1':'$99.99/年',
      'price2':'低至0.99/天',
      'nowPrice':'$12.99',
      'source':require('../../img/text.jpg')
    },
    ],
    data:{
      'title':'系统解剖全集',
      'intro':'全面升级，全面提供了携带知识库的肌肉系统',
      'content':'整体人、运动系统、内脏学、脉管系统、感觉其、神经系统、内分泌、肌肉起止点、肌肉动画、练习内容合集',
      'price1':'$99.99/年',
      'price2':'低至0.99/天',
      'nowPrice':'$99.99',
      'source':require('../../img/text.jpg')
    },
  }
  componentWillMount(){
    this.setState({
      data:this.state.dataAll[this.props.num]
    })
  }
  changeID(){
    AsyncStorage.removeItem("userName");
    AsyncStorage.removeItem("password");
    this.props.navigation.navigate('Login');
  }
  render(){
    return(
      <View style={[styles.container,color.rightBackground]}>

        <View style={styles.personInformation}>
          <Image
            style={styles.headPortrait}
            source={require('../../img/text.jpg')}
          />
          <View style={styles.information}>
            <Text style={font.font18}>某某某</Text>
            <Text style={font.font18}>普通用户</Text>
          </View>
          <View>
            <TouchableHighlight  onPress={()=>this.changeID()}>
              <Text style={[font.font18,styles.changeID]}>切换账号</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={[styles.main,color.borderBackground,color.lightBorder]}>
          <View style={[styles.bodyTop,color.lightBorderBottom]}>
            <Text style={font.font25}>{this.state.data.title}</Text>
            <Text style={font.font20}>{this.state.data.intro}</Text>
            <Text style={font.font18NoBold}>{this.state.data.content}</Text>
            <Text style={font.font20NoBoldRed}>{this.state.data.price1}&nbsp;&nbsp;<Text style={font.font15NoBoldRed}>{this.state.data.price2}</Text></Text>
          </View>
          <View style={styles.bodyBottom}>
            <Text style={[styles.hint,font.font20]}>选择支付方式付款</Text>
            <Text style={font.font20NoBold}>应付金额：<Text style={font.font20NoBoldRed}>{this.state.data.nowPrice}</Text></Text>
            <Image
              resizeMode='contain'
              style={styles.payImg}
              source={this.state.data.source}
            />
            <Text>使用微信扫码支付</Text>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
  },
  personInformation:{
    flexDirection:'row',
    paddingLeft:30,
    paddingTop:30,
    //justifyContent: 'center',
  },
  headPortrait:{
    height:80,
    width:80,
    borderRadius:40,
    marginRight:20
  },
  information:{
    justifyContent: 'space-around',
  },
  main:{
    width:'80%',
    height:'70%',
    marginLeft:"10%"
  },
  bodyTop:{
    width:'100%',
    height:'40%',
    padding:20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bodyBottom:{
    width:'100%',
    height:'60%',
    padding:20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint:{
    position:"absolute",
    left:30,
    top:20,
  },
  payImg:{
    height:'70%',
  },
  changeID:{
    textDecorationLine:'underline',
    marginTop:8,
    marginLeft:15,
  },
});

module.exports = PayBody;
