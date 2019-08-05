import React, { PureComponent, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  DeviceEventEmitter
} from "react-native";
//import SQLite from 'react-native-sqlite-2';
import { color, Button, NavigationItem, SpacingView } from "../widget";
import { Heading1, Heading2, Heading3, Paragraph } from "../widget/Text";

import { screen, system } from "../common";
import HomeMenuView from "./HomeMenuView";
import PartItemGridView from "./PartItemGridView";
import { StackActions, NavigationActions } from "react-navigation";
import { NativeModules } from "react-native";
import api from "../api";
import { storage } from "../common/storage";
import MenuView from "./MenuView";
let db;
type Props = {
  navigation: any
};
export default class PingJieScreen extends Component {
  listeners = {
    update: DeviceEventEmitter.addListener(
      "youxiEmitter",
      ({ ...passedArgs }) => {
        // alert("weikeEmitter params"+JSON.stringify(passedArgs))
        this.requestData();
        // let _key = passedArgs.highLightMenuId;
        // if (_key != "") {
        //     this.setState({
        //         currentId: _key,
        //     });
        // }

        // let _change = passedArgs.changeTab
        // if (_change != undefined) {
        //     this.setState({
        //         datas: [],
        //         tabVal: _change
        //     })
        //     storage.save("changeTab", "", _change)
        //     this.requestData(_change);
        // }
      }
    )
  };
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lodash
    _.each(this.listeners, listener => {
      listener.remove();
    });
  }
  componentDidMount() {
    // alert(JSON.stringify(this.props.navigation.state.params.obj))
    // this.deEmitter = DeviceEventEmitter.addListener('testBind', (data) => {
    //   NativeModules.MyDialogModel.showAlert(
    //     { title: '消息', message: data,buttonPositive:'haha',buttonNegative:'hehe' },
    //     (errorMsg) => console.warn(`Error ocurred: ${errorMsg}`),
    //     (action, buttonKey) => {
    //       console.log(`Action key == ${action}`);
    //       console.log(`Button key == ${buttonKey}`);
    //     })
    // });
  }
  async componentWillMount() {
    this.requestData();
  }
  requestData = async (params = "") => {
    // alert(111)
    let _id =
      this.props.navigation.state.params == undefined
        ? this.state.id
        : this.props.navigation.state.params.key;

    let _name =
      this.props.navigation.state.params == undefined
        ? this.state.name
        : this.props.navigation.state.params.name;
    //  alert("id"+_id)
    let getCacheObj = await storage.get("initStructData2", "");
    //    alert("cache data is"+JSON.stringify(getCacheObj))
    this.setState({
      datas: getCacheObj
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      contentViews: [],
      refresh: true,
      datas: []
    };
  }
  static navigationOptions = ({ navigation }: any) => ({
    headerStyle: {
      backgroundColor: color.primary
    }
  });

  checkMore() {
    this.props.navigation.navigate("MoreScreen");
  }
  changeContentType(type_id) {
    this.setState({
      type_id: type_id
    });
  }
  gotoDetailWeke() {
    this.props.navigation.navigate("MoreWeikeScreen");
  }

  changeTabList = async (navigation, _k, _n) => {
    // alert(111);
    if (_k == "3") {
      this.props.navigation.navigate("Tab2", { key: _k, name: _n });
    } else if (_k == "24") {
      this.props.navigation.navigate("Tab3", { key: _k, name: _n });
    } else if (_k == "44") {
      this.props.navigation.navigate("Tab4", { key: _k, name: _n });
    } else if (_k == "99") {
      navigation.navigate("Game", { key: _k, name: _n });
    } else {
      this.props.navigation.navigate("Tab", { key: _k, name: _n });
    }

    // this.getStorageByStructList("jubu")
  };
  render() {
    if (this.state.datas.length > 0) {
      const menuItems = this.state.datas
        .find(x => x.dict_value == "HDYX")
        .fyList.map((info, i) => {
          return (
            <TouchableOpacity
              onPress={() =>
                this.gotoDetailWeke(
                  this.state.datas.find(x => x.dict_value == "WKKC").appList
                )
              }
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: 900
              }}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-around",
                  margin: 20
                }}>
                <Image
                  source={{ uri: info.icon_base64 }}
                  style={{
                    width: 200,
                    height: 100
                  }}
                />

                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 20
                  }}>
                  {info.fy_name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        });
      const contentViews = this.state.datas
        .find(x => x.dict_value == "HDYX")
        .appList.map((content, i) => {
          return (
            <View
              style={{
                margin: 40,
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
                <Image
                  resizeMode="contain"
                  style={{
                    width: 100,
                    height: 100
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
      return (
        <View style={{ flex: 1 }}>
          <MenuView navigation={this.props.navigation} />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingTop: 130
            }}>
            {/* {menuItems} */}
          </View>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingTop: 30
              }}>
              {contentViews}
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <View />;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  contentContainer: {
    flexDirection: "row",
    borderBottomWidth: screen.onePixel,
    marginBottom: 15,
    borderColor: color.border,
    padding: 5,
    flexWrap: "wrap"
  },
  recommendHeader: {
    height: 35,
    justifyContent: "center",
    borderWidth: screen.onePixel,
    borderColor: color.border,
    paddingVertical: 8,
    paddingLeft: 20,
    backgroundColor: "white",
    flexDirection: "row"
  },
  titleContainer: {
    flex: 1,
    justifyContent: "space-between"
    // alignSelf: "center",
  },
  LoadingContainer: {
    width: screen.width,
    height: screen.height - 43.5
  },
  icon: {
    width: 100,
    height: 100
    // borderRadius: 40,
  },
  loadmore_view: {
    width: screen.width,
    height: 56,
    justifyContent: "center",
    alignItems: "center"
  },
  textAlign: {
    textAlign: "center"
  },
  itemGridContainer: {
    flex: 1
  },
  item_loadmore_text: {
    fontSize: 16
  },
  buyButtonContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  buyButton: {
    alignSelf: "flex-end",
    // justifyContent:"center",
    position: "absolute",
    left: 40,
    backgroundColor: color.primary,
    width: 94,
    height: 28,
    borderRadius: 7
  },
  itemsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: screen.width
  },
  contentIcon: {
    width: screen.width / 5,
    height: screen.width / 5
  }
});
