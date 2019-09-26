import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, DeviceEventEmitter, Alert
} from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import { PersonBodyLeft, PersonBodyRightOne, PersonBodyRightTwo, PersonBodyRightThree, PersonTop } from "./index";
import PersonBodyRightFour from '../Oder/PersonBodyRightFour';
import _ from "lodash";
import PhoneNumberView from './PhoneNumberView';
import PasswordView from './PasswordView';
import { storage } from "../Public/storage";
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
      listener[0].remove(); listener[1].remove(); listener[2].remove();
    });
    this.timer && clearInterval(this.timer);
  }

  PersonBodyRight() {
    if (this.state.num == 0) {
      return (
        <PersonBodyRightOne />
      )
    } else if (this.state.num == 1) {
      return (
        <PersonBodyRightTwo />
      )
    } else if (this.state.num == 2) {
      return (
        <PersonBodyRightThree />
      )
    } else if (this.state.num == 3) {
      return (
        <PersonBodyRightFour />
      )
    } else {
      storage.clearMapForKey("userName")
      storage.clearMapForKey("password");
      storage.clearMapForKey("token");
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "Login" })]
      });
      this.props.navigation.dispatch(resetAction);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.changeView()}
        <PersonTop navigation={this.props.navigation} />
        {/* Body */}
        <View style={styles.body}>
          <PersonBodyLeft />
          {this.PersonBodyRight()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "rgb(16,16,16)"
  },
  body: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
});