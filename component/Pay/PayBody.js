import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ScrollView, AsyncStorage, DeviceEventEmitter, TextInput
} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

import { color } from "./index";
import { font } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../../screen/api";

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
      data: {
        "priceId": "Loading……",
        "productId": "Loading……",
        "comboId": "Loading……",
        "oldPrice": "Loading……",
        "deadline": "Loading……",
        "sellPrice": "Loading……",
        "addTime": "Loading……",
        "labelA": "Loading……",
        "labelB": "Loading……"
      },
      ordNo: '',
      ImgUrl: "",
      token: '',
      xxx: '',
      priceId: '',
      userName: '',
      mbHeadUrl: '',
      mbIdentity: '',
    }
    that = this;
  }

  async componentDidMount() {
    let member = await storage.get("member", "")
    let mbName = member.mbName
    let mbHeadUrl = member.mbHeadUrl
    let mbIdentity = member.mbIdentity
    this.setState({
      userName: mbName,
      mbHeadUrl: mbHeadUrl,
      mbIdentity: mbIdentity==1?'学生':mbIdentity==2?'教师':mbIdentity==3?'医生':mbIdentity==4?'游客':'普通用户'
    })
    this.comboDetail()
  }


  async comboDetail() {
    // 接口发送参数
    // 接口URL
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let comboId = this.props.comboId
    let url = api.base_uri_test + "pc/combo/comboDetail?comboId=" + comboId + "&comboSource=struct&token=" + token
    console.log(url)
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        //alert(JSON.stringify(result))
        if (result.msg == 'success') {
          if (result.comboPrices[0] == '') {
            this.setState({
              data: result.comboPrices[0]
            }, () => {
              that.insertOrder()
            })
          }
        }
      })
  }
  async insertOrder() {
    // 接口发送参数
    // 接口URL
    let comboId = this.props.comboId
    let priceId = this.state.data.priceId
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let body = {
      "priceId": priceId,
      "comboId": comboId,
      "ordRes": "pc",
      "remark": "测试",
      "business": "anatomy"
    }
    let url = api.base_uri_test + "pc/order/insertOrder?token=" + token
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
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = api.base_uri_test + "pc/pay/getNativeQRCode?token=" + token + "&ordNo=" + this.state.ordNo + "&business=anatomy"
    this.setState({
      ImgUrl: url
    })
    //alert(this.state.ImgUrl)
  }

  changeID() {
    storage.clearMapForKey("userName")
    // storage.clearMapForKey("userName");
    storage.clearMapForKey("password");
    storage.clearMapForKey("token");
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
            source={this.state.mbHeadUrl?{uri:this.state.mbHeadUrl}:require('../../img/text.jpg')}
          />
          <View style={styles.information}>
            <Text style={font.font18}>{this.state.userName}</Text>
            <Text style={font.font18}>{this.state.mbIdentity}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.changeID()}>
              <Text style={[font.font18, styles.changeID]}>切换账号</Text>
            </TouchableOpacity>
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
                  <Image style={styles.payImg} source={{ uri: this.state.ImgUrl }} />
                </View>
                : <Text style={font.font20}>Loading……</Text>
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
