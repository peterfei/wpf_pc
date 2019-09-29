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
using System.Speech.Synthesis;

namespace VesalPCVip.SpeechModel
{

    public class Speech : ReactContextNativeModuleBase
    {

        public static Speech instance;
        public Speech(ReactContext reactContext)
            : base(reactContext)
        {

            instance = this;

        }

        public override string Name
        {
            get
            {
                return "Speech";
            }
        }
        [ReactMethod]
        private void btnSayHello_Click(string word)
		{
			SpeechSynthesizer speechSynthesizer = new SpeechSynthesizer();
			speechSynthesizer.Speak(word);
		}
    }
}