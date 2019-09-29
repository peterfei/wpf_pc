import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";

import { storage } from "../Public/storage";
import CryptoJS from "crypto-js";
import RadioModal from 'react-native-radio-master';
import api from "../api";
import Loading from '../common/Loading'
//个人中心主体右侧-个人中心

class PersonBodyRightOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initId: '0',
      initItem: '',
      userName: 'loading',
      phoneNumber: 'loading',
      emil: 'loading',
      passWord: '*********',
      editable: false,
      saveArray: "",
      mbHeadUrl: '',
    };
  }

  async componentDidMount() {
    let member = await storage.get("member", "")
    let mbName = member.mbName
    let mbSex = member.mbSex
    let phoneNumber = member.mbTell
    let emil = member.mbEmail
    let mbHeadUrl = member.mbHeadUrl=='RYKJ/'?'':member.mbHeadUrl
    let initId = mbSex == '男' ? '0' : '1';
    let initItem = mbSex == '男' ? '男' : '女';
    this.setState({
      initId: initId,
      initItem: initItem,
      userName: mbName,
      phoneNumber: phoneNumber,
      emil: emil,
      mbHeadUrl: mbHeadUrl
    })
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  async updateMemberInfo() {
    let token = await storage.get("token", "")
    let member = await storage.get("member", "")
    let mbId = member.mbId
    //接口URL
    let body = {
      mbName: this.state.userName,
      mbId: mbId,
      mbSex: this.state.initItem
    }
    let url = api.base_uri_test + "pc/member/updateMemberInfo?token=" + token
    await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    }).then(resp => resp.json())
      .then(async result => {
        if (result.msg == "success") {
          this.Loading.show('修改成功');
          this.timer = setTimeout(() => {
            this.Loading.close()
          }, 1000);
          // storage.remove("mbName");
          // storage.remove("mbSex");
          let newmember = member
          newmember.mbName = this.state.userName
          newmember.mbSex = this.state.initItem
          await storage.save("member", "", newmember);
        } else {
          //alert(JSON.stringify(result))
          this.Loading.show(JSON.stringify(result));
          this.timer = setTimeout(() => {
            this.Loading.close()
          }, 1000);
          this.setState({

          })
        }
      })
  }

  main() {
    return (
      <View style={styles.mainBody}>
        {/* 第一行 */}
        <View style={styles.row}>
          <View style={[styles.mainBodyContent, { width: '50%' }]}>
            <Text style={[font.font20NoBold, styles.mainBodyContentLeft]}>姓名：</Text>
            <TextInput
              defaultValue={this.state.userName}
              editable={false}
              ref='userName'
              style={[styles.textInput1, font.font18]}
              onChangeText={(userName) => this.setState({ userName })}
            />
            <Text style={[font.font20Blue, styles.textButton]}
              onPress={() => {
                this.change(this.refs.userName);
              }}>绑定</Text>
          </View>
          <View style={[styles.mainBodyContent, { width: '50%' }]}>
            <Text style={[font.font20NoBold, styles.mainBodyContentLeft]}>性别：</Text>
            {this.radioModal()}
          </View>
        </View>

        {/* 第二行 */}
        <View style={styles.row}>
          <View style={[styles.mainBodyContent, { width: '50%' }]}>
            <Text style={[font.font20NoBold, styles.mainBodyContentLeft]}>手机：</Text>
            <Text style={[font.font18]}>{this.state.phoneNumber.slice(0, 6) + '*****'}</Text>
          </View>
          <View style={[styles.mainBodyContent, { width: '50%' }]}>
            {/* <Text style={[font.font20NoBold,styles.mainBodyContentLeft]}>登陆邮箱：</Text>
                <Text style={[font.font18]}>{this.state.emil.slice(0,3)+'******'+this.state.emil.slice(10)}</Text> */}
            <Text style={[font.font20NoBold, styles.mainBodyContentLeft]}>密码：</Text>
            <Text style={[font.font18]}>{this.state.passWord}</Text>
          </View>
        </View>

        {/* 第三行 */}
        {/* <View style={styles.row}>
              <View style={[styles.mainBodyContent,{width:'50%'}]}>
                
              </View>
            </View>  */}

      </View>
    )
  }
  change(e) {
    if (this.state.editable == false) {
      this.setState({
        editable: true
      })
      e.setNativeProps({
        style: {
          borderWidth: 1,
          borderColor: "rgb(47,47,47)",
          borderRadius: 3,
          padding: 0,
          width: 120,
          height: 25,
        },
        editable: true
      })
    } else {
      this.setState({
        editable: false
      })
      e.setNativeProps({
        style: {
          borderWidth: 0,
          padding: 0,
          backgroundColor: "rgba(47,47,47,0)",
          width: 120,
          height: 25,
        },
        editable: false
      })
      this.updateMemberInfo()
    }
  }
  radioModal() {
    return (
      <RadioModal
        selectedValue={this.state.initId}
        onValueChange={(id, item) => this.setState({ initId: id, initItem: item }, () => this.updateMemberInfo())}
        selImg={require('../img/selImg.png')}
        seledImg={require('../img/seledImg.png')}
        style={{
          flexDirection: 'row', flexWrap: 'wrap',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        <Text value="0" style={{ width: 100 }}>男</Text>
        <Text value="1" style={{ width: 100 }}>女</Text>
      </RadioModal>
    )
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        <View style={[styles.top, color.borderBottom]}>
          <Text style={font.font20}>|&nbsp;&nbsp;个人中心</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.mainTop}>
            <Image
              style={styles.headPortrait}
              source={this.state.mbHeadUrl!=='' ? { uri: this.state.mbHeadUrl } : require('../img/text.jpg')}
            />
            <View style={styles.mainTopRight}>
              <Text style={font.font20Blue}>点击修改头像</Text>
              <Text style={font.font15NoBold}>支持jpg、jpeg、png类型文件</Text>
            </View>
          </View>

          {this.main()}
        </View>
        <Loading ref={r=>{this.Loading = r}} hide = {true} /> 
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '83%',
    paddingTop: 100,
    alignItems: 'center',
  },
  top: {
    position: "absolute",
    top: 0,
    width: '100%',
    height: 70,
    justifyContent: 'center',
    paddingLeft: 30
  },
  main: {
    padding: 70,
    width: '90%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  mainTop: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  headPortrait: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  mainTopRight: {
    justifyContent: 'space-around',
    marginLeft: 30,
  },
  mainBody: {
    marginBottom: 30,
    borderTopWidth: 1,
    borderColor: "rgb(110,110,110)"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  mainBodyContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  mainBodyContentLeft: {
    marginRight: 15,
  },
  textButton: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  textInput1: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: "rgba(47,47,47,0)",
    width: 120,
    height: 25,
  },
});

module.exports = PersonBodyRightOne;
