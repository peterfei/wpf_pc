using ReactNative.Bridge;
using ReactNative.Modules.Core;
using System;
using System.Collections;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using vesal_network;
using VesalPCVip.MyModel;

namespace VesalPCVip.Net
{
    public class ServerManager
    {
        //私有成员
        private static byte[] result = new byte[1024];
        private ushort myProt;// = 8900;   //端口  
        public static Socket serverSocket;
        public static Socket clientSocket;

        Thread myThread;
        static Thread receiveThread;

        //属性

        public int port { get; set; }
        //方法

        internal void StartServer()
        {
            string logPath = AppDomain.CurrentDomain.BaseDirectory + "win/vesal_Data/StreamingAssets/new_data/temp/";
            if (Directory.Exists(logPath))
            {
                Directory.CreateDirectory(logPath);
            }

            Random rd = new Random();
            string filename = AppDomain.CurrentDomain.BaseDirectory + "win/vesal_Data/StreamingAssets/port.txt";
            if (File.Exists(filename))
            {
                File.Delete(filename);
            }
            do
            {
                myProt = 16667;
                //myProt = (ushort)rd.Next(4000, 49000);

            } while (PortInUse(myProt));
            File.WriteAllText(filename, myProt + "");

            //myProt = 9677;

            Console.WriteLine("---------------------------------" + myProt);
            myProt = 16667;
            //FileStream fs = new FileStream(filename,FileMode.Create,FileAccess.ReadWrite) ;
            //byte[] data = System.Text.Encoding.UTF8.GetBytes(myProt.ToString());
            //fs.Write(data,0,data.Length);
            //fs.Flush();
            //fs.Close();
            //服务器IP地址  
            //IPAddress ip = IPAddress.Parse("127.0.0.1");
            //serverSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            ////绑定IP地址：端口  
            //serverSocket.Bind(new IPEndPoint(ip, myProt));  
            ////设定最多2个排队连接请求  
            //serverSocket.Listen(2);    

            //通过Clientsoket发送数据  
            myThread = new Thread(ListenClientConnect);
            myThread.Start();

        }
        public void broadcast()
        {



        }
        public void QuitServer()
        {
            if (serverSocket != null)
            {
                serverSocket.Close();
            }
            Console.WriteLine("serverSocket");
            if (clientSocket != null)
            {
                clientSocket.Close();
            }
            Console.WriteLine("clientSocket");
            if (myThread != null)
            {

                //myThread.Abort();
            }
            Console.WriteLine("myThread");
            if (receiveThread != null)
            {
                //receiveThread.Abort();
            }
            Console.WriteLine("receiveThread");
        }


        //serverManager
        public static void SendMessage(string msg)
        {
            if (clientSocket != null)
            {
                clientSocket.Send(Encoding.UTF8.GetBytes(msg), SocketFlags.None);
            }
            else
            {
                ServerManager.sendToJs("Unity loading! wait a minute. ");
            }
        }

        vesal_socket _listen_sock = new vesal_socket();
        /// <summary>  
        /// 监听客户端连接  
        /// </summary>  
        private void ListenClientConnect()
        {
            bool result = _listen_sock.listen(myProt);
            if (result)
            {
                Console.WriteLine("listen ok");
            }
            else
            {
                Console.WriteLine("listen failed!");
            }
            receiveThread = new Thread(ReceiveSocket);
            receiveThread.Start();
            //try
            //{
            //    Socket sc = serverSocket.Accept();
            //    //sc.Send(Encoding.UTF8.GetBytes("Server Say Hello!!!"));
            //    //ServerManager.sendToJs("Server Say Hello!!!");
            //    Console.WriteLine("建立连接！");
            //    receiveThread = new Thread(ReceiveMessage);
            //    receiveThread.Start(sc);
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine(ex.Message);
            //}
        }
        public static ReactContext Context { get; set; }
        public static void sendToJs(string data)
        {
            if (Context == null)
            {
                Context = MyReactPage.context;
            }

            Context.GetJavaScriptModule<RCTDeviceEventEmitter>().emit("testBind", data);
        }

        internal static bool PortInUse(int port)
        {
            bool inUse = false;

            IPGlobalProperties ipProperties = IPGlobalProperties.GetIPGlobalProperties();
            IPEndPoint[] ipEndPoints = ipProperties.GetActiveTcpListeners();


            foreach (IPEndPoint endPoint in ipEndPoints)
            {
                if (endPoint.Port == port)
                {
                    inUse = true;
                    break;
                }
            }


            return inUse;
        }

        private int find_sock_seted(Socket sock)
        {
            for (int i = 0; i < _client_socks.Count; i++)
            {
                if (sock.Handle == ((vesal_network.vesal_socket)_client_socks[i])._sock.Handle)
                    return i;
            }
            return -1;
        }


        private void remove_sock_list(Socket sock)
        {
            for (int i = 0; i < _client_socks.Count; i++)
            {
                if (sock.Handle == ((vesal_network.vesal_socket)_client_socks[i])._sock.Handle)
                {
                    _client_socks.RemoveAt(i);
                    return;
                }
            }
        }
        //send_cmd((byte)VESAL_CMD_CODE.MSG_CMD,"hide");
        public static bool send_cmd(byte cmd, String str)
        {
            byte[] data = packet.create_output_from_string(cmd, str);
            for (int i = 0; i < _client_socks.Count; i++)
            {
                try
                {
                    ((vesal_socket)_client_socks[i]).send_data(data);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                    Console.WriteLine(e.StackTrace);
                }
            }
            return true;
        }

        static ArrayList _client_socks = new ArrayList();
        private void ReceiveSocket()
        {

            while (true)
            {
                try
                {
                    ArrayList listenList = new ArrayList();
                    ArrayList clientList = new ArrayList();
                    listenList.Add(_listen_sock._sock);
                    Socket.Select(listenList, null, null, 1);
                    if (listenList.Count > 0)
                    {
                        vesal_network.vesal_socket sok = new vesal_network.vesal_socket();
                        sok._sock = _listen_sock.accept();
                        _client_socks.Add(sok);
                        vesal_log.vesal_write_log("peer connect!");
                    }

                    for (int i = 0; i < _client_socks.Count; i++)
                    {
                        clientList.Add(((vesal_network.vesal_socket)_client_socks[i])._sock);
                    }

                    if (clientList.Count == 0)
                        continue;

                    Socket.Select(clientList, null, null, 1);
                    for (int i = 0; i < clientList.Count; i++)
                    {
                        int index = find_sock_seted((Socket)clientList[i]);
                        bool get_packet = false;
                        try
                        {
                            packet pk = new packet();
                            get_packet = ((vesal_network.vesal_socket)_client_socks[index]).recv_packet(ref pk);
                            if (get_packet)
                            {
                                byte[] buff = new byte[pk._data_len];
                                for (int j = 0; j < pk._data_len; j++)
                                {
                                    buff[j] = pk._data[j];
                                }
                                //接收
                                string str = System.Text.Encoding.UTF8.GetString(buff);
                                vesal_log.vesal_write_log("+++++++++++++" + str);
                                if (pk._cmd_code == (byte)VESAL_CMD_CODE.MSG_CMD)
                                {
                                    if (str == "hide")
                                    {
                                        ServerManager.sendToJs("hide");
                                        GameHost.DeactivateUnityWindow();
                                        //MyDialogModel.instance.hide();
                                    }
                                    else if (str == "show")
                                    {
                                        ServerManager.sendToJs("show");
                                        GameHost.ActivateUnityWindow();
                                    }
                                    else if (str == "OpenClientCenter")
                                    {
                                        ServerManager.sendToJs("OpenClientCenter");
                                    }
                                    else if (str == "ShowMall") {
                                        ServerManager.sendToJs("ShowMall");
                                    }else if(str=="GetClientInfo"){
                                        ServerManager.sendToJs("GetClientInfo");
                                    }
                                   
                                    vesal_log.vesal_write_log("change model.");
                                }

                            }
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.StackTrace);
                            Console.WriteLine(e.Message);
                            // link broken.
                            ((vesal_network.vesal_socket)_client_socks[index]).close();
                            remove_sock_list((Socket)clientList[i]);
                            vesal_log.vesal_write_log("link broken");
                        }
                    }
                }
                catch (Exception e)
                {
                    String str = e.Message;
                    Console.WriteLine(e.StackTrace);
                    Console.WriteLine(e.Message);
                }

            }
        }
        /// <summary>  
        /// 接收消息  
        /// </summary>  
        /// <param name="clientSocket"></param>  
        private void ReceiveMessage(object sc)
        {
            Socket myClientSocket = (Socket)sc;
            clientSocket = myClientSocket;
            //Console.WriteLine(" -=-=-=");
            while (true)
            {
                //Console.WriteLine(" -=-=-=");
                try
                {
                    // Console.WriteLine(" -=-=-=");
                    //Console.WriteLine(!myClientSocket.Poll(100, SelectMode.SelectRead));
                    // Console.WriteLine(myClientSocket.Available);
                    //!myClientSocket.Poll(100,SelectMode.SelectRead) && 
                    if (myClientSocket.Available != 0)
                    {
                        result = new byte[1024];
                        //通过clientSocket接收数据  
                        int receiveNumber = myClientSocket.Receive(result);
                        string message = Encoding.UTF8.GetString(result, 0, receiveNumber);
                        //if (message == "I'm Unity,Save me!") {
                        //}

                        Console.WriteLine(" 接收客户端{0}消息{1}", myClientSocket.RemoteEndPoint.ToString(), message);
                        //發送給Js

                        switch (message)
                        {
                            case "disconnect":
                                myClientSocket.Shutdown(SocketShutdown.Both);
                                myClientSocket.Close();
                                clientSocket = null;
                                myThread = new Thread(ListenClientConnect);
                                myThread.Start();
                                break;
                            case "hide":
                                MyDialogModel.instance.hide();
                                break;
                            case "show":
                                //MyDialogModel.isShow = true;
                                MyDialogModel.instance.show();
                                break;
                            case "loading":
                                ServerManager.sendToJs("loading");
                                break;
                        }
                    }
                    //Console.WriteLine("接收客户端{0}消息{1}", myClientSocket.RemoteEndPoint.ToString(), Encoding.ASCII.GetString(result, 0, receiveNumber));
                }
                catch (Exception ex)
                {
                    try
                    {
                        Console.WriteLine(ex.Message);
                        myClientSocket.Shutdown(SocketShutdown.Both);
                        myClientSocket.Close();
                        clientSocket = null;
                        myThread = new Thread(ListenClientConnect);
                        myThread.Start();
                        break;
                    }
                    catch (Exception)
                    {

                    }

                }
            }
        }
    }
}


class vesal_log
{
    static string logPath = AppDomain.CurrentDomain.BaseDirectory + "win/test_Data/StreamingAssets/temp/";

    public static String _log_path = logPath + "unity.log";
    static String _pid = "xxx";
    static public void vesal_write_log(String logcontent)
    {
        if (Directory.Exists(logPath))
        {
            Directory.CreateDirectory(logPath);
        }

        try
        {
            String time_now = DateTime.Now.ToString();
            FileStream fs = new FileStream(_log_path, System.IO.FileMode.Append);
            //获得字节数组
            byte[] data = System.Text.Encoding.UTF8.GetBytes(time_now + " : [" + _pid + "] " + logcontent + "\r\n\r\n");
            //开始写入
            fs.Write(data, 0, data.Length);
            //清空缓冲区、关闭流
            fs.Flush();
            fs.Close();
        }
        catch
        {
        }
    }
}
