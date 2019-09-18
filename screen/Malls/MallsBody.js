import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, ScrollView, Dimensions, AsyncStorage
} from "react-native";
import { color } from "./index";
import { font } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
//商城主体
class MallsBody extends Component {
  state = {
    isLabel: {},
    data: [],
    //activePage=0,
    width: 1024,
    height: 768,
    token: '',
  }
  async comboList() {
    //接口发送参数
    //接口URL
    let url = api.base_uri_test + "pc/combo/comboList?plat=pc&business=anatomy&app_version=3.4.0&page=1&limit=10&token=" + this.state.token

    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        //alert(JSON.stringify(result.page.list))
        
        this.setState({
          data: result.page.list
        })
      })
  }
  async componentDidMount() {
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    this.setState({
      token: token
    })
    this.time = await setInterval(
      () => {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        if (width != null && width != '' && height != null && height != '') {
          this.setState({
            width: width,
            height: height,
          });
        } else {
          this.setState({
            width: 1024,
            height: 768,
          });
        }

      }
    );
    await this.comboList()
  }
  componentWillUnmount() {
    this.time && clearTimeout(this.time);
  }

  renderCommodity() {
    let itemArr = [];
    let data = this.state.data
    for (let i = 0; i < data.length; i++) {
      itemArr.push(
        <View key={i} style={{ flex: 1, margin: 0, marginLeft: 10, marginRight: 10 }}>
          <View style={[styles.commodityInformation, color.borderBackground, { width: this.state.width * 0.2 }]}>
            <Text style={font.font25}>{data[i].comboName}</Text>
            <Text style={font.font20NoBold}>{data[i].labelA}</Text>
            <Text style={font.font20NoBoldRed}>￥{data[i].sellPrice}/年</Text>
            <TouchableOpacity onPress={() => this.change(data[i].comboId)} style={styles.button}>
              <Text style={{ fontSize: 16 }}>立即购买</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return itemArr;
  }
  change(comboId) {
    this.props.navigation.navigate('Pay', { comboId: comboId });
  }
  //this.props.navigation.navigate('Pay');

  //页码
  // renderIndicator(){
  //   let indicator=[],style;
  //   for(let i=0;i<data.length/3;i++){
  //     style=(i===this.state.activePage)?{color:"red"}:{color:"white"}
  //     indicator.push(
  //       <Text key={i} style={[font.font30,style]}>&bull;</Text>
  //     )
  //   }
  // }
  // onScrollAnimationEnd(e){
  //   let currentPage =Math.floor(e.nativeEvent.contentOffset.x/ 除以一页的width);
  //   this.setState({
  //     activePage=currentPage
  //   }) 
  // }
  moveCommodityLeft() {
    this.refs.ScrollView.scrollTo({ x: -800, y: 0, animated: true })
  }
  moveCommodityRight() {
    this.refs.ScrollView.scrollTo({ x: 800, y: 0, animated: true })
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <Image
          style={styles.imgBackGround}
          source={require('../img/mallBackground.png')}
        />
        <View style={styles.content}>
          <View style={{ width: "6%", height: 200 }}></View>
          <View style={styles.leftRight}>
            <TouchableOpacity onPress={() => this.moveCommodityLeft()}>
              <Image
                style={styles.leftRightImg}
                source={require('../img/leftImg.png')}
              />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={true}
            ref='ScrollView'
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            //onMomentumScrollEnd={this.onScrollAnimationEnd}
            style={styles.commodity}>
            {this.renderCommodity()}
          </ScrollView>
          <View style={styles.leftRight}>
            <TouchableOpacity onPress={() => this.moveCommodityRight()}>
              <Image
                style={styles.leftRightImg}
                source={require('../img/rightImg.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: "6%", height: 200 }}></View>
        </View>
        {/* <View style={styles.bottom}>
          {this.renderIndicator()}
        </View> */}

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  imgBackGround: {
    height: '30%',
    width: '100%',
  },
  content: {
    height: '90%',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftRight: {
    height: '100%',
    width: 25,
    marginTop: '15%'
  },
  leftRightImg: {
    width: 25,
    height: 50,
  },
  commodity: {
    marginLeft: '3%',
    marginRight: '3%',
    //justifyContent: 'space-between', 
    //alignItems: 'center',
    //flexDirection:'row',
    width: '66%',
    margin: 0,
    height: '60%',
  },
  bottom: {
    position: "absolute",
    bottom: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  commodityInformation: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    height: '96%',
    borderRadius: 5,
    borderColor: 'rgb(13,192,217)',
    borderWidth: 2,
    margin: 0,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 3,
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = MallsBody;
