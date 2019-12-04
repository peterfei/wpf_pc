using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Collections;
using ReactNative.Modules.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Threading;
using VesalPCVip.Net;


class WgetDownLoad
{
    static void Main(string[] args)
    {
        string url = "";
            
        string downLoadPath = AppDomain.CurrentDomain.BaseDirectory + "download/";

        ProcessStartInfo processInfo = new ProcessStartInfo();
        processInfo.FileName = AppDomain.CurrentDomain.BaseDirectory + "wget/wget.exe";
        processInfo.Arguments = "-b -c -P " + downLoadPath + " " + url;// -b 后台下载   wget -P 指定目录  -c 断点
        try
        {
            using (Process exeProcess = Process.Start(processInfo))
            {
                exeProcess.WaitForExit();
                exeProcess.Close();
            }
        }
        catch (Exception e)
        {
            vesal_log.vesal_write_log(e.Message + "\n" + e.StackTrace);
        }

        Console.WriteLine("下载完成");
    }
}