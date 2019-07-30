import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, ScrollView, AsyncStorage, DeviceEventEmitter, TextInput
} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

import { color } from "./index";
import { font } from "../Public";
import { storage } from "../Public/storage";


var that = null;
//支付页面主体
class PayBody extends Component {
  // state = {
  //   data: {},
  //   ordNo: '',
  //   ImgUrl: "",
  //   token: '',
  //   xxx: ''
  // }

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      ordNo: '',
      ImgUrl: "",
      token: '',
      xxx: '',
      priceId:''
    }
    that = this;
  }

  async componentWillMount() {
    // await this.comboDetail()
    // await this.insertOrder()
    // await this.getNativeQRCode()
  }

  componentDidMount() {
   this.comboDetail()
  }
 
  async comboDetail() {
    // 接口发送参数
    // 接口URL
    let token = await storage.get("token", "")
    let comboId = this.props.comboId
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/combo/comboDetail?comboId=" + comboId + "&comboSource=struct&token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        this.setState({
          data: result.comboPrices[0]
        }, () => {
          that.insertOrder()
        })
      })
  }
  async insertOrder() {
    // 接口发送参数
    // 接口URL
    let comboId = this.props.comboId
    let priceId = this.state.data.priceId
    let token = await storage.get("token", "")
    let body = {
      "priceId": priceId,
      "comboId": comboId,
      "ordRes": "pc",
      "remark": "测试",
      "business": "anatomy"
    }
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/order/insertOrder?token=" + token
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    }).then(resp => resp.json())
      .then(result => {
        this.setState({
          ordNo: result.order.ordNo
        }, () => {
          that.getNativeQRCode();
        })
       
      })
  }
  async getNativeQRCode() {
    let token = await storage.get("token", "")
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/pay/getNativeQRCode?token=" + token + "&ordNo=" + this.state.ordNo + "&business=anatomy"
    this.setState({
      ImgUrl: url
    })
    //alert(this.state.ImgUrl)
  }


  changeID() {
    // AsyncStorage.removeItem("userName");
    // AsyncStorage.removeItem("password");
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })]
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>

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
            <TouchableHighlight onPress={() => this.changeID()}>
              <Text style={[font.font18, styles.changeID]}>切换账号</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={[styles.main, color.borderBackground, color.lightBorder]}>
          <View style={[styles.bodyTop, color.lightBorderBottom]}>
            <Text style={font.font25}>{this.state.data.labelA}</Text>
            <Text style={font.font20}>{this.state.data.labelB}</Text>
            <Text style={font.font18NoBold}>{this.state.data.content}</Text>
            <Text style={font.font20NoBoldRed}>原价￥{this.state.data.oldPrice}</Text>
          </View>
          <View style={styles.bodyBottom}>
            <Text style={[styles.hint, font.font20]}>选择支付方式付款</Text>
            <Text style={font.font20NoBold}>应付金额：<Text style={font.font20NoBoldRed}>￥{this.state.data.sellPrice}</Text></Text>
            {/* <Image
              style={styles.payImg}
              source={{ uri: this.state.Img }}
            /> */}
            {
              this.state.ImgUrl.length > 0 ? 
              <View style={{ height: 150, width: 150 }}>
                <Image style={styles.payImg} source={{uri: this.state.ImgUrl}} />
             </View>
            : null
            }
            <Text>使用微信扫码支付</Text>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  personInformation: {
    flexDirection: 'row',
    paddingLeft: 30,
    paddingTop: 30,
    //justifyContent: 'center',
  },
  headPortrait: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 20
  },
  information: {
    justifyContent: 'space-around',
  },
  main: {
    width: '80%',
    height: '70%',
    marginLeft: "10%"
  },
  bodyTop: {
    width: '100%',
    height: '40%',
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bodyBottom: {
    width: '100%',
    height: '60%',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint: {
    position: "absolute",
    left: 30,
    top: 20,
  },
  payImg: {
    width: 150,
    height: 150,
  },
  changeID: {
    textDecorationLine: 'underline',
    marginTop: 8,
    marginLeft: 15,
  },
});

module.exports = PayBody;
