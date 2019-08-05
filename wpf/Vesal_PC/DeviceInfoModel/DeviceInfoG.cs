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
    }
}