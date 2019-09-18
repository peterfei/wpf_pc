
/**
 * 调用说明：
 * <Loading ref={r=>{this.Loading = r}} hide = {true} /> //放在布局的最后即可
 * 在需要显示的地方调用this.Loading.show();
 * 在需要隐藏的地方调用this.Loading.close();
 */

import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

import PropTypes from 'prop-types'

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: "请求中"
        }
    }

    close() {
        this.setState({ modalVisible: false });
    }

    show(title) {
        this.setState({ modalVisible: true, title: title });
    }

    render() {
        if (!this.state.modalVisible) {
            return null
        }
        let title = this.props.title
        return (
            <View style={{ position:'absolute',width:'100%',height:'100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ borderRadius: 10,borderWidth:1,borderColor:'rgb(13,192,217)', backgroundColor: 'rgb(78,78,78)', width: 150, height: 50,justifyContent: 'center' ,alignItems: 'center' }}>
                    <Text style={{ color: "white" }}>{this.state.title}</Text>
                </View>
            </View>
        );
    }
}

Loading.PropTypes = {
    hide: PropTypes.bool.isRequired,
};