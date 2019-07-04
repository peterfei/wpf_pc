using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System;
using System.Collections.Generic;

namespace wpf_new
{
    internal class AppReactPage : ReactPage
    {
        public override string MainComponentName => "wpf_new";

        public override string JavaScriptMainModuleName => "index";

#if BUNDLE
        public override string JavaScriptBundleFile => AppDomain.CurrentDomain.BaseDirectory + "ReactAssets/index.wpf.bundle";
#endif

        public override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new MyReactPage(),
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
    }
}
