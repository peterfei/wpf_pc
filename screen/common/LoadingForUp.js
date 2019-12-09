
/**
 * 调用说明：
 * <Loading ref={r=>{this.Loading = r}} hide = {true} /> //放在布局的最后即可
 *
 * 需要alertChoose(可选择方法) 添加<Loading ref={r=>{this.Loading = r}} hide = {true} yes={()=>{方法}} navigation={this.props.navigation} />
 * 在需要alertChoose地方this.Loading.alertChoose('提示内容');
 * 返回登录页面方法this.Loading.logout();
 *
 * 在需要显示提示的地方调用this.Loading.show();
 * 在需要隐藏提示的地方调用this.Loading.close();
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types'

import { StackActions, NavigationActions } from 'react-navigation';
import { storage } from "../Public/storage";

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: "请求中",
            alertChoose: false,
        }
    }

    close() {
        this.setState({ modalVisible: false });
    }

    show(title) {
        this.setState({ modalVisible: true, title: title });
    }

    alertChoose(title) {
        this.setState({ alertChoose: true, title: title });
    }
    logout() {
        storage.clearMapForKey("userName")
        storage.clearMapForKey("password");
        storage.clearMapForKey("token");
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Login" })]
        });
        this.props.navigation.dispatch(resetAction);
    }
    no() {
        this.setState({ alertChoose: false });
    }
    render() {
        if (this.state.alertChoose) {
            return (
                <View style={{ position: 'absolute' ,backgroundColor:'rgba(0,0,0,0.3)', width: '100%', height: '100%', alignItems: 'flex-end', justifyContent: 'flex-end',flexDirection: 'column', zIndex: 9999999 }}>
                    <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.8)', backgroundColor: 'rgb(255,255,255)', width: 300, height: 160 }}>
                        <View style={{ margin: 5,flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{margin: 5,fontSize:13}}>提醒</Text>
                            <TouchableOpacity onPress={() => { this.no() }} >
                                <Image style={{ width: 25, height: 25 }} source={require('../img/cclose.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', flex: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(96,96,96)' }}>
                            <Text style={{ color: "rgb(255,255,255)" }}>{this.state.title}</Text>
                        </View>
                        <View style={{ width: '100%', flex: 2, borderBottomLeftRadius:5,borderBottomRightRadius:5,backgroundColor: 'rgb(96,96,96)', justifyContent: 'space-around', flexDirection: 'row',alignItems:'center' }}>
                            <TouchableOpacity style={{ padding: 5, paddingLeft: 20, paddingRight: 20,backgroundColor:'white',borderRadius:3 }} onPress={() => { this.props.yes() }}>
                                <Text style={{ color: "back" }}>确定</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 5, paddingLeft: 20, paddingRight: 20,backgroundColor:'white',borderRadius:3 }} onPress={() => { this.no() }}>
                                <Text style={{ color: "back" }}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        if (!this.state.modalVisible) {
            return null
        }
        return (
            <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.8)', backgroundColor: 'rgba(78,78,78,0.8)', width: 200, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: "white" }}>{this.state.title}</Text>
                </View>
            </View>
        );
    }
}

Loading.PropTypes = {
    hide: PropTypes.bool.isRequired,
};
