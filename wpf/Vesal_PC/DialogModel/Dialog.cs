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
using Microsoft.WindowsAPICodePack.Shell;
using Microsoft.WindowsAPICodePack.Dialogs;

namespace VesalPCVip.DialogModel
{

    public class Dialog : ReactContextNativeModuleBase
    {

        public static Dialog instance;
        public Dialog(ReactContext reactContext)
            : base(reactContext)
        {

            instance = this;

        }

        public override string Name
        {
            get
            {
                return "Dialog";
            }
        }
        [ReactMethod]
        private void ShowDialog()
        {
            CommonOpenFileDialog Dialog = new CommonOpenFileDialog();
            Dialog.IsFolderPicker = true;//设置为选择文件夹
            CommonFileDialogResult result = Dialog.ShowDialog();
        }
    }
}