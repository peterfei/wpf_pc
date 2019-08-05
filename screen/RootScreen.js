import { NativeModules, StatusBar } from "react-native";
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AppRegistry,
  Animated,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} from "react-native";
import color from "./widget/color";
import TabBarItem from "./widget/TabBarItem";
import {
  StackNavigator,
  TabNavigator,
  TabBarTop,
  createStackNavigator,
  TabBarBottom,
  NavigationActions
} from "react-navigation";

import HomeScreen from "./Home/HomeScreen";
import ProfileScreen from "./ProfileScreen";
import ShowDetailScreen from "./Home/ShowDetailScreen";
import MoreScreen from "./Home/MoreScreen";
import MoreWeikeScreen from "./Home/MoreWeikeScreen";
import PartDesectScreen from "./Home/PartDesectScreen";
import WeikeScreen from "./Home/WeikeScreen";
import PingJieScreen from "./Home/PingJieScreen";
import { Heading1, Heading2, Heading3, Paragraph } from "./widget/Text";
import { storage } from "./common/storage";
import { screen, system } from "./common";
import Login from "./Login/Login";
import EditNet from "./Home/EditNet";
import UnityView from "./widget/UnityView";

export default class Vesal_PC extends Component {
  listeners = {
    update: DeviceEventEmitter.addListener("testBind", data => {
      // alert(data);
      if (data == "hide") {
        this.setState({ isShow: true });
      } else {
        this.setState({ isShow: false });
      }
      // NativeModules.MyDialogModel.showAlert(
      //   {
      //     title: "消息",
      //     message: data,
      //     buttonPositive: "haha",
      //     buttonNegative: "hehe"
      //   },
      //   errorMsg => console.warn(`Error ocurred: ${errorMsg}`),
      //   (action, buttonKey) => {
      //     console.log(`Action key == ${action}`);
      //     console.log(`Button key == ${buttonKey}`);
      //   }
      // );
    })
  };
  // static navigationOptions = {
  //     headerStyle: {backgroundColor: 'white'},
  // };
  constructor(props) {
    super(props);
    this.state = {
      dpi_width: 0,
      dpi_height: 0,
      isShow: false,
      process_unity: false
    };
  }

  async componentDidMount() {
    let _check_unity = await NativeModules.MyDialogModel.checkUnityProcess();
    let mainHeight = await NativeModules.MyDialogModel.getMainHeight();
    let mainWidth = await NativeModules.MyDialogModel.getMainWidth();

    this.setState({
      process_unity: true,
      dpi_width: mainWidth,
      dpi_height: mainHeight
    });
  }
  render() {
    // let _unity_view = !this.state.isShow ? (
    //   <UnityView
    //     style={{
    //       width: 1680,
    //       height: 1050
    //     }}
    //   />
    // ) : (
    //   <UnityView style={{ width: 0, height: 0 }} />
    // );
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ flex: 1 }}>{_unity_view}</View> */}

        <View style={{ flex: 1 }}>
          <Navigator />
        </View>

        {/* {!this.state.process_unity ? _unity_view : null} */}
      </View>
    );
  }
}

function getCurrentRouteName(navigationState: any) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}
getStorageByStructList = async (params, id) => {
  // alert(params+id)
  let fy_id = await storage.get("tabTypeId" + params, "");
  // alert(fy_id)
  DeviceEventEmitter.emit("SetHighlightEmitter", {
    highLightMenuId: fy_id
    // changeTab: params,
  });

  // jumpToIndex(scene.index)
};
let Tab = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "人体构造",
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            //tintColor={tintColor}
            focused={focused}
            normalImage={require("./img/tabbar/tabbar_homepage.png")}
            selectedImage={require("./img/tabbar/tabbar_homepage.png")}
          />
        ),
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          this.getStorageByStructList("gouzao", "2");
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "Home",
              params: { key: "2", name: "gouzao" }
            })
          );
        }

        // headerStyle: { backgroundColor: "white" }
      })
    },

    // Weike: {
    //   screen: WeikeScreen,
    //   navigationOptions: ({ navigation }) => ({
    //     tabBarLabel: "微课课程",
    //     tabBarOnPress({ jumpToIndex, scene }) {
    //       console.log("====点击tabBar====" + JSON.stringify(scene));
    //       // this.getStorageByStructList("weike","2")
    //       DeviceEventEmitter.emit("weikeEmitter", {
    //         name: "weike",
    //         id: 2
    //       });
    //       // jumpToIndex(scene.index)
    //       navigation.dispatch(
    //         NavigationActions.navigate({
    //           routeName: "Weike",
    //           params: { key: "2", name: "weike" }
    //         })
    //       );
    //     }
    //   })
    // },
    PingJieScreen: {
      screen: PingJieScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "互动游戏",
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          DeviceEventEmitter.emit("youxiEmitter", {
            name: "youxi",
            id: 2
          });
          // jumpToIndex(scene.index)
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "PingJieScreen",
              params: { key: "2", name: "youxi" }
            })
          );
        }
      })
    }
  },
  {
    // initialRouteName: getInitialScreen("Login"),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    lazy: true,

    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 25,
        marginBottom: 5
      },
      hide: true,
      visible: true,
      showIcon: false,
      activeTintColor: "black",
      inactiveTintColor: "white",
      style: {
        backgroundColor: "#01f010"
      }
    }
  }
);
let Tab2 = TabNavigator(
  {
    Home2: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "人体构造",
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          this.getStorageByStructList("gouzao", "3");
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "Home2",
              params: { key: "3", name: "gouzao" }
            })
          );
        },

        headerStyle: { backgroundColor: "white" }
      })
    }
  },

  {
    tabBarComponent: TabBarBottom,
    // initialRouteName: getInitialScreen("Login"),
    tabBarPosition: "bottom",
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 18,
        marginBottom: 0,
        height: 0
      },
      showIcon: false,
      activeTintColor: color.primary,
      inactiveTintColor: color.gray,
      style: {
        backgroundColor: "#fff"
      }
    }
  }
);
let Tab3 = TabNavigator(
  {
    Home3: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "经络腧穴",
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          this.getStorageByStructList("xuewei", "24");
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "Home3",
              params: { key: "24", name: "xuewei" }
            })
          );
        },

        headerStyle: { backgroundColor: "white" }
      })
    }
  },
  {
    tabBarComponent: TabBarBottom,
    // initialRouteName: getInitialScreen("Login"),
    tabBarPosition: "bottom",
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 18,
        marginBottom: 10
      },
      showIcon: false,
      activeTintColor: color.primary,
      inactiveTintColor: color.gray,
      style: {
        backgroundColor: "#fff"
      }
    }
  }
);
let Tab4 = TabNavigator(
  {
    Home4: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "医用解剖",
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          this.getStorageByStructList("yiyong", "44");
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "Home4",
              params: { key: "44", name: "yiyong" }
            })
          );
        },

        headerStyle: { backgroundColor: "white" }
      })
    }
  },
  {
    tabBarComponent: TabBarBottom,
    // initialRouteName: getInitialScreen("Login"),
    tabBarPosition: "bottom",
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 18,
        marginBottom: 10
      },
      showIcon: false,
      activeTintColor: color.primary,
      inactiveTintColor: color.gray,
      style: {
        backgroundColor: "#fff"
      }
    }
  }
);

let Game = TabNavigator(
  {
    PingJieScreen: {
      screen: PingJieScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: false,
        tabBarLabel: "互动游戏",
        tabBarOnPress({ jumpToIndex, scene }) {
          console.log("====点击tabBar====" + JSON.stringify(scene));
          DeviceEventEmitter.emit("youxiEmitter", {
            name: "youxi",
            id: 2
          });
          // jumpToIndex(scene.index)
          navigation.dispatch(
            NavigationActions.navigate({
              routeName: "PingJieScreen",
              params: { key: "99", name: "youxi" }
            })
          );
        }
      })
    }
  },
  {
    // initialRouteName: getInitialScreen("Login"),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    lazy: true,

    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      labelStyle: {
        fontSize: 25,
        marginBottom: 5
      },
      hide: true,
      visible: true,
      showIcon: false,
      activeTintColor: "black",
      inactiveTintColor: "white",
      style: {
        backgroundColor: "#01f010"
      }
    }
  }
);
function getInitialScreen(params) {
  // alert(params + "========");
  // alert(111);
  return "Login";
  // if (params) {
  //   return params;
  // } else {
  //   return "Tab";
  // }
}

changeTabList = async (navigation, _k, _n) => {
  if (_k == "3") {
    navigation.navigate("Tab2", { key: _k, name: _n });
  } else if (_k == "24") {
    navigation.navigate("Tab3", { key: _k, name: _n });
  } else if (_k == "44") {
    navigation.navigate("Tab4", { key: _k, name: _n });
  } else if (_k == "2") {
    navigation.navigate("Game", { key: _k, name: _n });
  } else {
    navigation.navigate("Tab", { key: _k, name: _n });
  }

  // this.getStorageByStructList("jubu")
};
const Navigator = createStackNavigator(
  {
    Tab: {
      screen: Tab,
      navigationOptions: ({ navigation }) => ({
        title: "系统解剖",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        },
        tabBarVisible: false
      })
    },
    Tab2: {
      screen: Tab2,
      navigationOptions: ({ navigation }) => ({
        title: "局部解剖",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        }
      })
    },
    Tab3: {
      screen: Tab3,
      navigationOptions: ({ navigation }) => ({
        title: "经络腧穴",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        }
      })
    },
    Tab4: {
      screen: Tab4,
      navigationOptions: ({ navigation }) => ({
        title: "医用解剖",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        }
      })
    },
    Game: {
      screen: Game,
      navigationOptions: ({ navigation }) => ({
        title: "游戏",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        }
      })
    },

    WeikeScreen: {
      screen: WeikeScreen,
      navigationOptions: ({ navigation }) => ({
        title: "微课",
        headerLeft: null,
        headerTitleStyle: {
          alignSelf: "center",
          justifyContent: "center",
          // fontFamily: "\5FAE\8F6F\96C5\9ED1",
          fontWeight: "bold"
        }
      })
    },

    ShowDetailScreen: {
      screen: ShowDetailScreen
    },
    HomeScreen: {
      screen: HomeScreen
    },
    MoreScreen: { screen: MoreScreen },
    MoreWeikeScreen: { screen: MoreWeikeScreen },
    Login: { screen: Login },
    EditNet: { screen: EditNet }
  },
  {
    navigationOptions: {
      header: null,
      headerStyle: {
        // backgroundColor: color.primary,
      },
      headerBackTitle: null,
      headerTintColor: "#333333",
      showIcon: true,
      // 开启动画
      animationEnabled: false,
      // 开启边缘触摸返回
      gesturesEnabled: false
    },
    initialRouteName: getInitialScreen("Login"),
    modal: "card",
    lazy: false
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  searchBar: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: color.primary,
    width: 300
    // alignSelf: "center"
  }
});
console.disableYellowBox = true;
