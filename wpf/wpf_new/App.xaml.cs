using ReactNative.Modules.Launch;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using System.Diagnostics;

namespace wpf_new
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {
        private readonly AppReactPage _reactPage = new AppReactPage();
        private static System.Threading.Mutex mutex;

        public FloatWin _floatWin { get; private set; }


        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
        }

        /// <summary>
        /// Override method fired prior to the Startup event when the Run method of the Application object is called...
        /// </summary>
        /// <param name="e"></param>
        protected override void OnStartup(StartupEventArgs e)
        {
            
            mutex = new System.Threading.Mutex(true, "OnlyRun");
            if (mutex.WaitOne(0, false))
            {
                base.OnStartup(e);
                OnCreate(e.Args);
            }
            else {
                System.Windows.MessageBox.Show("应用正在运行");
                Application.Current.Shutdown();
            }

        }

        protected override void OnExit(ExitEventArgs e)
        {
            base.OnExit(e);
            KillProcessByName();

        }
        /// <summary>
        /// Called whenever the app is opened to initialized...
        /// </summary>
        /// <param name="arguments"></param>
        private void OnCreate(string[] arguments)
        {
           
            _reactPage.OnResume(Shutdown);

            LauncherModule.SetActivatedUrl(String.Join(" ", arguments));

            var shellWindow = Application.Current.MainWindow;

            if (shellWindow == null)
            {
                shellWindow = new Window
                {
                    ShowActivated = true,
                    ShowInTaskbar = true,
                    Title = "wpf_new",
                    Height = 768,
                    Width = 1024,
                    MinHeight = 768,
                    MinWidth = 1024,
                    WindowStartupLocation = WindowStartupLocation.CenterScreen
                };

                Application.Current.MainWindow = shellWindow;
            }

            //Show Window if it is not already active...
            if (!shellWindow.IsLoaded)
            {

                shellWindow.Show();
            }

            
            var rootFrame = shellWindow.Content as Frame;

            // Do not repeat app initialization when the Window already has content,
            // just ensure that the window is active
            if (rootFrame == null)
            {
                _reactPage.OnCreate(arguments);

                // Create a Frame to act as the navigation context and navigate to the first page
                rootFrame = new Frame();

                rootFrame.NavigationFailed += OnNavigationFailed;

                // Place the frame in the current Window
                shellWindow.Content = rootFrame;
            }

            if (rootFrame.Content == null)
            {
                // When the navigation stack isn't restored navigate to the first page,
                // configuring the new page by passing required information as a navigation
                // parameter
                rootFrame.Content = _reactPage;
            }
            //_floatWin = new FloatWin(shellWindow)
            //{
            //    Owner = this.MainWindow,
            //    //Opacity = 0.5,
            //    ShowInTaskbar = true,
            //    //WindowStyle= System.Windows.WindowStyle.None,
            //};
            
            //_floatWin.Show();
            ////
            //_floatWin.Left = shellWindow.Left;
            //_floatWin.Top = 300;
            //_floatWin.Width =80;

            //_floatWin.Height = 80;
            // Ensure the current window is active
            shellWindow.Activate();
            //shellWindow.AllowsTransparency = true;
        }

        /// <summary>
        /// Invoked when Navigation to a certain page fails
        /// </summary>
        /// <param name="sender">The Frame which failed navigation</param>
        /// <param name="e">Details about the navigation failure</param>
        private void OnNavigationFailed(object sender, NavigationFailedEventArgs e)
        {
            throw new Exception("Failed to load Page...");
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

        
    }
}
