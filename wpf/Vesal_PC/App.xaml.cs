using ReactNative.Modules.Dialog;
using ReactNative.Modules.Launch;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Navigation;
using VesalPCVip.MyModel;



namespace VesalPCVip
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    public partial class App : Application
    {
        private readonly AppReactPage _reactPage = new AppReactPage();
        public Panel p;
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
            base.OnStartup(e);
            OnCreate(e.Args);
        }
        public class Win32Native
        {
            [System.Runtime.InteropServices.DllImport("user32.dll", EntryPoint = "SetParent")]
            public extern static IntPtr SetParent(IntPtr childPtr, IntPtr parentPtr);
        }
        /// <summary>
        /// Called whenever the app is opened to initialized...
        /// </summary>
        /// <param name="arguments"></param>
        private void OnCreate(string[] arguments)
        {
            _reactPage.OnResume(Shutdown);

            LauncherModule.SetActivatedUrl(String.Join(" ", arguments));

            MainWindow shellWindow = (MainWindow)Application.Current.MainWindow;

            if (shellWindow == null)
            {
                shellWindow = new MainWindow
                {
                    
                    WindowState = System.Windows.WindowState.Maximized,
                    //WindowStyle = System.Windows.WindowStyle.None,
                    // = System.Windows.ResizeMode.NoResize,
                    //WindowStartupLocation = WindowStartupLocation.Manual,
                    WindowStartupLocation = WindowStartupLocation.CenterScreen,
                    //ShowActivated = true,
                    //ShowInTaskbar = true,
                    Title = "维萨里解剖教学",
                    Left = 0,
                    Top = 0,
                    Height = System.Windows.SystemParameters.WorkArea.Height,
                    Width = System.Windows.SystemParameters.WorkArea.Width,
                    //Height = System.Windows.SystemParameters.FullPrimaryScreenHeight,
                    //Width = System.Windows.SystemParameters.FullPrimaryScreenWidth,

                };
                //WindowStartupLocation = WindowStartupLocation.CenterScreen
                Application.Current.MainWindow = shellWindow;
                
                MyDialogModel.mainWindow = shellWindow;
            }

            //Show Window if it is not already active...
            if (!shellWindow.IsLoaded)
            {
                shellWindow.Hide();
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
                //rootFrame.Navigate(new GameHost(400, 400));
                
            }
            
            
            
            
            //p.Children = gameHost;
            // Ensure the current window is active
            shellWindow.Activate();
            
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

        //private void icon() {
        //    new System.Windows.Forms.NotifyIcon();
        //}
    }
}
