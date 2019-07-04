using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using ReactNative.UIManager;

namespace wpf_new
{
    /// <summary>
    /// FloatWin.xaml 的交互逻辑
    /// </summary>
    public partial class FloatWin : Window
    {
        private ReactUnityManager reactUnityManager;
        private Dimensions dimensions;

        public FloatWin()
        {
            InitializeComponent();
        }

        public FloatWin(Window shellWindow)
        {
        }

        public FloatWin(ReactUnityManager reactUnityManager)
        {
            this.reactUnityManager = reactUnityManager;
        }

        public FloatWin(Dimensions dimensions)
        {
            this.dimensions = dimensions;
        }
    }
}
