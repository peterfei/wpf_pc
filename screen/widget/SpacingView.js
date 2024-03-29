import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";

import color from "./color";

class SpacingView extends PureComponent<{}> {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 5,
    backgroundColor: color.paper
  }
});

export default SpacingView;
