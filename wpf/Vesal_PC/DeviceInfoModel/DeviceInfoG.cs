// Copyright (c) Microsoft Corporation. All rights reserved.
// Portions derived from React Native:
// Copyright (c) 2015-present, Facebook, Inc.
// Licensed under the MIT License.

//using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Collections;
using ReactNative.Modules.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;

using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Threading;
using VesalPCVip.Net;
using System.Net.NetworkInformation;
using System.Net;
using System.IO;
using System.Text;
using System.Management;

namespace VesalPCVip.DeviceInfoModel
{


    public class DeviceInfoG : ReactContextNativeModuleBase
    {

        public static DeviceInfoG instance;
        public DeviceInfoG(ReactContext reactContext)
            : base(reactContext)
        {

            instance = this;

        }

        public override string Name
        {
            get
            {
                return "DeviceInfoG";
            }
        }
        [ReactMethod]
        public void GetFirstMacAddress(IPromise promise)
        {
            string macAddresses = string.Empty;

            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (nic.OperationalStatus == OperationalStatus.Up)
                {
                    macAddresses += nic.GetPhysicalAddress().ToString();

                    break;
                }
            }
            promise.Resolve(macAddresses);
            // return macAddresses;
        }

        [ReactMethod]
        //获取cpu ID
        public void GetCpuID(IPromise promise)
        {
            try
            {
                string cpuInfo = "";
                ManagementClass mc = new ManagementClass("Win32_Processor");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    promise.Resolve(mo.Properties["ProcessorId"].Value.ToString());
                }
                promise.Resolve("");
            }
            catch
            {
                promise.Resolve("");
            }
        }

        public string GetCpuID()
        {
            try
            {
                string cpuInfo = "";
                ManagementClass mc = new ManagementClass("Win32_Processor");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    return (mo.Properties["ProcessorId"].Value.ToString());
                }
                return "";
            }
            catch
            {
                return "";
            }
        }

        [ReactMethod]
        //获取主板ID
        public void GetBaseBoardID(IPromise promise)
        {
            try
            {
                ManagementClass mc = new ManagementClass("Win32_BaseBoard");
                ManagementObjectCollection moc = mc.GetInstances();
                string strID = null;
                foreach (ManagementObject mo in moc)
                {
                    strID = mo.Properties["SerialNumber"].Value.ToString();
                    promise.Resolve(strID);
                }
                promise.Resolve("");
            }
            catch
            {
                promise.Resolve("");
            }
        }

        [ReactMethod]
        public void GetLocalIpAddress(IPromise promise)
        {
            string hostName = Dns.GetHostName();
            Console.WriteLine(hostName);
            string myIp = Dns.GetHostByName(hostName).AddressList[0].ToString();
            Console.WriteLine("myIp is :" + myIp);
            promise.Resolve(myIp);

        }

        [ReactMethod]
        public void WriteLocalFileWithIpAddress(JObject config, IPromise promise)
        {
            var localIp = config.Value<string>("ip_address") ?? "";
            var role = config.Value<string>("role") ?? "";
            string filename = AppDomain.CurrentDomain.BaseDirectory + "win/test_Data/StreamingAssets/server_ip.txt";
            if (File.Exists(filename))
            {
                File.Delete(filename);
            }

            FileStream fs = new FileStream(filename, FileMode.Create, FileAccess.ReadWrite);
            byte[] data = System.Text.Encoding.UTF8.GetBytes(localIp+"\n"+role);
            fs.Write(data, 0, data.Length);
            fs.Flush();
            fs.Close();
            promise.Resolve("录入成功");

        }

        [ReactMethod]
        public void ReadFile(string path, IPromise promise)
        {
            StreamReader sr = new StreamReader(path, Encoding.Default);
            String line;
            while ((line = sr.ReadLine()) != null)
            {
                Console.WriteLine(line.ToString());
                promise.Resolve(line.ToString());
            }
            sr.Close();
        }

        [ReactMethod]
        public void WriteFile(string fileInfo)
        {
            // 获取当前进程的完整路径，包含文件名(进程名)。
            string str = System.AppDomain.CurrentDomain.BaseDirectory;
            // 使用FileStream类创建文件，然后将数据写入到文件里。
            FileStream fs = new FileStream(str + "patch.json", FileMode.Create);
            // 获得字节数组
            byte[] data = System.Text.Encoding.Default.GetBytes(fileInfo);
            // 开始写入
            fs.Write(data, 0, data.Length);
            // 清空缓冲区、关闭流
            fs.Flush();
            fs.Close();
        }

        [ReactMethod]
        public void CreateFile(string upObj, IPromise promise)
        {
            string str = System.AppDomain.CurrentDomain.BaseDirectory;
            string path =  str + "patch.json";
            if (!File.Exists(path))
            {
                FileStream fs = new FileStream(path, FileMode.Create);
                // 获得字节数组
                byte[] data = System.Text.Encoding.Default.GetBytes(upObj);
                // 开始写入
                fs.Write(data, 0, data.Length);
                // 清空缓冲区、关闭流
                fs.Flush();
                fs.Close();
            }
            promise.Resolve(path);
        }

        [ReactMethod]
        public void GetVersion(IPromise promise)
        {
            //System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString()
            //Application.ProductVersion.ToString()
            promise.Resolve(System.Windows.Forms.Application.ProductVersion.ToString());
        }
    }
}
