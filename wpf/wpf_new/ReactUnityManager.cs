// Copyright (c) Microsoft Corporation. All rights reserved.
// Portions derived from React Native:
// Copyright (c) 2015-present, Facebook, Inc.
// Licensed under the MIT License.

using Newtonsoft.Json.Linq;
using ReactNative.Collections;
using ReactNative.Modules.I18N;
using ReactNative.Modules.Image;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
using System;
using System.Collections.Generic;
//using System.Reactive.Disposables;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Diagnostics;


namespace wpf_new
{
    /// <summary>
    /// The view manager responsible for rendering native images.
    /// </summary>
    public class ReactUnityManager : SimpleViewManager<Border>
    {
        
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

        public FloatWin _floatWin { get; private set; }

        [ReactProp(ViewProps.Width)]
        public void SetWidth(Border view, int width)
        {
            //view.BorderThickness = new Thickness(width);
            view.Width = width;
        }

        [ReactProp(ViewProps.Height)]
        public void SetHeight(Border view, int height)
        {
            view.Height = height;
        }



        public override void SetDimensions(Border view, Dimensions dimensions)
        {
            var check_vesal_pid = false;
            foreach (Process p in Process.GetProcesses())
            {
                if (p.ProcessName == "vesal")
                {

                    check_vesal_pid = true;

                }
            }
            var gameHost = new GameHost(dimensions.Width, dimensions.Height);
            
            if (!check_vesal_pid) {

                
                view.Child = gameHost;
            }
            else{
              
                gameHost.moveWindow();
            }
            


        }


        public override void OnDropViewInstance(ThemedReactContext reactContext, Border view)
        {
            base.OnDropViewInstance(reactContext, view);    
        }



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
                //    Stretch = Stretch.UniformToFill
                //},
            };
            
            return border;
        }

        public static implicit operator Window(ReactUnityManager v)
        {
            throw new NotImplementedException();
        }
    }
}
