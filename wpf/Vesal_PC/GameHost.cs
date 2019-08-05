using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;

namespace VesalPCVip
{
    // GameHost is a FrameworkElement and can be added to controls like so:
    // var gameHost = new GameHost(container.ActualWidth, container.ActualHeight);
    // container.Child = gameHost;
    //
    // Sources:
    // - https://msdn.microsoft.com/en-us/library/ms752055.aspx
    // - Another source I can't remember or find, concerning running a standalone Unity process using parentHWND parameter
    
    internal class GameHost : HwndHost
    {
        private const int WS_CHILD = 0x40000000;
        private const int WS_VISIBLE = 0x10000000;
        private const int HOST_ID = 0x00000002;

        private IntPtr hwndHost;
        private int hostHeight, hostWidth;

        private Process process;
        public static  IntPtr unityHWND = IntPtr.Zero;

        private const int WM_ACTIVATE = 0x0006;
        public static readonly IntPtr WA_ACTIVE = new IntPtr(1);
        public static readonly IntPtr WA_INACTIVE = new IntPtr(0);
        public GameHost(double width, double height)
        {
            hostHeight = (int)height;
            hostWidth = (int)width;
        }


        protected override HandleRef BuildWindowCore(HandleRef hwndParent)
        {
            hwndHost = IntPtr.Zero;

            hwndHost = CreateWindowEx(0, "static", "",
                                      WS_CHILD | WS_VISIBLE,
                                      0, 0,
                                      hostWidth, hostHeight,
                                      hwndParent.Handle,
                                      (IntPtr)HOST_ID,
                                      IntPtr.Zero,
                                      0);

            {
                try
                {
                    process = new Process();
                    process.StartInfo.FileName = AppDomain.CurrentDomain.BaseDirectory + "win/vesal.exe";
                    process.StartInfo.Arguments = "-parentHWND " + hwndHost.ToInt32() + " " + Environment.CommandLine;
                    process.StartInfo.UseShellExecute = true;
                    process.StartInfo.CreateNoWindow = true;

                    process.Start();

                    process.WaitForInputIdle();
                    // Doesn't work for some reason ?!
                    //unityHWND = process.MainWindowHandle;
                    EnumChildWindows(hwndHost, WindowEnum, IntPtr.Zero);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message + "GameHost: Could not find game executable.");
                }
            }

            return new HandleRef(this, hwndHost);
        }

        protected override void DestroyWindowCore(HandleRef hwnd)
        {
            try
            {
                process.CloseMainWindow();

                System.Threading.Thread.Sleep(1000);
                while (process.HasExited == false)
                    process.Kill();
            }
            catch (Exception)
            {

            }

            DestroyWindow(hwnd.Handle);
        }

        public static  void ActivateUnityWindow()
        {
            SendMessage(unityHWND, WM_ACTIVATE, WA_ACTIVE, IntPtr.Zero);
        }

        public static void DeactivateUnityWindow()
        {
            SendMessage(unityHWND, WM_ACTIVATE, WA_INACTIVE, IntPtr.Zero);
        }

        protected override IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            handled = false;
            return IntPtr.Zero;
        }

        private int WindowEnum(IntPtr hwnd, IntPtr lparam)
        {
            unityHWND = hwnd;
            ActivateUnityWindow();
            return 0;
        }

        //PInvoke declarations
        [DllImport("user32.dll", EntryPoint = "CreateWindowEx", CharSet = CharSet.Unicode)]
        internal static extern IntPtr CreateWindowEx(int dwExStyle,
                                                      string lpszClassName,
                                                      string lpszWindowName,
                                                      int style,
                                                      int x, int y,
                                                      int width, int height,
                                                      IntPtr hwndParent,
                                                      IntPtr hMenu,
                                                      IntPtr hInst,
                                                      [MarshalAs(UnmanagedType.AsAny)] object pvParam);

        [DllImport("user32.dll", EntryPoint = "DestroyWindow", CharSet = CharSet.Unicode)]
        internal static extern bool DestroyWindow(IntPtr hwnd);

        [DllImport("User32.dll")]
        static extern bool MoveWindow(IntPtr handle, int x, int y, int width, int height, bool redraw);

        internal delegate int WindowEnumProc(IntPtr hwnd, IntPtr lparam);
        [DllImport("user32.dll")]
        internal static extern bool EnumChildWindows(IntPtr hwnd, WindowEnumProc func, IntPtr lParam);

        [DllImport("user32.dll")]
        static extern int SendMessage(IntPtr hWnd, int msg, IntPtr wParam, IntPtr lParam);
    }
}
