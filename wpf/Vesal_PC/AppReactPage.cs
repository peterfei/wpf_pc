using ReactNative;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using ReactNative.Modules.Dialog;
//using RNSqlite2;
namespace VesalPCVip
{
    internal class AppReactPage : ReactPage
    {
        public override string MainComponentName => "VesalPCVip";

        public override string JavaScriptMainModuleName => "index";

#if BUNDLE
        public override string JavaScriptBundleFile => AppDomain.CurrentDomain.BaseDirectory + "ReactAssets/index.wpf.bundle";
        
#endif

        public override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new MyReactPage(),
            new DeviceInfoPackage(),
            new SpeechModelPackage(),
            //new RNSqlite2Package(),
        };

        public override bool UseDeveloperSupport
        {
            get
            {
#if !BUNDLE || DEBUG
                return true;
#else
                return false;
#endif
            }
        }

        //public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        //{
        //    return new List<INativeModule>
        //{
        //    new DialogModule(reactContext)
        //};
        //}

        //public IReadOnlyList<Type> CreateJavaScriptModulesConfig()
        //{
        //    return new List<Type>(0);
        //}

        //public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
        //{

        //    return new List<IViewManager> {
        //            new ReactUnityManager()
        //    };

        //}

    }


}
