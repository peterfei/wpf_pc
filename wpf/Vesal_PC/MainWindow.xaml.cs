using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using VesalPCVip.MyModel;
using VesalPCVip.Net;

namespace VesalPCVip
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public ServerManager sm;
        public static MainWindow mw;
        public MainWindow()
        {
            if (sm == null) {
                sm = new ServerManager();
                sm.StartServer();
                this.KeyDown += new KeyEventHandler(window_keyDown);
            }
            mw = this;
            //MyDialogModel.instance.testMethod();

            
        }

        private void window_keyDown(object sender, KeyEventArgs e)
        {
            //事件处理
            if (e.Key == Key.Escape)
            {
                this.WindowState = System.Windows.WindowState.Normal;
                this.WindowStyle = System.Windows.WindowStyle.ThreeDBorderWindow;
            }
            else if (e.Key == Key.F12)
            {
                this.WindowState = System.Windows.WindowState.Maximized;
                this.WindowStyle = System.Windows.WindowStyle.None;
            }
            else if (e.Key == Key.F1)
            {
                MyDialogModel.instance.SendMessageToUnity("感觉器");
            }
        }
        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);
            Environment.Exit(0);
        }

        protected override void OnClosing(CancelEventArgs e)
        {
            base.OnClosing(e);
            Console.WriteLine("OnClosing....");
            if (sm != null)
            {
                //ServerManager.SendMessage("quit");

                sm.QuitServer();
                Console.WriteLine("QuitServer....");
            }
            
            KillProcessByName();
            Console.WriteLine("QuitServer down....");
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

        protected override void OnMouseDown(MouseButtonEventArgs e)
        {
            base.OnMouseDown(e);
        }

        protected override void OnMouseEnter(MouseEventArgs e)
        {
            base.OnMouseEnter(e);
        }

        protected override void OnMouseLeave(MouseEventArgs e)
        {
            base.OnMouseLeave(e);
        }

        protected override void OnMouseLeftButtonDown(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonDown(e);
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            base.OnMouseMove(e);
        }

        protected override void OnMouseWheel(MouseWheelEventArgs e)
        {
            base.OnMouseWheel(e);
        }

        protected override void OnPreviewMouseDown(MouseButtonEventArgs e)
        {
            base.OnPreviewMouseDown(e);
        }

        protected override void OnTouchDown(TouchEventArgs e)
        {
            base.OnTouchDown(e);
        }

        protected override void OnTouchMove(TouchEventArgs e)
        {
            Console.WriteLine("1111111111111111");
            base.OnTouchMove(e);
        }
    }
}
