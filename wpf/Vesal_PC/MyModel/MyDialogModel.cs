// Copyright (c) Microsoft Corporation. All rights reserved.
// Portions derived from React Native:
// Copyright (c) 2015-present, Facebook, Inc.
// Licensed under the MIT License.

//using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
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

namespace VesalPCVip.MyModel
{
    static class DialogModuleHelper
    {
        public const string ActionButtonClicked = "buttonClicked";
        public const string ActionDismissed = "dismissed";

        public const string KeyButtonPositive = "buttonPositive";
        public const string KeyButtonNegative = "buttonNegative";

        public const int KeyButtonPositiveValue = 0;
        public const int KeyButtonNegativeValue = 1;
    }

    public class AppObject
    {
        public string app_type { get; set; }
    }

    public class MyDialogModel : ReactContextNativeModuleBase
    {
        public static Process myprocess;
        public static Window mainWindow;

        public static int handle;
        public static MyDialogModel instance;

        public static Boolean isShow = false;
        public MyDialogModel(ReactContext reactContext)
            : base(reactContext)
        {
            this.KillProcessByName();
            instance = this;
            //this.startUnityWindow();
            Console.WriteLine(reactContext.GetType() + "---" + reactContext.ToString());
        }

        public override string Name
        {
            get
            {
                return "MyDialogModel";
            }
        }

        [ReactMethod]
        public void getMainWidth(IPromise promise)
        {
            //var dpi = GetDpi();
            //var width = Math.Round(System.Windows.SystemParameters.WorkArea.Width / 96 * (dpi * 96));
            //if (dpi == 1)
            //{
            //     width = System.Windows.SystemParameters.WorkArea.Width;
            //    //var height = (int)System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96);

            //}

            //var width = (int)MainWindow.mw.ActualWidth / 96 * (dpi * 96);
            var dpi = GetDpi();
            var width = Math.Round(System.Windows.SystemParameters.FullPrimaryScreenWidth / 96 * (dpi * 96));
            if (dpi == 1)
            {
                width = System.Windows.SystemParameters.FullPrimaryScreenWidth;
                //var height = (int)System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96);

            }

            //var width = (int)MainWindow.mw.ActualWidth / 96 * (dpi * 96);
            Console.WriteLine("++++++++++++++++++++" + width);
            promise.Resolve(width);
        }
        
        [ReactMethod]
        public void getMainHeight(IPromise promise)
        {
            //var dpi = GetDpi();
            //var height = System.Windows.SystemParameters.FullPrimaryScreenHeight;
            //var height = System.Windows.SystemParameters.WorkArea.Height;


            //if (dpi != 1)
            //{
            //    //height = (int)System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96);
            //     height = Math.Round(System.Windows.SystemParameters.WorkArea.Height / 96 * (dpi * 96));

            //}
            var dpi = GetDpi();
            var height = System.Windows.SystemParameters.FullPrimaryScreenHeight;
            if (dpi != 1)
            {
                //height = (int)System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96);
                height = Math.Round(System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96));

            }

            // WindowsApi.ShowWindow(unityHWND, 5);


            Console.WriteLine("++++++++++++++++++++" + height);
            promise.Resolve(height);
        }
        [ReactMethod]
        public void showLog(string log)
        {
            Console.WriteLine(log);
        }
        [ReactMethod]
        public void SendMessageToUnity(string message)
        {
            //Console.WriteLine("sendMessage" + message);
            vesal_log.vesal_write_log("===========" + message);
            //JObject o  = JObject.Parse(message);
            var o = JsonConvert.DeserializeObject<AppObject>(message);

            ServerManager.send_cmd((byte)VESAL_CMD_CODE.MSG_CMD, message);
            //if (o.app_type != "app_screen")
            //{
            //    isShow = true;


            //}

            //if (isShow)
            //{
            //    show();
            //}
            //else
            //{
            //    hide();
            //}

            //WindowsApi.SetFocus(unityHWND);
            //WindowsApi.SetF(unityHWND);
            //WindowsApi.ShowWindow(unityHWND, 5);
            //mainWindow.Dispatcher.BeginInvoke(DispatcherPriority.Normal, new Action(delegate
            //{
            ////    WindowsApi.ShowWindow(unityHWND, 5);
            //}));
        }

        private void window_keyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
            //事件处理
            //if (e.Key == Key.Escape)
            //{
            //    w2.WindowState = System.Windows.WindowState.Normal;
            //    w2.WindowStyle = System.Windows.WindowStyle.ThreeDBorderWindow;
            //}
            //else if (e.Key == Key.F12)
            //{
            //    w2.WindowState = System.Windows.WindowState.Maximized;
            //    w2.WindowStyle = System.Windows.WindowStyle.None;
            //}
        }
        public void stopUnity()
        {
            int pid = -1;
            WindowsApi.GetWindowThreadProcessId(unityHWND, out pid);
            Console.WriteLine("stopUnity: " + pid);
            if (pid != -1)
            {
                KillProcessid(pid);
            }
        }
        public void KillProcessid(int strProcid)
        {
            try
            {
                foreach (Process p in Process.GetProcesses())
                {
                    if (p.Id.Equals(strProcid))
                    {

                        p.Kill();
                        Console.WriteLine("KillProcessid strProcid");

                    }
                }
            }
            catch
            {
                Console.WriteLine("KillProcessid Error");
            }
        }
        public void KillProcessByName(string name = "vesal")
        {
            try
            {
                foreach (Process p in Process.GetProcesses())
                {
                    if (p.ProcessName == name)
                    {

                        p.Kill();
                        Console.WriteLine("KillProcessid strProcid");

                    }
                }
            }
            catch
            {
                Console.WriteLine("KillProcessid Error");
            }
        }

        //
        public IntPtr get_process_hwnd(Process process, int micro_seconds)
        {
            long num = DateTime.Now.Ticks / 0x2710L;
            IntPtr hwnd;
            while (true)
            {
                hwnd = process.MainWindowHandle;
                if (hwnd != IntPtr.Zero)
                {
                    return hwnd;
                }
                long num2 = DateTime.Now.Ticks / 0x2710L;
                if (num2 >= (num + micro_seconds))
                {
                    hwnd = IntPtr.Zero;
                    return IntPtr.Zero;
                }
                Thread.Sleep(1);
            }
        }
        public static Window w2;

        [ReactMethod]
        public void startUnityWindow()
        {
            //mainWindow.Content = new GameHost(400, 400);

            //mainWindow.Dispatcher.BeginInvoke(DispatcherPriority.Normal, new Action(delegate
            //{

            //    w2 = new Window
            //    {
            //        Title = "DRVS解剖教学",
            //        //WindowStyle = WindowStyle.None,
            //        Height =  600 ,
            //        Width = 500,
            //        WindowStartupLocation = WindowStartupLocation.Manual,
            //        //ResizeMode = ResizeMode.NoResize,
            //        //WindowStartupLocation = WindowStartupLocation.CenterScreen,
            //        ShowInTaskbar = false
            //    };

            //    w2.Top = 0;
            //    w2.Left = 0;
            //    w2.Show();
            //    // w2.Hide();
            //    w2.ShowInTaskbar = false;
            //    WindowInteropHelper parentHelper = new WindowInteropHelper(mainWindow);
            //    WindowInteropHelper helper = new WindowInteropHelper(w2);
            //    WindowsApi.SetParent(helper.Handle, parentHelper.Handle);

            //    try
            //    {
            //        mainHWND = parentHelper.Handle;
            //    }
            //    catch (System.Exception)
            //    {

            //    }

            //    string filename = AppDomain.CurrentDomain.BaseDirectory + "win/vesal.exe";
            //    myprocess = new Process();
            //    ProcessStartInfo startInfo = new ProcessStartInfo(filename)
            //    {
            //        //WindowStyle = ProcessWindowStyle.Maximized
            //    };
            //    startInfo.Arguments = "-parentHWND " + helper.Handle.ToInt32() + " " + Environment.CommandLine;
            //    myprocess.StartInfo = startInfo;
            //    myprocess.StartInfo.UseShellExecute = true;
            //    myprocess.StartInfo.CreateNoWindow = true;
            //    if (myprocess.Start())
            //    {
            //        // WindowsApi.ShowWindow(myprocess.MainWindowHandle, 3);

            //    }
            //    myprocess.WaitForInputIdle();
            //    unityHWND = get_process_hwnd(myprocess, 1000 * 2);
            //    WindowsApi.EnumChildWindows(unityHWND, WindowEnum, IntPtr.Zero);
            //    //WindowsApi.MoveWindow(unityHWND, 100, 100, 100, 100, true);

            //}));

        }
        [ReactMethod]
        public void show()
        {
            Console.WriteLine("SHOW");
            //MoveWindow(unityHWND, 0,0,(int) MainWindow.mw.ActualWidth, (int)MainWindow.mw.ActualHeight, false);

            //WindowsApi.ShowWindow(unityHWND, 3);
            //WindowsApi.SetForegroundWindow(unityHWND);

            ////7最小化
            //w2.Dispatcher.BeginInvoke(DispatcherPriority.Normal, new Action(delegate
            //{
            //    w2.Show();

            //    WindowsApi.ShowWindow(unityHWND, 3);
            //    ActivateUnityWindow();
            //}));
            //ActivateUnityWindow();
        }
        [ReactMethod]
        public void hide()
        {
            //Console.WriteLine("hide");
            //isShow = false;
            //WindowsApi.ShowWindow(unityHWND, 0);
            //DeactivateUnityWindow();
            ////MoveWindow(unityHWND, (int)MainWindow.mw.ActualWidth, (int)MainWindow.mw.ActualHeight,(int) MainWindow.mw.ActualWidth, (int)MainWindow.mw.ActualHeight, false);
            //WindowsApi.SetForegroundWindow(mainHWND);
            //w2.Dispatcher.BeginInvoke(DispatcherPriority.Normal, new Action(delegate
            //{
            //    w2.Hide();
            //    //DeactivateUnityWindow();

            //}));
        }



        [ReactMethod]
        public void exitsApp()
        {
            //
            MyDialogModel.myprocess.Close();
            MyDialogModel.myprocess.Dispose();
            MyDialogModel.instance.stopUnity();
            System.Environment.Exit(0);
        }

        [ReactMethod]
        public void windowResize()
        {
            //
            Console.WriteLine("windowResize");
        }

        Boolean bool_unity_process = false;
        [ReactMethod]
        public void checkUnityProcess(IPromise promise)
        {

            foreach (Process p in Process.GetProcesses())
            {
                if (p.ProcessName == "vesal")
                {

                    //p.Kill();
                    bool_unity_process = true;

                }
            }
            promise.Resolve(bool_unity_process);
        }
        [ReactMethod]
        public void restartUnity()
        {
            //
            MyDialogModel.myprocess.Close();
            MyDialogModel.myprocess.Dispose();
            MyDialogModel.instance.stopUnity();
            MyDialogModel.instance.KillProcessByName("test");
        }
        public override IReadOnlyDictionary<string, object> Constants
        {
            get
            {
                return new Dictionary<string, object>
                {
                    { DialogModuleHelper.ActionButtonClicked, DialogModuleHelper.ActionButtonClicked },
                    { DialogModuleHelper.ActionDismissed, DialogModuleHelper.ActionDismissed },
                    { DialogModuleHelper.KeyButtonPositive, DialogModuleHelper.KeyButtonPositiveValue },
                    { DialogModuleHelper.KeyButtonNegative, DialogModuleHelper.KeyButtonNegativeValue },
                };
            }
        }
        /// <summary>
        /// 查找窗体上控件句柄
        /// </summary>
        /// <param name="hwnd">父窗体句柄</param>
        /// <param name="lpszWindow">控件标题(Text)</param>
        /// <param name="bChild">设定是否在子窗体中查找</param>
        /// <returns>控件句柄，没找到返回IntPtr.Zero</returns>
        private IntPtr FindWindowEx(IntPtr hwnd, string lpszWindow, bool bChild)
        {
            IntPtr iResult = IntPtr.Zero;
            // 首先在父窗体上查找控件
            iResult = WindowsApi.FindWindowEx(hwnd, 0, null, lpszWindow);
            // 如果找到直接返回控件句柄
            if (iResult != IntPtr.Zero) return iResult;

            // 如果设定了不在子窗体中查找
            if (!bChild) return iResult;

            // 枚举子窗体，查找控件句柄
            int i = WindowsApi.EnumChildWindows(
            hwnd,
            (h, l) =>
            {
                IntPtr f1 = WindowsApi.FindWindowEx(h, 0, null, lpszWindow);
                if (f1 == IntPtr.Zero)
                    return true;
                else
                {
                    iResult = f1;
                    return false;
                }
            },
            0);
            // 返回查找结果
            return iResult;
        }
        static class WindowsApi
        {
            [DllImport("user32.dll", EntryPoint = "SetForegroundWindow")]
            public static extern bool SetF(IntPtr hWnd); //设置此窗体为活动窗体
            [DllImport("user32.dll", CharSet = CharSet.Auto)]
            public static extern IntPtr SetFocus(IntPtr hWnd);
            [DllImport("user32", EntryPoint = "GetWindowThreadProcessId")]
            public static extern int GetWindowThreadProcessId(IntPtr hwnd, out int pid);
            [DllImport("user32.dll", EntryPoint = "ShowWindow", SetLastError = true)]
            public static extern bool ShowWindow(System.IntPtr hwnd, int nCmdShow);
            [System.Runtime.InteropServices.DllImport("user32.dll", EntryPoint = "SetParent")]
            public extern static IntPtr SetParent(IntPtr childPtr, IntPtr parentPtr);
            [DllImport("user32.dll", EntryPoint = "FindWindow", SetLastError = true)]
            public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

            [DllImport("user32.dll", EntryPoint = "FindWindowEx", SetLastError = true)]
            public static extern IntPtr FindWindowEx(IntPtr hwndParent, uint hwndChildAfter, string lpszClass, string lpszWindow);

            [DllImport("user32.dll", EntryPoint = "SendMessage", SetLastError = true, CharSet = CharSet.Auto)]
            public static extern int SendMessage(IntPtr hwnd, uint wMsg, int wParam, int lParam);

            [DllImport("user32.dll", EntryPoint = "SetForegroundWindow", SetLastError = true)]
            public static extern void SetForegroundWindow(IntPtr hwnd);

            [DllImport("user32.dll")]
            public static extern int EnumChildWindows(IntPtr hWndParent, CallBack lpfn, int lParam);

            public delegate bool CallBack(IntPtr hwnd, int lParam);
            [DllImport("user32.dll")]
            public static extern bool MoveWindow(IntPtr handle, int x, int y, int width, int height, bool redraw);

            [DllImport("kernel32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
            public static extern IntPtr GetModuleHandle(string lpModuleName);



            internal delegate int WindowEnumProc(IntPtr hwnd, IntPtr lparam);
            [DllImport("user32.dll")]
            internal static extern bool EnumChildWindows(IntPtr hwnd, WindowEnumProc func, IntPtr lParam);

        }

        [DllImport("user32.dll")]
        public static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);

        [DllImport("user32.dll")]
        public static extern IntPtr GetDC(IntPtr hwnd);

        [DllImport("gdi32.dll")]
        static extern int GetDeviceCaps(IntPtr hdc, int nIndex);

        public static float GetDpi()
        {
            IntPtr desktopWnd = IntPtr.Zero;
            IntPtr dc = GetDC(desktopWnd);
            var dpi = 100f;
            const int LOGPIXELSX = 88;
            try
            {
                dpi = GetDeviceCaps(dc, LOGPIXELSX);
            }
            finally
            {
                ReleaseDC(desktopWnd, dc);
            }
            return dpi / 96f;
        }

        [DllImport("User32.dll")]
        static extern bool MoveWindow(IntPtr handle, int x, int y, int width, int height, bool redraw);
        [ReactMethod]
        public void showAlert(JObject config, ICallback errorCallback, ICallback actionCallback)
        {
            //var alertWindow = System.Windows.MessageBox;
            var message = config.Value<string>("message") ?? "";
            var title = config.Value<string>("title") ?? "";
            bool containsTitle = config.ContainsKey("title");
            bool containsPositive = config.ContainsKey(DialogModuleHelper.KeyButtonPositive);
            bool containsNegative = config.ContainsKey(DialogModuleHelper.KeyButtonNegative);
            Console.WriteLine(containsPositive);
            Console.WriteLine(containsNegative);
            //SetWindowPos(unityHWND, HWND_TOP, 0, 0, 0, 0, 2 | 1 | 32);
            if (containsPositive && containsNegative)
            {
                var result = System.Windows.MessageBox.Show(message, title, System.Windows.MessageBoxButton.OKCancel);
                //SetWindowPos( System.Windows.MessageBox, HWND_TOP, 0, 0, 0, 0, 2 | 1 | 32);
                if (result == System.Windows.MessageBoxResult.OK)
                {
                    Console.WriteLine(DialogModuleHelper.ActionButtonClicked + config.Value<string>("buttonPositive"));
                    actionCallback.Invoke(DialogModuleHelper.ActionButtonClicked, DialogModuleHelper.KeyButtonPositiveValue);
                }
                else
                {
                    actionCallback.Invoke(DialogModuleHelper.ActionButtonClicked, DialogModuleHelper.KeyButtonNegativeValue);
                }
            }
            else if (containsPositive)
            {
                var result = System.Windows.MessageBox.Show(message, title, System.Windows.MessageBoxButton.OK);
                if (result == System.Windows.MessageBoxResult.OK)
                {
                    actionCallback.Invoke(DialogModuleHelper.ActionButtonClicked, DialogModuleHelper.KeyButtonPositiveValue);
                }
            }
            else if (containsTitle)
            {
                System.Windows.MessageBox.Show(message, title);
            }
            else
            {
                System.Windows.MessageBox.Show(message);
            }

        }

        [DllImport("user32.dll")]
        static extern int SendMessage(IntPtr hWnd, int msg, IntPtr wParam, IntPtr lParam);

        //    /*原生模块可以在没有被调用的情况下往JavaScript发送事件通知。 
        //最简单的办法就是通过RCTDeviceEventEmitter， 
        //这可以通过ReactContext来获得对应的引用，像这样：*/
        //    public static void sendEvent(ReactContext reactContext, String eventName)
        //    {
        //        //System.out.println("reactContext=" + reactContext);
        //        DeviceEventManagerModule dem;
        //        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        //        //        .emit(eventName, paramss);

        //        }

        private Process process;
        private IntPtr unityHWND = IntPtr.Zero;
        private IntPtr mainHWND = IntPtr.Zero;
        private const int WM_ACTIVATE = 0x0006;
        private readonly IntPtr WA_ACTIVE = new IntPtr(1);
        private readonly IntPtr WA_INACTIVE = new IntPtr(0);
        private void ActivateUnityWindow()
        {
            SendMessage(unityHWND, WM_ACTIVATE, WA_ACTIVE, IntPtr.Zero);
        }

        private void DeactivateUnityWindow()
        {
            SendMessage(unityHWND, WM_ACTIVATE, WA_INACTIVE, IntPtr.Zero);
        }

        private int WindowEnum(IntPtr hwnd, IntPtr lparam)
        {
            //Console.WriteLine(hwnd + "-=-=-=-=");
            unityHWND = hwnd;
            ActivateUnityWindow();
            return 0;
        }

        private void panel1_Resize(object sender, EventArgs e)
        {
            //MoveWindow(unityHWND, 0, 0, panel1.Width, panel1.Height, true);
            ActivateUnityWindow();
        }

        // Close Unity application
        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            try
            {
                process.CloseMainWindow();

                Thread.Sleep(1000);
                while (!process.HasExited)
                    process.Kill();
            }
            catch (Exception)
            {

            }
        }

        private void Form1_Activated(object sender, EventArgs e)
        {
            ActivateUnityWindow();
        }

        private void Form1_Deactivate(object sender, EventArgs e)
        {
            DeactivateUnityWindow();
        }

        /// <summary>
        /// 该函数改变指定窗口的属性
        /// </summary>
        [DllImport("user32.dll")]
        public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);
        [DllImport("user32.dll")]
        public static extern int SetWindowPos(IntPtr hWnd, int nIndex, int dwNewLong);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndlnsertAfter, int X, int Y, int cx, int cy, int flag);

        [DllImport("user32.dll")]
        public static extern int GetWindowLong(IntPtr hWnd, int nIndex);
        private const int GWL_STYLE = (-16);
        public const int WS_CAPTION = 0xC00000;
        [Flags]
        public enum SetWindowPosFlags : uint
        {
            // ReSharper disable InconsistentNaming

            /// <summary>
            ///     If the calling thread and the thread that owns the window are attached to different input queues, the system posts the request to the thread that owns the window. This prevents the calling thread from blocking its execution while other threads process the request.
            /// </summary>
            SWP_ASYNCWINDOWPOS = 0x4000,

            /// <summary>
            ///     Prevents generation of the WM_SYNCPAINT message.
            /// </summary>
            SWP_DEFERERASE = 0x2000,

            /// <summary>
            ///     Draws a frame (defined in the window's class description) around the window.
            /// </summary>
            SWP_DRAWFRAME = 0x0020,

            /// <summary>
            ///     Applies new frame styles set using the SetWindowLong function. Sends a WM_NCCALCSIZE message to the window, even if the window's size is not being changed. If this flag is not specified, WM_NCCALCSIZE is sent only when the window's size is being changed.
            /// </summary>
            SWP_FRAMECHANGED = 0x0020,

            /// <summary>
            ///     Hides the window.
            /// </summary>
            SWP_HIDEWINDOW = 0x0080,

            /// <summary>
            ///     Does not activate the window. If this flag is not set, the window is activated and moved to the top of either the topmost or non-topmost group (depending on the setting of the hWndInsertAfter parameter).
            /// </summary>
            SWP_NOACTIVATE = 0x0010,

            /// <summary>
            ///     Discards the entire contents of the client area. If this flag is not specified, the valid contents of the client area are saved and copied back into the client area after the window is sized or repositioned.
            /// </summary>
            SWP_NOCOPYBITS = 0x0100,

            /// <summary>
            ///     Retains the current position (ignores X and Y parameters).
            /// </summary>
            SWP_NOMOVE = 0x0002,

            /// <summary>
            ///     Does not change the owner window's position in the Z order.
            /// </summary>
            SWP_NOOWNERZORDER = 0x0200,

            /// <summary>
            ///     Does not redraw changes. If this flag is set, no repainting of any kind occurs. This applies to the client area, the nonclient area (including the title bar and scroll bars), and any part of the parent window uncovered as a result of the window being moved. When this flag is set, the application must explicitly invalidate or redraw any parts of the window and parent window that need redrawing.
            /// </summary>
            SWP_NOREDRAW = 0x0008,

            /// <summary>
            ///     Same as the SWP_NOOWNERZORDER flag.
            /// </summary>
            SWP_NOREPOSITION = 0x0200,

            /// <summary>
            ///     Prevents the window from receiving the WM_WINDOWPOSCHANGING message.
            /// </summary>
            SWP_NOSENDCHANGING = 0x0400,

            /// <summary>
            ///     Retains the current size (ignores the cx and cy parameters).
            /// </summary>
            SWP_NOSIZE = 0x0001,

            /// <summary>
            ///     Retains the current Z order (ignores the hWndInsertAfter parameter).
            /// </summary>
            SWP_NOZORDER = 0x0004,

            /// <summary>
            ///     Displays the window.
            /// </summary>
            SWP_SHOWWINDOW = 0x0040,

            // ReSharper restore InconsistentNaming
        }

        static readonly IntPtr HWND_TOP = new IntPtr(0);
        //显示
        private void showBorder(object sender, EventArgs e)
        {
            SetWindowLong(unityHWND, GWL_STYLE, GetWindowLong(unityHWND, GWL_STYLE) | WS_CAPTION).ToString();
            SetWindowPos(unityHWND, HWND_TOP, 0, 0, 0, 0, 2 | 1 | 32);
            //SetWindowPos(unityHWND, HWND_TOP, 0, 0, 0, 0, SetWindowPosFlags.SWP_NOMOVE | SetWindowPosFlags.SWP_NOSIZE | SetWindowPosFlags.SWP_FRAMECHANGED);
        }
        //隐藏
        private void hideBorder()
        {
            SetWindowLong(unityHWND, GWL_STYLE, GetWindowLong(unityHWND, GWL_STYLE) & ~WS_CAPTION).ToString();
            // SetWindowPos(unityHWND, HWND_TOP, 0, 0, 0, 0, SetWindowPosFlags.SWP_NOMOVE | SetWindowPosFlags.SWP_NOSIZE | SetWindowPosFlags.SWP_FRAMECHANGED);
            SetWindowPos(unityHWND, HWND_TOP, 0, 0, 0, 0, 2 | 1 | 32);
        }

    }
}