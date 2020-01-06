import React from "react";
import {
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Text,
    View,
    StyleSheet,
    Image,
    ImageBackground,
    Platform
} from "react-native";

export default class CouponCell extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            coupon: props.coupon,
            type: this.props.type, // action类型 可操作选中的  default 类型不可操作选中

        }
    }

    componentDidMount() {

    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            coupon: nextProps.coupon,
            type: nextProps.type
        })
    }

    selectCell() {
        let coupon = this.state.coupon;
        coupon.isSelect = !coupon.isSelect;
        this.setState({
            coupon: this.state.coupon
        })
        this.props.selectAction(coupon);
    }

    _renderImage() {
        let coupon = this.state.coupon;
        let isShow = this.state.type == 'action';
        let content = <Image source={coupon.isSelect ? require('../img/card_select.png') : require('../img/card_unselect.png')}
                             style={{width: 28, height: 28}}/>;
        if (!isShow) {
            content = null;
        }
        return content;
    }

    render() {
        let couponW = 400;
        let couponH = couponW * 2 / 7;    //保持宽高比7:2
        let leftW = couponW / 700 * 186;
        let rightW = couponW / 700 * 514;
        let coupon = this.state.coupon;
        // let price = parseInt(coupon.couponPrice);
        let price = coupon.couponPrice;
        let startT = coupon.getTime.slice(0, 10);
        let endT = coupon.expirTime.slice(0, 10);
        return (
          <TouchableOpacity style={{position: 'absolute',left: 20, bottom: '50%'}} activeOpacity={1} onPress={() => {this.selectCell()}}>
              <View style={{marginTop: 30, marginLeft: 25, marginRight: 25, flexDirection: 'row'}}>
                  <ImageBackground
                    source={require('../img/couponleft.png')} style={{width: leftW, height: couponH, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>¥{price}</Text>
                  </ImageBackground>
                  <ImageBackground
                    source={require('../img/couponright.png')} style={{width: rightW, height: couponH, flexDirection: 'row'}}>
                      <View style={{width: '100%', justifyContent: 'space-between'}}>
                          <View style={{marginLeft: 24, marginRight: 15}}>

                              <View style={{width: '100%',flexDirection: 'row', justifyContent: 'space-between', marginTop: 25,}}>
                                  <Text style={{fontSize: 20, color: '#DA6768', fontWeight: 'bold'}}>老用户专享优惠券</Text>
                                  {this._renderImage()}
                              </View>
                          </View>

                          <View style={{width: '100%', height: 0.5, backgroundColor: 'rgba(225,225,225,1)'}}/>
                          <View style={{justifyContent: 'center', marginLeft: 15}}>
                              <Text style={{fontSize: 15, color: '#343434'}}>有效期至 {endT}</Text>
                          </View>
                      </View>
                  </ImageBackground>
              </View>
          </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({



});
