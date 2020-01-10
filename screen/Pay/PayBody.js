import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ScrollView, AsyncStorage, DeviceEventEmitter, TextInput, NativeModules, Alert
} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import CouponCell from "../common/CouponCell";

import { color } from "./index";
import { font } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import Loading from '../common/Loading'
var that = null;
//支付页面主体
class PayBody extends Component {
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
      loadingQRCode: false,
      showSpecialPrices: false,
      coupon: null,
      isOldUser: false,
      couponId: null,
      couponExpires: false, // 优惠券是否过期
      couponExpirTime: '', // 套餐到期时间
      isUseCoupon: false,
      subtractPrice: 0,
      isConn: true, // 网络是否连接
    }
    that = this;
  }

  async componentDidMount() {
    let member = await storage.get("member", "")
    let mbName = member.mbName
    let mbHeadUrl = member.mbHeadUrl == 'RYKJ/' || member.mbHeadUrl == null ? '' : member.mbHeadUrl
    let mbIdentity = member.mbIdentity
    this.setState({
      userName: mbName,
      mbHeadUrl: mbHeadUrl,
      mbIdentity: mbIdentity == 1 ? '学生' : mbIdentity == 2 ? '教师' : mbIdentity == 3 ? '医生' : mbIdentity == 4 ? '游客' : '普通用户'
    })
    this.comboDetail()
    this.checkIsOldUser()
  }

  initInterval() {
    this.timer = setInterval(
      () => {
        that.getOrderState(this.timer)
        // that.debounce( that.getOrderState(timer),3000)
      },
      1500
    );
  }

  //防抖函数
  debounce(fn, wait) {
    let timeout;

    return function () {
      let context = this;
      let args = arguments;

      clearTimeout(timeout)
      timeout = setTimeout(function () {
        fn.apply(context, args)
      }, wait);
    }
  }
  async getOrderState(timer) {
    let member = await storage.get("member", "")
    // let token = await storage.get("token", "")
    // alert(`tokens is ${JSON.stringify(tokens)}`)
    // let data = { "mb_id": member.mbId
    let token = await storage.get("token", "")
    let url = api.base_uri + "/pc/order//getOrderState?ordNo=" + this.state.ordNo + "&token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        if (result.result == 'finished') {
          clearTimeout(timer);
          //FIXME 跳转一下
          this.Loading.show('支付成功');
          this.timer = setTimeout(() => {
            this.Loading.close()
            let data = { "mb_id": member.mbId, "token": token }
            let _content = { "type": "BuyComplete", "data": data }
            NativeModules.MyDialogModel.SendMessageToUnity(
              JSON.stringify(_content)
            );
            this.props.navigation.goBack(this.props.Malls_key, { payState: true });//返回商城前一个界面
            this.openUnity()
          }, 500);

        }
      })
  }
  async openUnity() {
    let _w = await NativeModules.MyDialogModel.getMainWidth();
    let _h = await NativeModules.MyDialogModel.getMainHeight();

    setTimeout(async () => {
      DeviceEventEmitter.emit("UnityWinEmitter", {
        // modalVisible: "flex"
        width: _w,
        height: (_h ),
      });
    }, 100)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  async checkIsOldUser(){
    let token = await storage.get("token", "")
    let url = api.base_uri + 'pc/order/isOldUser?token=' + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
        .then(res => {
          if (res.code == 0 && res.isOldUser.toString() === 'true') {
            // alert('查询出来的数据：' + JSON.stringify(res))
            let obj = res.coupon
            let coupon = {isSelect: false, couponPrice: obj.subtract_price, getTime: '', expirTime: obj.over_time, couponId: obj.coupon_id}
            let url = api.base_uri + 'pc/order/isUseCoupon?token=' + token + '&couponId='+obj.coupon_id
            fetch(url, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            }).then(resp => resp.json())
                .then(result => {
                  if (result.code === 0) {
                    let currTime = new Date(obj.over_time)
                    let expirTime = new Date()
                    this.setState({
                      isOldUser: res.isOldUser,
                      coupon: coupon,
                      couponExpires: currTime.getTime() < expirTime.getTime(),
                      couponId: obj.coupon_id,
                      subtractPrice: obj.subtract_price,
                      isUseCoupon: result.isUseCoupon
                    })
                  }
                })

          }
        })
  }

  async comboDetail() {
    // 接口发送参数
    // 接口URL
    let token = await storage.get("token", "")
    let comboId = this.props.comboId
    let url = api.base_uri + "pc/combo/comboDetail?comboId=" + comboId + "&comboSource=struct&token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        if (result.msg == 'success') {
          if (result.comboPrices[0] !== '') {
            this.setState({
              data: result.comboPrices[0],
              loadingQRCode: true
            }, () => {
              that.insertOrder()
            })
          }
        }
      })
        .catch(err=>{
            this.Loading.autoClose("请检查您的网络环境！")
        })
  }

  async newInsertOrder() {
    // 接口发送参数
    // 接口URL
    let comboId = this.props.comboId
    let priceId = this.state.data.priceId
    let couponId = this.state.couponId
    let token = await storage.get("token", "")
    let body = {
      "priceId": priceId,
      "comboId": comboId,
      "couponIds": couponId,
      "ordRes": "pc",
      "remark": couponId,
      "business": "anatomy"
    }

    let url = api.base_uri + '/v1/app/order/newAddOrder?token=' + token
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(result => {
          this.setState({
            ordNo: result.order.ordNo
          }, () => {
            that.getNativeQRCode();
            that.initInterval()
          })
        })
        .catch(err => {
           this.setState({
             isConn: false
           })
            this.Loading.autoClose("请检查您的网络环境！")
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
      "remark": "PC订单",
      "business": "anatomy"
    }
    let url = api.base_uri + "pc/order/insertOrder?token=" + token
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
          that.initInterval()
        })

      })
  }
  /**
     * 发送消息给unity
     */
  sendMsgToUnity(name, info, type) {
    if (this.unity) {
      if (type == 'json') {
        let temp = Object.assign({}, info)
        this.unity.postMessageToUnityManager({
          name: name,
          data: JSON.stringify(temp)
        })
      } else {
        this.unity.postMessageToUnityManager({
          name: name,
          data: info
        })
      }
    }
  }
  async getNativeQRCode() {
    let token = await storage.get("token", "")
    let url = api.base_uri + "pc/pay/getNativeQRCode?token=" + token + "&ordNo=" + this.state.ordNo + "&business=anatomy"
    this.setState({
      loadingQRCode: false,
      ImgUrl: url
    })
    //alert(this.state.ImgUrl)
  }

  changeID() {
    this.Loading.alertChoose('确定切换账号');
  }
  resetSelectStatus(coupon) {
    this.setState({
      showSpecialPrices: !this.state.showSpecialPrices,
      loadingQRCode: true,
      coupon: coupon
    })
    if (coupon.isSelect.toString() === 'true') {
      this.newInsertOrder()
    } else {
      this.insertOrder()
    }
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>

        <View style={styles.personInformation}>
          <Image
            style={styles.headPortrait}
            source={this.state.mbHeadUrl !== '' ? { uri: this.state.mbHeadUrl } : require('../img/text.jpg')}
          />
          <View style={styles.information}>
            <Text style={font.font18}>{this.state.userName}</Text>
            <Text style={font.font18}>{this.state.mbIdentity}</Text>
          </View>
          {/*<View>*/}
          {/*  <TouchableOpacity onPress={() => this.changeID()}>*/}
          {/*    <Text style={[font.font18, styles.changeID]}>切换账号</Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}
        </View>

        <View style={[styles.main, color.borderBackground, color.lightBorder]}>
          <View style={[styles.bodyTop, color.lightBorderBottom]}>
            <Text style={font.font25}>{this.state.data.labelA}</Text>
            {this.state.isConn ? <Text style={font.font20}>为了回馈新老用户一直以来对“维萨里3D解剖”产品的大力支持，满足用户在不同场景的使用。</Text> : <Text />}
            {this.state.isConn ? <Text style={[font.font20,{fontWeight: 700}]}>新推出PC用户版，对新老用户满减500元！</Text> : <Text />}
            {!this.state.isConn ? <Text style={[font.font20,{fontWeight: 700}]}>暂无数据！</Text> : <Text />}


            {/*<Text style={font.font20}>{this.state.data.labelB}</Text>*/}
            {/*<Text style={font.font18NoBold}>{this.state.data.content}</Text>*/}
            {/*<Text style={font.font20NoBoldRed}>原价￥{this.state.data.oldPrice}</Text>*/}
          </View>
          <View style={styles.bodyBottom}>
            {/*<Text style={[styles.hint, font.font20]}>微信扫码付款</Text>*/}
            {this.state.showSpecialPrices ? <Text style={[font.font20NoBold, {textDecorationLine: 'line-through'}]}><Text style={font.font20NoBoldRed}>￥{this.state.isConn ? this.state.data.sellPrice : '暂无数据'}</Text></Text> : null}
            <Text style={font.font20NoBold}><Text style={font.font20NoBoldRed}>￥{this.state.showSpecialPrices ? parseFloat(this.state.data.sellPrice) - parseFloat(this.state.subtractPrice) : this.state.data.sellPrice}</Text></Text>
            {/* <Image
              style={styles.payImg}
              source={{ uri: this.state.Img }}
            /> */}

            {
              (this.state.isOldUser.toString() === 'true' && this.state.couponExpires.toString() === 'false' && this.state.isUseCoupon.toString() === 'true') ? <CouponCell
                  type='action'
                  coupon={this.state.coupon}
                  selectAction={(coupon) => {
                    this.resetSelectStatus(coupon)
                  }}
              /> : null
            }

            {
              !this.state.loadingQRCode ?
                <View style={{ height: 150, width: 150 }}>
                  <Image style={styles.payImg} source={{ uri: this.state.ImgUrl }} />
                </View>
                : <Text style={font.font20}>Loading……</Text>
            }
            <Text>使用微信扫码支付</Text>
          </View>
        </View>
        <Loading ref={r => { this.Loading = r }} hide={true} yes={() => { this.Loading.logout() }} navigation={this.props.navigation} />
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
