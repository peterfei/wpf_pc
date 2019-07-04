using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Collections;
using ReactNative.Modules.Core;
using System;
using WxPayAPI;

namespace wpf_new.WxPay
{
    public class WxPay : ReactContextNativeModuleBase
    {

        public static WxPay instance;
        public WxPay(ReactContext reactContext)
            : base(reactContext)
        {

            instance = this;

        }

        public override string Name
        {
            get
            {
                return "WxPay";
            }
        }
        [ReactMethod]
        public void GetFirstMacAddress(IPromise promise)
        {
            string macAddresses = string.Empty;

            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (nic.OperationalStatus == OperationalStatus.Up)
                {
                    macAddresses += nic.GetPhysicalAddress().ToString();

                    break;
                }
            }
            promise.Resolve(macAddresses);
            // return macAddresses;
        }

        [ReactMethod]
        //生成直接微信支付url，支付url有效期为10分钟,模式二
        public void GetWXPayUrl(JObject config, IPromise promise)
        {
            var productId = config.Value<string>("product_id") ?? "";
            WxPayData data = new WxPayData();
            data.SetValue("body", "Vesali PC版");//商品描述
            //data.SetValue("attach", idcard);//附加数据
            string  out_trade_no = WxPayApi.GenerateOutTradeNo();
            //Session["out_trade_no"] = out_trade_no;
            data.SetValue("out_trade_no", out_trade_no);//随机字符串
            string total = Convert.ToInt32(0.01).ToString();
            string money ="0.01元";
            data.SetValue("total_fee", total);//总金额
            data.SetValue("time_start", DateTime.Now.ToString("yyyyMMddHHmmss"));//交易起始时间
            data.SetValue("time_expire", DateTime.Now.AddMinutes(10).ToString("yyyyMMddHHmmss"));//交易结束时间
            data.SetValue("goods_tag", "Vesali PC版");//商品标记
            data.SetValue("trade_type", "NATIVE");//交易类型
            data.SetValue("product_id", productId);//商品ID
            WxPayData result = WxPayApi.UnifiedOrder(data);//调用统一下单接口
            string url = result.GetValue("code_url").ToString();//获得统一下单接口返回的二维码链接
            //PreWxPayOrder(idcard, out_trade_no);
            //return url;
             promise.Resolve(url);
        }


    }
}
