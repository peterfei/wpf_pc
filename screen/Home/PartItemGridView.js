import React, { PureComponent } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Button
} from "react-native";
import { color, Separator } from "../widget";
import { screen, system } from "../common";
import { Heading2, Heading3 } from "../widget/Text";
import { createStackNavigator } from "react-navigation";

type Props = {
  peopleDatas: Array<Object>,
  navigation: any
};
type State = {
  currentPage: number
};

export default class PartItemGridView extends PureComponent<Props> {
  constructor(props: Object) {
    super(props);
    this.state = {
      currentPage: 0
    };
  }

  detailInfo(objId) {
    alert(objId);
  }
  render() {
    let { peopleDatas } = this.props;
    peopleDatas = peopleDatas.filter(x => x != null);
    console.log("peopleDatasis" + JSON.stringify(peopleDatas));
    let menuItems = peopleDatas.map((info, i) => (
      <TouchableOpacity
        style={styles.eleContainer}
        onPress={() =>
          this.props.navigation.navigate("ShowDetailScreen", { obj: info })
        }>
        <Image
          resizeMode="contain"
          style={styles.icon}
          source={{ uri: info.FirstIconUrl }}
        />
        <Heading3
          style={{
            marginTop: 5,
            position: "absolute",
            top: screen.width / 5 - 25
          }}>
          {info.StructName}
        </Heading3>
      </TouchableOpacity>
    ));

    let menuViews = [];
    let pageCount = Math.ceil(menuItems.length / 4);

    for (let i = 0; i < pageCount; i++) {
      let items = menuItems.slice(i * 4, i * 4 + 4);

      let menuView = (
        <View style={styles.itemsView} key={i}>
          {items}
        </View>
      );
      menuViews.push(menuView);
    }

    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>{menuViews}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  menuContainer: {
    flexDirection: "row"
  },
  icon: {
    width: screen.width / 5 - screen.onePixel * 2,
    height: screen.width / 4 - screen.onePixel * 2
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: screen.onePixel,
    borderRightWidth: screen.onePixel,
    borderColor: color.border

    // width: screen.width,
  },
  eleContainer: {
    // flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    width: screen.width / 4,
    height: screen.width / 5,
    borderBottomWidth: screen.onePixel,
    borderRightWidth: screen.onePixel,
    borderColor: color.border
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
