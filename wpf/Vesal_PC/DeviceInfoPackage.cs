using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VesalPCVip.DeviceInfoModel;

namespace VesalPCVip
{
    public class DeviceInfoPackage : IReactPackage
    {
        public static ReactContext context;
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            context = reactContext;
            DeviceInfoG info = new DeviceInfoG(reactContext);

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
