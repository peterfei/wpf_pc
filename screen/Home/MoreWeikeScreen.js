import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { screen, system } from "../common";
import { color, Separator, SpacingView } from "../widget";
type State = {
  infos: Array<Object>
};
type Props = {
  navigation: any
};
import api from "../api";
import { NativeModules } from "react-native";
import { Heading1, Heading2, Heading3, Paragraph } from "../widget/Text";

export default class MoreWeikeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type_id: 60,
      datas: []
    };
  }
  async componentWillMount() {
    // let initMyStruct = await api.initStructLists.filter(x=>x.dict_name_en=="kechen");
    // console.log('initMyStructLists is' + JSON.stringify(initMyStruct));
    // alert("Lists is" + JSON.stringify(this.props.navigation.state.params.obj))
    // if (Object.keys(initMyStruct).length > 0) {
    // debugger
    this.setState({
      datas: this.props.navigation.state.params.obj
    });
    // }
  }
  render() {
    if (this.state.datas.length > 0) {
      let _lists = this.state.datas;
      // alert("=====lists data is ====="+_lists.length)

      const contentViews = _lists.map((content, i) => {
        return (
          <View
            style={{
              marginLeft: 40,
              justifyContent: "center",
              borderBottomWidth: screen.onePixel,
              borderRightWidth: screen.onePixel,
              borderColor: color.border
            }}>
            <TouchableOpacity
              onPress={() => {
                delete content.first_icon_url;
                delete content.first_icon_url_base64;
                NativeModules.MyDialogModel.SendMessageToUnity(
                  JSON.stringify(content)
                );
              }}>
              {/**<TouchableOpacity  onPress={() =>NativeModules.MyDialogModel.SendMessageToUnity(content.struct_name.replace(/^\[(.*)\]/, ''))}>**/}
              <Image
                resizeMode="contain"
                style={{
                  width: 260,
                  height: 150
                }}
                source={{
                  uri: content.first_icon_url_base64
                }}
              />
              <Heading3> {content.struct_name} </Heading3>
            </TouchableOpacity>
          </View>
        );
      });
      // if(contentViews.length!=0){
      //   const contentViews = this.state.datas[0].StructList.filter(x=>x.fy_id==this.state.type_id)
      // }

      return (
        <ScrollView>
          <SpacingView />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingTop: 20
            }}>
            {contentViews}
          </View>
        </ScrollView>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Text> 暂无数据 </Text>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15
  }
});
