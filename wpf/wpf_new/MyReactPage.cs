using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wpf_new
{
    public class MyReactPage : IReactPackage
    {
        public static ReactContext context;
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            context = reactContext;
           // MyDialogModel mdm = new MyDialogModel(reactContext);

            return new List<INativeModule>
        {
              
        };
        }

        public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
        {

            return new List<IViewManager> {
                    new ReactUnityManager()
            };

        }
    }
}
