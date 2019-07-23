import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,ImageBackground } from "react-native";


  //初始化页面
export default class RegisterScreen extends Component {
  static navigationOptions = {
    title:'Initialize',
  }
  componentDidMount(){
            setTimeout(()=>{
              this.props.navigation.navigate('Login');
            },2000)
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../img/background.png')}>
            <Text>加载页面2S……</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%'
  },
  background:{
    flex: 1,
    width:'100%',
    height:'100%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
});