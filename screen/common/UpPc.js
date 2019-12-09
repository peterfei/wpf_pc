import { NativeModules } from "react-native"
import api from "../api"

const pc_upData_file = ''
const pc_version = ''

let createFile = async () => {
    let upObj = {"url": "", "stage": 0, "filePath": "", "fileSize": "", "fileMD5": ""}
    let deviceInfo = await NativeModules.DeviceInfoG;
    let filePath = await deviceInfo.CreateFile(JSON.stringify(upObj))
    let version = await deviceInfo.GetVersion()
    pc_upData_file = filePath,
    pc_version = version

    // 更新
    await readFile()
}

let readFile = async() => {
    let deviceInfo = await NativeModules.DeviceInfoG;
    let res = await deviceInfo.ReadFile(pc_upData_file)
    let obj = JSON.parse(res)
    if (obj.stage == 0) {
        // 下载状态没有完成，调用下载程序继续下载
        await upPc()
    } else if (obj.stage == 1 && obj.url.length !== 0) {
        await startUpdatePC()
    }
}

let upPc = async () => {
    // 1、获取本地版本号
    const url = api.base_uri + '/pc/struct/updatePC?version='+ pc_version;
    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            // data.result !== null 则说明版本不一致
            if (data.code === 0 && data.result !== null) {
                let fileInfo = JSON.parse(data.result.fileSize)
                // 更新时，状态重置 stage:0
                let upObj = {"url": data.result.url,"stage":0,"filePath": pc_upData_file,"fileSize": fileInfo.fileSize,"fileMD5": fileInfo.fileMD5};
                writeFile(JSON.stringify(upObj))
            }
        })
}

let startUpdatePC = async () => {
    await NativeModules.MyDialogModel.SetUpPatch(pc_upData_file); // 安装补丁（配置文件路径）
}

let writeFile = async () => {
    let deviceInfo = await NativeModules.DeviceInfoG;
    // deviceInfo.WriteFile()
    await deviceInfo.WriteFile(objMeg)

    // 调用程序下载补丁
    await downloadPC();
}

let downloadPC = async () => {
    await NativeModules.MyDialogModel.DownLoadPatch(pc_upData_file);
}
