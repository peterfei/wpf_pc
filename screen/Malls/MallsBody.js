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
import Loading from '../common/Loading'
//商城主体
class MallsBody extends Component {
  state = {
    isLabel: {},
    data: [],
    //activePage:0,
    pageNum:1,//Scroll页码数
    scrollPosition: 0,//当前Scroll位置
    width: 1024,
    height: 768,
    token: '',
    showArrow: false
  }
  async comboList(token) {
    //接口发送参数
    //接口URL
    let url = api.base_uri + "pc/combo/comboList?plat=pc&business=anatomy&app_version=3.4.0&page=1&limit=10&token=" + token

    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        // alert(JSON.stringify(result.page.list))
        this.Loading.close();
        this.setState({
          data: result.page.list,
          pageNum:result.page.list.length
        })

        if (result.page.list.length === 1) {
          this.setState({
            showArrow: false
          })
        } else {
          this.setState({
            showArrow: true
          })
        }
      })
  }
  async componentDidMount() {
    this.Loading.show('加载中……');
    let token = await storage.get("token", "")
    // this.time = await setInterval(
    //   () => {
    //     let width = Dimensions.get('window').width;
    //     let height = Dimensions.get('window').height;
    //     if (width != null && width != '' && height != null && height != '') {
    //       this.setState({
    //         width: width,
    //         height: height,
    //       });
    //     } else {
    //       this.setState({
    //         width: 1024,
    //         height: 768,
    //       });
    //     }

    //   }
    // );
    await this.comboList(token)
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
          <View style={[styles.commodityInformation, color.borderBackground, { width: this.state.width * 0.3 }]}>
            <Text style={font.font25}>系统解剖全集</Text>
            {/*<Text style={font.font20NoBold}>{data[i].labelA}</Text>*/}
            {/*<Text style={font.font20NoBoldRed}>￥{data[i].sellPrice}/年</Text>*/}
            <TouchableOpacity onPress={() => this.change(data[i].comboId)} style={styles.button}>
              <Text style={font.font18NoBold}>立即使用</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return itemArr;
  }
  change(comboId) {
    this.props.navigation.navigate('Pay', { comboId: comboId, Malls_key: this.props.navigation.state.key });
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
    this.refs.ScrollView.scrollTo({ x: this.state.scrollPosition == 0 ? 0 : this.state.scrollPosition - this.state.width * 0.66, y: 0, animated: true })
    if (this.state.scrollPosition !== 0) {
      this.setState({
        scrollPosition: this.state.scrollPosition - this.state.width * 0.66
      })
    }
    // this.refs.ScrollView.scrollTo({ x: 0, y: 0, animated: true })
  }
  moveCommodityRight() {
    this.refs.ScrollView.scrollTo({ x: this.state.scrollPosition == this.state.pageNum*this.state.width * 0.66 ? this.state.pageNum*this.state.width * 0.66 : this.state.scrollPosition + this.state.width * 0.66, y: 0, animated: true })
    if (this.state.scrollPosition !== this.state.pageNum*this.state.width * 0.66) {
      this.setState({
        scrollPosition: this.state.scrollPosition + this.state.width * 0.66
      })
    }
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
          {this.state.showArrow ? <View style={styles.leftRight}>
            <TouchableOpacity onPress={() => this.moveCommodityLeft()}>
              <Image
                  style={styles.leftRightImg}
                  source={require('../img/leftImg.png')}
              />
            </TouchableOpacity>
          </View> : null }


          <ScrollView horizontal={true}
            ref='ScrollView'
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            //onMomentumScrollEnd={this.onScrollAnimationEnd}
            style={[styles.commodity, { width: this.state.width * 0.66 }]}>
            {this.renderCommodity()}
          </ScrollView>
          {this.state.showArrow ? <View style={styles.leftRight}>
            <TouchableOpacity onPress={() => this.moveCommodityRight()}>
              <Image
                  style={styles.leftRightImg}
                  source={require('../img/rightImg.png')}
              />
            </TouchableOpacity>
          </View> : null}

          <View style={{ width: "6%", height: 200 }}></View>
        </View>
        {/* <View style={styles.bottom}>
          {this.renderIndicator()}
        </View> */}
        <Loading ref={r => { this.Loading = r }} hide={true} />
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
    borderWidth: 1,
    borderColor: '#F47575',
    borderRadius: 3,
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = MallsBody;
