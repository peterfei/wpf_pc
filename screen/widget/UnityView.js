import { PropTypes, Component } from "react";
import { requireNativeComponent, View, ViewPropTypes } from "react-native";

class UnityView extends Component {
  render() {
    return <RCTUnityView {...this.props}  />;
  }
}
module.exports = requireNativeComponent("RCTUnityView", UnityView);
