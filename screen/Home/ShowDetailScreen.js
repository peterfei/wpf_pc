import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { screen, system } from "../common";
import { color, Separator, SpacingView } from "../widget";
type State = {
  infos: Array<Object>
};
type Props = {
  navigation: any
};
export default class ShowDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infos: []
    };
  }
  componentDidCatch(error, info) {
    console.log("_______DID CATCH____________");
    console.log(error);
    console.log(info);
  }
  componentDidMount() {
    this.setState({
      infos: this.props.navigation.state.params.obj
    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.containerHeader}>
          <Image
            style={styles.icon}
            source={{ uri: this.state.infos.FirstIconUrl }}
          />
          <Text style={styles.titleView}>{this.state.infos.StructName}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15
  },
  containerHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  containerContent: {
    flex: 1
  },
  icon: {
    flex: 1,
    width: screen.width * 0.35,
    height: screen.width * 0.35,
    borderRadius: 12.5,
    resizeMode: "contain"
    // objectFit: 'contain'
  },

  titleView: {
    flex: 1,
    alignSelf: "flex-start",
    margin: 10
  },

  actionbarContainer: {
    flex: 1,
    width: screen.width,
    zIndex: 1
  },
  absoluteContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
});
