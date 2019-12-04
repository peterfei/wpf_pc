using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VesalPCVip.DialogModel;

namespace VesalPCVip
{
    public class DialogModelPackage : IReactPackage
    {
        public static ReactContext context;
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            context = reactContext;
            Dialog info = new Dialog(reactContext);

            return new List<INativeModule>
        {
               info,
        };
        }

        public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
        {

            return new List<IViewManager>(0);

        }
    }
}
