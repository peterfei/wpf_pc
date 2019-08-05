import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewPropTypes
} from "react-native";
import { Heading2, Heading3, Paragraph } from "./Text";
// import Separator from './Separator'
import { screen, system } from "../common";

type Props = {
  image?: any,
  style?: ViewPropTypes.style,
  title: string,
  subtitle?: string
};

type Props = {
  navigation: any
};

class DetailCell extends PureComponent<Props> {
  constructor(props: Object) {
    super(props);
  }

  render() {
    let icon = this.props.image && (
      <Image style={styles.icon} source={this.props.image} />
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate(this.props.name);
          }}>
          <View style={[styles.content, this.props.style]}>
            {icon}
            <Heading3>{this.props.title}</Heading3>
            <View
              style={{
                flex: 1,
                backgroundColor: "blue"
              }}
            />
            <Paragraph
              style={{
                color: "#999999"
              }}>
              {this.props.subtitle}
            </Paragraph>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  content: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 10
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  arrow: {
    width: 14,
    height: 14,
    marginLeft: 5
  }
});

export default DetailCell;
