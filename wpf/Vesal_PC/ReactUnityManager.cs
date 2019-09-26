// Copyright (c) Microsoft Corporation. All rights reserved.
// Portions derived from React Native:
// Copyright (c) 2015-present, Facebook, Inc.
// Licensed under the MIT License.

using Newtonsoft.Json.Linq;
using ReactNative.Collections;
using ReactNative.Modules.Image;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Windows.Controls;
using System.Windows.Media;
using VesalPCVip.MyModel;

namespace VesalPCVip
{
    /// <summary>
    /// The view manager responsible for rendering native images.
    /// </summary>
    public class ReactUnityManager : SimpleViewManager<Border>
    {
        private readonly ConcurrentDictionary<Border, List<KeyValuePair<string, double>>> _imageSources =
            new ConcurrentDictionary<Border, List<KeyValuePair<string, double>>>();
        Border view;

        /// <summary>
        /// The view manager name.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RCTUnityView";
            }
        }

        /// <summary>
        /// The view manager event constants.
        /// </summary>
        public override JObject CustomDirectEventTypeConstants
        {
            get
            {
                return new JObject
                {
                    {
                        "topLoadStart",
                        new JObject
                        {
                            { "registrationName", "onLoadStart" }
                        }
                    },
                    {
                        "topLoad",
                        new JObject
                        {
                            { "registrationName", "onLoad" }
                        }
                    },
                    {
                        "topLoadEnd",
                        new JObject
                        {
                            { "registrationName", "onLoadEnd" }
                        }
                    },
                    {
                        "topError",
                        new JObject
                        {
                            { "registrationName", "onError" }
                        }
                    },
                };
            }
        }



        /// <summary>
        /// Called when view is detached from view hierarchy and allows for 
        /// additional cleanup.
        /// </summary>
        /// <param name="reactContext">The React context.</param>
        /// <param name="view">The view.</param>
        public override void OnDropViewInstance(ThemedReactContext reactContext, Border view)
        {
            base.OnDropViewInstance(reactContext, view);
            MyDialogModel.instance.KillProcessByName("vesal");
            _imageSources.TryRemove(view, out _);
        }

        [ReactPropGroup(
            ViewProps.BorderWidth,
            ViewProps.BorderLeftWidth,
            ViewProps.BorderRightWidth,
            ViewProps.BorderTopWidth,
            ViewProps.BorderBottomWidth,
            DefaultDouble = double.NaN)]


        public void SetBorderWidth(Border view, int index, double width)
        {
            var _width = width;
            //view.SetBorderWidth(ViewProps.BorderSpacingTypes[index], width);


        }


        [ReactProp("resizeMode")]
        public void SetResizeMode(Border view, string resizeMode)
        {
            if (resizeMode != null)
            {
                MyDialogModel.instance.KillProcessByName("vesal");
                var gameHost = new GameHost(MainWindow.mw.ActualHeight, MainWindow.mw.ActualWidth);
                // container.Child = gameHost;
                view.Child = gameHost;
            }
        }

        [ReactProp("borderColor", CustomType = "Color")]
        public void SetBorderColor(Border view, uint? color)
        {
            view.BorderBrush = new SolidColorBrush(Colors.DarkSlateGray);
        }

        public Boolean unity_proc = false;
        /// <summary>
        /// Creates the image view instance.
        /// </summary>
        /// <param name="reactContext">The React context.</param>
        /// <returns>The image view instance.</returns>
        protected override Border CreateViewInstance(ThemedReactContext reactContext)
        {


            var border = new Border
            {
                //Background = new ImageBrush
                //{
                //    Stretch = Stretch.UniformToFill,
                //},
            };
            border.BorderBrush = new SolidColorBrush(Colors.DarkSlateGray);
            border.Background = new SolidColorBrush(Colors.DarkSlateGray);
            var dpi = MyDialogModel.GetDpi();
            //var _width = Math.Round(System.Windows.SystemParameters.WorkArea.Width / 96 * (dpi * 96));
            //var _height = Math.Round(System.Windows.SystemParameters.WorkArea.Height/ 96 * (dpi * 96));
            //if (dpi == 1)
            //{
            //    _width = System.Windows.SystemParameters.WorkArea.Width;
            //    _height = System.Windows.SystemParameters.WorkArea.Height - 20;
            //}
            var _width = Math.Round(System.Windows.SystemParameters.FullPrimaryScreenWidth / 96 * (dpi * 96));
            var _height = Math.Round(System.Windows.SystemParameters.FullPrimaryScreenHeight / 96 * (dpi * 96));
            if (dpi == 1)
            {
                _width = System.Windows.SystemParameters.FullPrimaryScreenWidth;
                _height = System.Windows.SystemParameters.FullPrimaryScreenHeight;
            }


            var gameHost = new GameHost(_width, _height);


            //var gameHost = new GameHost(_width, 700);
            // container.Child = gameHost;
            border.Child = gameHost;

            return border;
        }



    }
}
