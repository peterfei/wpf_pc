import React,{ Component } from "react";
import { Platform, StyleSheet, Text, View,Image,
  TouchableHighlight ,ScrollView,Dimensions} from "react-native";

import { color} from "./index";
import {font} from "../Public";

  //商城主体
class MallsBody extends Component {
  state={
    currentIndex:'个人中心',
    isLabel:{},
    data:[{
      'title':'系统解剖全集',
      'intro':'全面升级，全面提供了携带知识库的肌肉系统',
      'price':'$99.99  1/年',
      'num':'0',
      },{
      'title':'局部解剖全集',
      'intro':'真实数据局部切割逐层剥离，局解学习神器',
      'price':'$99.99  1/年',
      'num':'1',
      },{
      'title':'经络俞穴',
      'intro':'针灸模式，真正直观，易学易用',
      'price':'$99.99  1/年',
      'num':'2',
      },{
      'title':'解剖全集',
      'intro':'全面升级，全面提供了携带知识库的肌肉系统',
      'price':'$199.99  1/年',
      'num':'3',
      }
      ],
    //activePage=0,
      width:1024,
      height:768,
  }
  componentWillMount(){
    this.time = setInterval(
      () => { 
        let width=Dimensions.get('window').width;
        let height=Dimensions.get('window').height;
        if(width != null && width != '' && height != null && height != ''){
          this.setState({
            width:width,
            height:height,
          });
        }else{
          this.setState({
            width:1024,
            height:768,
          });
        }
        
      }
    );
  }
  componentWillUnmount(){
    this.time && clearTimeout(this.time);
  }
  // componentWillUnmount(){
  //   this.time && setInterval(this.time);
  // }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.imgBackGround}
          source={require('../../img/text.jpg')}
        />
        <View style={[styles.container,color.rightBackground]}>
        </View>

        <View style={styles.content}>
          <View  style={{width:"6%",height:200}}></View>
          <TouchableHighlight onPress={() =>this.moveCommodityLeft()}>
            <Image
              style={styles.leftRightImg}
              source={require('../../img/leftImg.png')}
            />
          </TouchableHighlight>

          <ScrollView horizontal={true} 
            ref='ScrollView'
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            //onMomentumScrollEnd={this.onScrollAnimationEnd}
            style={styles.commodity}>
            {this.renderCommodity()}
          </ScrollView>

          <TouchableHighlight onPress={() =>this.moveCommodityRight()}>
            <Image
              style={styles.leftRightImg}
              source={require('../../img/rightImg.png')}
            />
          </TouchableHighlight>
          <View  style={{width:"6%",height:200}}></View>
        </View>

        {/* <View style={styles.bottom}>
          {this.renderIndicator()}
        </View> */}

      </View>
      
    );
  }

  renderCommodity(){
    let itemArr =[];
    let data=this.state.data
    for(let i=0;i<data.length;i++){
      itemArr.push(
        <View key={i} style={{flex:1,margin:0,marginLeft:10,marginRight:10}}>
          <View style={[styles.commodityInformation,color.borderBackground,{width:this.state.width*0.2}]}>
            <Text style={font.font25}>{data[i].title}</Text>
            <Text style={font.font20NoBold}>{data[i].intro}</Text>
            <Text style={font.font20NoBoldRed}>{data[i].price}</Text>
            <TouchableHighlight onPress={() => this.change(data[i].num)} style={styles.button}>
              <Text style={{fontSize:16}}>立即购买</Text>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    return itemArr;
  }
  change(num){
    this.props.navigation.navigate('Pay',{num:num});
  }
  //this.props.navigation.navigate('Pay');

  //页码
  // renderIndicator(){
  //   let indicator=[],style;
  //   for(let i=0;i<data.length/3;i++){
  //     style=(i===this.state.activePage)?{color:"red"}:{color:"white"}
  //     indicator.push(
  //       <Text key={i} style={[font.font30,style]}>&bull;</Text>
  //     )
  //   }
  // }
  // onScrollAnimationEnd(e){
  //   let currentPage =Math.floor(e.nativeEvent.contentOffset.x/ 除以一页的width);
  //   this.setState({
  //     activePage=currentPage
  //   }) 
  // }
  moveCommodityLeft(){
      this.refs.ScrollView.scrollTo({x: -800, y: 0, animated: true})
  }
  moveCommodityRight(){
      this.refs.ScrollView.scrollTo({x: 800, y: 0, animated: true})
  }

}

const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
  },
  imgBackGround:{
    height:'37%',
    width:'100%',
  },
  content:{
    position:"absolute",
    top:'-3%',
    height:'100%',
    width:'100%',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection:'row',
  },
  leftRightImg:{
    width:80,
    height:80,
  },
  commodity:{
    marginLeft:'3%',
    marginRight:'3%',
    //justifyContent: 'space-between', 
    //alignItems: 'center',
    //flexDirection:'row',
     width:'66%',
     margin:0,
     height:'60%',
  },
  bottom:{
    position:"absolute",
    bottom:'15%',
    width:'100%',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection:'row',
  },
  commodityInformation:{
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingLeft:'5%',
    paddingRight:'5%',
    height:'96%',
    borderRadius:5,
    borderColor:'rgb(13,192,217)',
    borderWidth:2,
    margin:0,
  },
  button:{
    backgroundColor:'white',
    borderRadius:3,
    width:'70%',
    height:40,
    justifyContent: 'center', 
    alignItems: 'center',
  },
});

module.exports = MallsBody;
