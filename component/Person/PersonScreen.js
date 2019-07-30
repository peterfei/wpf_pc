import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, DeviceEventEmitter
} from "react-native";

import { PersonBodyLeft, PersonBodyRight1, PersonBodyRight2, PersonBodyRight3, PersonTop } from "./index";
import _ from "lodash";
import PhoneNumberView from './PhoneNumberView';
import PasswordView from './PasswordView'

//个人中心
export default class PersonScreen extends Component {
  static navigationOptions = {
    title: 'Person',
  }
  listeners = {
    update: [DeviceEventEmitter.addListener("PersonBodyRightNum",
      ({ ...passedArgs }) => {
        let _key = passedArgs.num;
        this.setState({
          num: _key
        });
      }
    ),
    DeviceEventEmitter.addListener("changephoneNumberView",
      ({ ...passedArgs }) => {
        if (passedArgs.changephoneNumberView == true) {
          this.setState({
            changephoneNumberView: true
          })
        } else {
          this.setState({
            changephoneNumberView: false
          })
        }
      }
    ),
    DeviceEventEmitter.addListener("changePasswordView",
      ({ ...passedArgs }) => {
        if (passedArgs.changePasswordView == true) {
          this.setState({
            changePasswordView: true
          })
        } else {
          this.setState({
            changePasswordView: false
          })
        }
      }
    ),
    ]
  }
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      changephoneNumberView: false,
      changePasswordView: false
    };
  }
  changeView() {
    if (this.state.changephoneNumberView) {
      return (
        <PhoneNumberView />
      )
    } if (this.state.changePasswordView) {
      return (
        <PasswordView />
      )
    }
  }
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lodash
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        {this.changeView()}
        <PersonTop navigation={this.props.navigation} />
        {/* Body */}
        <View style={styles.body}>
          <Text>{this.state.currentIndex}</Text>
          <PersonBodyLeft />
          {this.PersonBodyRight()}
        </View>
      </View>
    );
  }
  PersonBodyRight() {
    if (this.state.num == 0) {
      return (
        <PersonBodyRight1 />
      )
    } else if (this.state.num == 1) {
      return (
        <PersonBodyRight2 />
      )
    } else {
      return (
        <PersonBodyRight3 />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  body: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
});