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
  DeviceEventEmitter,
  ActivityIndicator,
  NetInfo
} from "react-native";
import {
  color,
  Button,
  NavigationItem,
  SpacingView,
  Separator
} from "../widget";
import { Heading1, Heading2, Heading3, Paragraph, Tip } from "../widget/Text";

import { screen, system } from "../common";
import HomeMenuView from "./HomeMenuView";
import PartItemGridView from "./PartItemGridView";
import { StackActions, NavigationActions } from "react-navigation";
import { NativeModules } from "react-native";
import api from "../api";
import Icon from "react-native-vector-icons/FontAwesome";
import { storage } from "../common/storage";
// import SpacingView from "../widget/SpacingView";
// import Icon from "react-native-vector-icons/FontAwesome";
import UnityView from "../widget/UnityView";
import MenuView from "./MenuView";

let db;
type Props = {
  navigation: any
};
let temp_dpi = "";
export default class HomeScreen extends Component {
  listeners = {
    update: DeviceEventEmitter.addListener(
      "SetHighlightEmitter",
      ({ ...passedArgs }) => {
        let _key = passedArgs.highLightMenuId;
        if (_key != "") {
          this.setState({
            currentId: _key
          });
        }
      }
    )
  };
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lodash
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }
  async componentDidMount() {
    let _check_unity = await NativeModules.MyDialogModel.checkUnityProcess();
    if (_check_unity) {
      this.setState({
        process_unity: true
      });
    }

    let tokens = await storage.get("userTokens", "");

    if (tokens == -1 || tokens == -2) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Login" })]
      });
      this.props.navigation.dispatch(resetAction);
    }
    let deviceInfo = await NativeModules.DeviceInfoG;
    let myIp = await deviceInfo.GetLocalIpAddress();
    // alert(`user's ip is ${myIp}`);
    this.setState({
      myIp: myIp
    });
    let mainHeight = await NativeModules.MyDialogModel.getMainHeight();
    let mainWidth = await NativeModules.MyDialogModel.getMainWidth();

    this.setState({
      dpi: dpi,
      dpi_width: mainWidth,
      dpi_height: mainHeight,
      isTeacher: tokens.member.mbParentId == 1 ? true : false
    });
    // temp_dpi = this.state.dpi;
  }
  async componentWillMount() {
    this.requestData();
  }
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      menuInfos: [],
      refresh: true,
      type_id: 5,
      menu_key: "gouzao",
      currentId: "",
      tabVal: "2",
      isClick: true,
      msg: "",
      flClick: true,
      myIp: "",
      dpi_width: "",
      dpi_height: "",
      dpi: "",
      isTeacher: 0,
      isShow: false,
      process_unity: false
    };
  }

  static navigationOptions = ({ navigation }: any) => ({
    headerRight: (
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => {
          navigation.navigate("TagList");
        }}>
        <Image
          source={require("../img/mine/icon_mine_mineorder.png")}
          style={styles.searchIcon}
        />
        <Paragraph> 查看标签 </Paragraph>
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: "white"
    }
  });

  requestData = async (params = "") => {
    let _id =
      this.props.navigation.state.params == undefined
        ? this.state.tabVal
        : this.props.navigation.state.params.key;

    let _version = -1;
    let struct_version = await storage.get("initStructVersion" + _id, "");
    console.log("*******struct Version*****" + struct_version);
    if (struct_version != null) {
      _version = struct_version;
    }
    this.setState({
      menu_key:
        this.props.navigation.state.params == undefined
          ? this.state.menu_key
          : this.props.navigation.state.params.name
      // currentId: storage
    });
    let _fy_id = await storage.get("tabTypeId" + this.state.menu_key, "");

    this.setState({ currentId: _fy_id, type_id: _fy_id });
    console.log("***读取线上***");
    const url =
      api.base_uri +
      "/v1/app/struct/getPcInitData?fyId=" +
      _id +
      "&version=" +
      _version +
      "&appVersion=3.2.0";
    // alert("***url***" + url);
    let responseData = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*"
      }
    })
      .then(resp => resp.json())
      .then(
        result => {
          // debugger;
          if (result && result.List != null) {
            if (struct_version != null) {
              storage.remove("initStructData" + _id);
              storage.remove("initStructVersion" + _id);
            }

            storage.save("initStructVersion" + _id, "", result.maxVersion);
            storage.save("initStructData" + _id, "", result.List);
          } else {
            //  alert("***数据为空,读取缓存***")
          }
        },
        error => {
          console.log("================取自缓存====================");
        }
      );
    let getCacheObj = await storage.get("initStructData" + _id, "");
    console.log("getCacheObj is" + JSON.stringify(getCacheObj));
    this.setState({
      datas: getCacheObj
    });
  };
  checkMore() {
    this.props.navigation.navigate("MoreScreen");
  }
  changeContentType(type_id) {
    // alert("menuKey" + this.state.menu_key);
    this.setState({
      type_id: type_id,
      currentId: type_id
      // datas:[],
    });
    /**
     * Set cache
     */
    // 缓存高亮设置
    storage.remove("tabTypeId" + this.state.menu_key);
    // alert(this.state.menu_key + type_id)
    storage.save("tabTypeId" + this.state.menu_key, "", type_id);
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  changeTabList = async (navigation, _k, _n) => {
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
      // debugger
      const menuItems = this.state.datas
        .find(x => x.dict_value)
        .fyList.map((info, i) => {
          return (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                opacity: 1
              }}
              onPress={() => {
                let _datas = this.state.datas;
                if (this.state.flClick) {
                  this.setState({ flClick: false });
                  this.changeContentType(info.fy_id);
                  let _cur = this;
                  setTimeout(function() {
                    _cur.setState({
                      flClick: true,
                      msg: "",
                      datas: _datas
                    });
                  }, 1000);
                } else {
                  // this.state.datas
                  this.setState({
                    datas: [],
                    msg: "数据加载中,请稍后..."
                  });
                }
              }}>
              <Image
                resizeMode="contain"
                style={[styles.icon, {}]}
                source={{
                  uri:
                    info.fy_id === this.state.currentId
                      ? info.icon_base64
                      : info.icon_two_base64,
                  cache: "force-cache"
                }}
              />
              <Heading3
                style={{
                  color: info.fy_id === this.state.currentId ? "red" : "black"
                }}>
                {info.fy_name}
              </Heading3>
            </TouchableOpacity>
          );
        });

      const _lists = this.state.datas[0].appList.filter(
        x => x.fy_id == this.state.type_id
      );

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
              onPress={async () => {
                let curr = this;

                if (curr.state.isClick) {
                  curr.setState({
                    isShow: false,
                    isClick: false,
                    msg: "正在进入模型 [" + content.struct_name + "],请稍等..."
                  });
                  let _content = Object.assign(
                    {
                      width: await NativeModules.MyDialogModel.getMainWidth(),
                      height: await NativeModules.MyDialogModel.getMainHeight()
                    },
                    content
                  );
                  // alert("content is "+JSON.stringify(_content))
                  delete _content.first_icon_url;
                  delete _content.first_icon_url_base64;
                  delete _content.Introduce;
                  // alert(`点击模型${JSON.stringify(_content)}`);
                  NativeModules.MyDialogModel.SendMessageToUnity(
                    JSON.stringify(_content)
                  );

                  setTimeout(function() {
                    curr.setState({
                      isClick: true,
                      msg: ""
                      // isShow: false
                    });
                  }, 1000);
                }
              }}>
              <Image
                resizeMode="contain"
                style={{
                  width: 150,
                  height: 150
                }}
                source={{
                  uri: content.first_icon_url_base64
                }}
              />
              <Heading3 style={{ textAlign: "center", marginTop: 6 }}>
                {content.struct_name}
              </Heading3>
            </TouchableOpacity>
          </View>
        );
      });
      // let _unity_view = !this.state.isShow ? (
      //   <UnityView
      //     style={{
      //       width: this.state.dpi_width == "" ? 1680 : this.state.dpi_width,
      //       height: this.state.dpi_height == "" ? 1050 : this.state.dpi_height
      //     }}
      //   />
      // ) : (
      //   <UnityView style={{ width: 0, height: 0 }} />
      // );
      return (
        <View style={{ flex: 1 }}>
          {/* {!this.state.process_unity ? _unity_view : null} */}
          {/* {_unity_view} */}
          <MenuView navigation={this.props.navigation} />
          <SpacingView />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingTop: 130
            }}>
            {menuItems}
          </View>

          <SpacingView />
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingTop: 30
              }}>
              {contentViews}
            </View>
            <View>
              <Text
                style={{
                  fontSize: "20",
                  color: "red",
                  marginTop: 20,
                  padding: 10,
                  textAlign: "center"
                }}>
                {this.state.msg}
              </Text>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Text> 加载数据中...</Text>
        </View>
      );
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
    width: 80,
    height: 80
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
  },
  searchBar: {
    //width: screen.width * 0.65,
    //height: 30,
    //borderRadius: 19,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    alignSelf: "flex-end",
    marginRight: 20
  },
  searchIcon: {
    width: 20,
    height: 20,
    margin: 5
  }
});
