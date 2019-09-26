import React, { Component } from "react";
import { View, NativeModules,DeviceEventEmitter } from "react-native";
import { boneData } from "./BoneData"
import SearchBone from './SearchBone'

export default class SearchScreen extends Component {

    static navigationOptions = {
        header: null
    };

    closeSearch() {
        this.props.navigation.goBack();
        this.timer = setTimeout(() => {
            DeviceEventEmitter.emit("UnityWinEmitter", { modalVisible: "flex" });
        }, 500);
    }
    clickItem() {
        this.closeSearch();
    }
    sendMsgToUnity(name, info) {
        let _content = { 'type': name, 'data': info }
        NativeModules.MyDialogModel.SendMessageToUnity(
            JSON.stringify(_content)
        );
    }
    render() {
        //alert(JSON.stringify(boneData[0].val))
        return (
            <View style={{ width: '100%', height: '100%', }}>
                <SearchBone
                    sendMsgToUnity={(name, info) => this.sendMsgToUnity(name, info)}
                    searchData={boneData[0].val}
                    closeSearch={() => this.closeSearch()}
                    clickItem={() => this.clickItem()}
                />
            </View>
        )
    }


}
