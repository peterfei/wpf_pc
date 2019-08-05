import React, { PureComponent } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PageControl from "react-native-page-control";

import { screen, system } from "../common";
import { color } from "../widget";
import HomeMenuItem from "./HomeMenuItem";
import { NativeModules } from "react-native";

type State = {
  currentPage: number
};

class HomeMenuView extends PureComponent<Props, State> {
  constructor(props: Object) {
    super(props);

    this.state = {
      currentPage: 0
    };
  }
  onMenuSelected = index => {
    alert(index);
  };

  render() {
    let { menuInfos } = this.props;

    // menuInfos = eval(menuInfos)
    // debugger
    let menuItems = menuInfos.map((info, i) => {
      return;
      <HomeMenuItem
        key={info.TypeName}
        title={info.TypeName}
        icon={info.ImgName}
        onPress={() => {
          // alert()
          NativeModules.MyDialogModel.SendMessageToUnity(info.TypeName);
        }}
      />;
    });

    let menuViews = [];
    let pageCount = Math.ceil(menuItems.length / 6);
    for (let i = 0; i < 1; i++) {
      let items = menuItems.slice(i * 6, i * 6 + menuItems.length);

      let menuView = (
        <View style={styles.itemsView} key={i}>
          {items}
        </View>
      );
      menuViews.push(menuView);
    }

    return <View style={styles.container}>{menuItems}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  itemsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: screen.width
  },
  pageControl: {
    margin: 0
  }
});

export default HomeMenuView;
