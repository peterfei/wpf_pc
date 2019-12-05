import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { NativeModules } from "react-native"
import Loading from "./LoadingForUp";
import api from "../api"

export default class UpgradePC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: 'PC程序更新',
            pc_upData_file: '',
            pc_version: ''
        }
    }

    async componentDidMount() {
        this.createFile()
    }

    /*创建文件*/
    async createFile() {
        let upObj = {"url": "","stage": 0,"filePath": "","fileSize": "","fileMD5": ""}
        let deviceInfo = await NativeModules.DeviceInfoG;
        let filePath = await deviceInfo.CreateFile(JSON.stringify(upObj));
        let version = await deviceInfo.GetVersion()
        this.setState({
            pc_upData_file: filePath,
            pc_version: version
        })

        // 更新
        this.readFile();
    }

    async readFile() {
        let deviceInfo = await NativeModules.DeviceInfoG;
        let res = await deviceInfo.ReadFile(this.state.pc_upData_file)
        let obj = JSON.parse(res)
        if (obj.stage == 0) {
            // 下载状态没有完成，调用下载程序继续下载
            this.upPc()
        } else if (obj.stage == 1 && obj.url.length !== 0) {
            this.Loading.alertChoose('新版本已下载好，是否进行更新？');
        }
    }

    async upPc() {
        // 1、获取本地版本号
        const url = api.base_uri + '/pc/struct/updatePC?version='+ this.state.pc_version;
        fetch(url)
            .then(resp => resp.json())
            .then((data) => {
                // data.result !== null 则说明版本不一致
                if (data.code === 0 && data.result !== null) {
                    let fileInfo = JSON.parse(data.result.fileSize)
                    // 更新时，状态重置 stage:0
                    let upObj = {"url": data.result.url,"stage":0,"filePath": this.state.pc_upData_file,"fileSize": fileInfo.fileSize,"fileMD5": fileInfo.fileMD5};
                    this.writeFile(JSON.stringify(upObj))
                }
            })
    }

    /*写入内容到文件*/
    async writeFile(objMeg){
        let deviceInfo = await NativeModules.DeviceInfoG;
        // deviceInfo.WriteFile()
        await deviceInfo.WriteFile(objMeg)

        // 调用程序下载补丁
        this.downloadPC();
    }

    // 开始更新PC程序
    async startUpdatePC() {
        await NativeModules.MyDialogModel.SetUpPatch(this.state.pc_upData_file); // 安装补丁（配置文件路径）
    }

    // 开始下载PC程序
    async downloadPC() {
        await NativeModules.MyDialogModel.DownLoadPatch(this.state.pc_upData_file);
    }


    render() {
        return (
            <Loading ref={r=>{this.Loading = r}} hide = {true} yes={() => {this.startUpdatePC()}} />
        )
    }
}
