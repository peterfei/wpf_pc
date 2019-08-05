using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Net;
using System.Net.Sockets;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System.IO;

enum VESAL_CMD_CODE
{
    START_CMD = 1,
    CONFIRM_CMD = 2,
    MSG_CMD = 3,
    CTRL_CMD = 4,
    WIN_HWND = 5
}

namespace vesal_network
{
    public class packet
    {
        public byte _cmd_code;
        public ushort _data_len;
        public byte[] _data;

        public byte[] create_output_buff()
        {
            byte[] buff = new byte[3 + _data_len];
            buff[0] = _cmd_code;
            buff[1] = (byte)(_data_len / 256);
            buff[2] = (byte)(_data_len % 256);
            _data.CopyTo(buff, 3);
            return buff;
        }

        public static byte[] create_output_from_string(byte cmd_code, String str)
        {
            byte[] textbuf = Encoding.UTF8.GetBytes(str);
            int len = textbuf.Length;
            byte[] buff = new byte[3 + len];
            buff[0] = cmd_code;

            buff[1] = (byte)(len / 256);
            buff[2] = (byte)(len % 256);
            for (int i = 0; i < len; i++)
            {
                buff[i + 3] = textbuf[i];
            }

            return buff;
        }
    }

    public class vesal_socket
    {
        public Socket _sock = null;
        byte[] _head_buff = new byte[3];
        byte[] _data_buff = new byte[1000];
        ushort _expect_len = 3;
        ushort _offset = 0;
        bool _get_header = false;

        public void reset_recv_buff()
        {
            _offset = 0;
            _expect_len = 3;
            _get_header = false;
        }

        public static ushort get_vesal_port()
        {
            return 16666;
        }

        public bool connect(String peer_ip, ushort port)
        {
            _sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            // _sock.ReceiveTimeout = 5000;
            IPEndPoint ie = new IPEndPoint(IPAddress.Parse(peer_ip), port);//��������IP�Ͷ˿�

            try
            {
                //��Ϊ�ͻ���ֻ���������ض��ķ�����������Ϣ�����Բ���Ҫ�󶨱�����IP�Ͷ˿ڡ�����Ҫ������
                // _sock.Connect(ie);
                IAsyncResult result = _sock.BeginConnect(ie, null, null);
                if (!result.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(100)))
                {
                    Console.WriteLine("connect Timeout!!!");
                    throw new TimeoutException("connect Timeout!!!");
                }
                _sock.EndConnect(result);
            }
            catch (SocketException e)
            {
                Console.WriteLine("unable to connect to server");
                Console.WriteLine(e.ToString());
                return false;
            }

            return true;
        }

        public Socket accept()
        {
            return _sock.Accept();
        }

        public bool listen(ushort port)
        {
            IPEndPoint ipep = new IPEndPoint(IPAddress.Parse("127.0.0.1"), port);//����Ԥʹ�õ�IP�Ͷ˿�
            _sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                _sock.Bind(ipep);//��
            }
            catch (Exception ex)
            {
                if (ex.Source != null)
                    Console.WriteLine("listen source: {0}", ex.Source);
                return false;
            }

            _sock.Listen(3);//����
            return true;
        }

        public int send_confirm()
        {
            byte[] data = packet.create_output_from_string((byte)VESAL_CMD_CODE.CONFIRM_CMD, "ok");
            return send_data(data);
        }

        public int send_data(byte[] data)
        {
            return _sock.Send(data, data.Length, SocketFlags.None);
        }

        static public ushort get_pack_len(byte[] data)
        {
            ushort b1 = (ushort)data[1];
            ushort b2 = (ushort)data[2];
            return (ushort)(b1 * 256 + b2);
        }

        public bool recv_packet(ref packet pk)
        {
            int ret = 0;
            if (!_get_header)
            {
                ret = _sock.Receive(_head_buff, _offset, _expect_len - _offset, SocketFlags.None);
            }
            else
            {
                ret = _sock.Receive(_data_buff, _offset, _expect_len - _offset, SocketFlags.None);
            }

            if (ret <= 0)
            {
                // link broken.
                throw new ArgumentNullException("value"); ;
            }

            _offset += (ushort)ret;
            if (_offset == _expect_len)
            {
                _offset = 0;
                if (!_get_header)
                {
                    // ��ͷ������ϡ�
                    _get_header = true;
                    _expect_len = get_pack_len(_head_buff);
                    return false;
                }
                else
                {
                    // һ���������ˡ�
                    _get_header = false;

                    //�����
                    pk._cmd_code = _head_buff[0];
                    pk._data_len = _expect_len;
                    pk._data = new byte[_expect_len];
                    for (int j = 0; j < _expect_len; j++)
                    {
                        pk._data[j] = _data_buff[j];
                    }
                    _expect_len = 3;
                    return true;
                }
            }

            return false;
        }

        public void close()
        {
            _sock.Close();
        }
    }


    class process_info
    {
        public static void record_process_info()
        {
            FileStream file = new FileStream("d:\\unity.txt", FileMode.Create);
            String pid = Process.GetCurrentProcess().Id.ToString() + "\n";
            String hwnd = Process.GetCurrentProcess().MainWindowHandle.ToString() + "\n";
            file.Write(System.Text.Encoding.UTF8.GetBytes(pid), 0, pid.Length);
            file.Write(System.Text.Encoding.UTF8.GetBytes(hwnd), 0, hwnd.Length);
            file.Close();
        }
    }


}