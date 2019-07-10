/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,
  TouchableHighlight
} from 'react-native';

import UnityView from "../../UnityView";


export default class MainScreen extends Component {
  static navigationOptions = {
    title:'Main',
  }
  state = {
    modalVisible: "flex",
    width:600,
    height:600,
    currentIndex:"Main",
  };
  showPerson(){
    this.setState({
      currentIndex:"Person",
      modalVisible:"none"
    });
    this.props.navigation.navigate('Person');
  };
  showMalls(){
    this.setState({
      currentIndex:"Malls",
      modalVisible:"none"
    });
    this.props.navigation.navigate('Malls');
  };

  render() {
    return (
      <View style={styles.container}>
          <UnityView   
            height={this.state.height}
            width={this.state.width}
            display={this.state.modalVisible}
            opacity={0.1}
            zIndex={-9999999}
            >
          </UnityView>

        {/* 1.1.主界面按钮 */}
        <View style={{
                    display: (this.state.currentIndex==="Main") ? "flex" : "none",
                    position: (this.state.currentIndex==="Main") ? "absolute" : "relative",
                    right:50,
                    top:50,
                    }}>
                <TouchableHighlight
                  onPress={() => {
                    this.showPerson();
                  }}
                >
                  <Text style={{fontWeight:'bold'}}>个人中心</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this.props.navigation.navigate('Person');
                  }}
                >
                  <Text style={{fontWeight:'bold'}}>商城</Text>
                </TouchableHighlight>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  component:{
    flex: 1,
    width:"100%",
    height:"100%",
    justifyContent: 'center',
    alignItems: 'center',
  }
});
