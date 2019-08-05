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
  Animated
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
let db;
type Props = {
  navigation: any
};
export default class TestDesectScreen extends Component {
  componentDidMount() {
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
    this.setState({
      contentViews: api.content_test_desect,
      type_id: 1
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      contentViews: [],
      refresh: true
    };
  }
  static navigationOptions = ({ navigation }: any) => ({
    headerStyle: {
      backgroundColor: color.primary
    },
    headerMode: "none",
    header: null
  });

  checkMore() {
    this.props.navigation.navigate("MoreScreen");
  }
  changeContentType(type_id) {
    this.setState({
      type_id: type_id
    });
  }
  render() {
    if (this.state.refresh) {
      // debugger
      let _this = this;
      setTimeout(function() {
        _this.setState({
          refresh: false
        });
      }, 100);
    }

    const contentViews = this.state.contentViews.map((content, i) => {
      return (
        <View
          style={{
            marginLeft: 50,
            justifyContent: "center",
            justifyContent: "center",
            borderBottomWidth: screen.onePixel,
            borderRightWidth: screen.onePixel,
            borderColor: color.border
          }}>
          <TouchableOpacity
            onPress={() =>
              NativeModules.MyDialogModel.SendMessageToUnity(
                content.struct_name.replace(/^\[(.*)\]/, "")
              )
            }>
            <Image
              resizeMode="contain"
              style={{ width: 260, height: 150 }}
              source={content.icon}
            />
            <Heading3>{content.struct_name}</Heading3>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View>
        <SpacingView />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {contentViews}
        </View>
      </View>
    );
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
