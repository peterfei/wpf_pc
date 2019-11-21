using System.Collections;
using System.Threading;
using System.IO;
using System.Net;
using System;
using System.Linq;
using System.Xml;
using System.Text;
using System.Text.RegularExpressions;
using LiteDB;
using System.Collections.Generic;


namespace VesalCommon
{
    enum VESAL_DL_DEST
    {
        HOME = 1,
        PPT = 2
    }

    public class Vesal_Http_Oper
    {
        public long _dld_data_count = 0;
        public long _totl_size = 0;
        private static readonly string DefaultUserAgent = "web_spider";
       
        static public String http_get(String Url, String get_para)
        {
            try
            {
                String Query_url = Url + (get_para == "" ? "" : "?") + get_para;
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Query_url);
                request.Method = "GET";
                request.ContentType = "text/html;charset=UTF-8";
                request.UserAgent = DefaultUserAgent;

                if (common_value._cookie_str != "")
                {
                    request.Headers.Add("Cookie", common_value._cookie_str);
                }

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream myResponseStream = response.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
                string retString = myStreamReader.ReadToEnd();
                myStreamReader.Close();
                myResponseStream.Close();

                return retString;
            }            
            catch(Exception ex)
            {
                vesal_log.vesal_write_log("httpget失败 " + ex.Message);
                return "";
            }
        }

        public static HttpWebResponse http_post(string url, IDictionary<string, string> parameters, Encoding charset)
        {
            HttpWebRequest request = null;
            //HTTPSQ请求
            request = WebRequest.Create(url) as HttpWebRequest;
            request.ProtocolVersion = HttpVersion.Version10;
            request.Method = "POST";
            request.Proxy = null;
            request.ContentType = "application/x-www-form-urlencoded";
            request.UserAgent = DefaultUserAgent;

            if (common_value._cookie_str != "")
            {
                request.Headers.Add("Cookie", common_value._cookie_str);
            }

            //如果需要POST数据   
            if (!(parameters == null || parameters.Count == 0))
            {
                StringBuilder buffer = new StringBuilder();
                int i = 0;
                foreach (string key in parameters.Keys)
                {
                    if (i > 0)
                    {
                        buffer.AppendFormat("&{0}={1}", key, parameters[key]);
                    }
                    else
                    {
                        buffer.AppendFormat("{0}={1}", key, parameters[key]);
                    }
                    i++;
                }
                byte[] data = charset.GetBytes(buffer.ToString());
                using (Stream stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }
            }
            return request.GetResponse() as HttpWebResponse;
        }

        public static bool Query_Model_Tree_Root(String url, ref List<String> lst_root)
        {
            String jstr = null;
            if (common_value._offline_mode)
            {
                offline_data_recorder data_recd = new offline_data_recorder();
                data_recd.set_record_file_path("root");
                jstr = data_recd.load_offline_data();
                if (jstr == "")
                {
                    return false;
                }
            }
            else
            {
                jstr = http_get(url, "model=/");

                offline_data_recorder data_recd = new offline_data_recorder();
                data_recd.set_record_file_path("root");
                data_recd.save_json(jstr);
            }
            

            bool ret = json_parse.query_root_parse(jstr, ref lst_root);
            if (!ret)
            {
                int err_code = json_parse.parse_errcode(jstr);
                if (err_code == 3)
                {
                    throw new Exception("time_out"); // 超时了
                }
            }
            return ret;
        }

        public static int Query_Model_Tree(String url, String request_para, ref List<model_query_item> list_items)
        {
            // request_para : "系统解剖\运动系统\骨学"
            String querey_dir = request_para.Replace("-", "\\");
            try {
                String jstr = null;
                if (common_value._offline_mode)
                {
                    offline_data_recorder data_recd = new offline_data_recorder();
                    data_recd.set_record_file_path(request_para);
                    jstr = data_recd.load_offline_data();
                    if (jstr == "")
                    {
                        list_items = new List<model_query_item>();
                        return 0;
                    }
                }
                else
                {
                    jstr = http_get(url, "model=" + request_para);
                    offline_data_recorder data_recd = new offline_data_recorder();
                    data_recd.set_record_file_path(request_para);
                    data_recd.save_json(jstr);
                }

                item_response jp = null;
                if (!json_parse.query_model_parse(jstr, ref jp))
                {
                    vesal_log.vesal_write_log("解析查询模型报文错误。");
                    return -1;
                }
                list_items = jp.items;

                if (list_items == null)
                { // 解析失败，估计超时了.
                    int err = json_parse.parse_errcode(jstr);
                    if (err >= 0)
                        return err;
                }

                return 0;
            }
            catch
            {
                return -1;
            }
        }

        virtual public void set_dld_progress()
        {
 
        }
  
        public bool Http_Download(string url, string localfile)
        {
            bool flag = false;
            long startPosition = 0; // 上次下载的文件起始位置
            FileStream writeStream; // 写入本地文件流对象
            
            long remoteFileLength = GetHttpLength(url);// 取得远程文件长度
                                                       // 判断要下载的文件夹是否存在

            _dld_data_count = 0;
            _totl_size = remoteFileLength; // 记录一下总长度.
            if (File.Exists(localfile))
            {
                writeStream = File.OpenWrite(localfile);             // 存在则打开要下载的文件
                startPosition = writeStream.Length;                  // 获取已经下载的长度

                if (startPosition >= remoteFileLength)
                {
                    writeStream.Close();
                    return false;
                }
                else
                {
                    writeStream.Seek(startPosition, SeekOrigin.Current); // 本地文件写入位置定位
                }
            }
            else
            {
                writeStream = new FileStream(localfile,  System.IO.FileMode.Create);// 文件不保存创建一个文件
                startPosition = 0;
            }


            try
            {
                HttpWebRequest myRequest = (HttpWebRequest)HttpWebRequest.Create(url);// 打开网络连接
                myRequest.UserAgent = common_value._user_agent;
                if (startPosition > 0)
                {
                    myRequest.AddRange((int)startPosition);// 设置Range值,与上面的writeStream.Seek用意相同,是为了定义远程文件读取位置
                }


                Stream readStream = myRequest.GetResponse().GetResponseStream();// 向服务器请求,获得服务器的回应数据流


                byte[] btArray = new byte[1024];// 定义一个字节数据,用来向readStream读取内容和向writeStream写入内容
                int contentSize = readStream.Read(btArray, 0, btArray.Length);// 向远程文件读第一次
                _dld_data_count += contentSize;

                long currPostion = startPosition;

                while (contentSize > 0)// 如果读取长度大于零则继续读
                {
                    currPostion += contentSize;
                    int percent = (int)(currPostion * 100 / remoteFileLength);

                    writeStream.Write(btArray, 0, contentSize);// 写入本地文件
                    contentSize = readStream.Read(btArray, 0, btArray.Length);// 继续向远程文件读取
                    _dld_data_count += contentSize;
                    set_dld_progress(); //等子类重载
                }

                //关闭流
                writeStream.Close();
                readStream.Close();

                flag = true;        //返回true下载成功
            }
            catch (Exception)
            {
                writeStream.Close();
                flag = false;       //返回false下载失败
            }

            return flag;
        }

        // 从文件头得到远程文件的长度
        private static long GetHttpLength(string url)
        {
            long length = 0;

            try
            {
                HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(url);// 打开网络连接
                req.UserAgent = common_value._user_agent;
                HttpWebResponse rsp = (HttpWebResponse)req.GetResponse();

                if (rsp.StatusCode == HttpStatusCode.OK)
                {
                    length = rsp.ContentLength;// 从文件头得到远程文件的长度
                }

                rsp.Close();
                return length;
            }
            catch (Exception e)
            {
                vesal_log.vesal_write_error(e.Message);
                return length;
            }

        }

    }

    public interface IDownloader
    {

        #region Basic settings of a WebDownloader.

        Uri Url { get; }
        string DownloadPath { get; set; }
        long TotalSize { get; set; }

        ICredentials Credentials { get; set; }
        IWebProxy Proxy { get; set; }

        #endregion


        #region Support the "Pause", "Resume" and Multi-Threads feature.

        bool IsRangeSupported { get; set; }
        long StartPoint { get; set; }
        long EndPoint { get; set; }

        #endregion

        #region The downloaded data and status.

        long DownloadedSize { get; }
        int CachedSize { get; }

        bool HasChecked { get; set; }
        DownloadStatus Status { get; }
        TimeSpan TotalUsedTime { get; }

        #endregion

        #region Advanced settings of a WebDownloader

        int BufferSize { get; set; }
        int BufferCountPerNotification { get; set; }
        int MaxCacheSize { get; set; }

        #endregion


        event EventHandler<DownloadCompletedEventArgs> DownloadCompleted;
        event EventHandler<DownloadProgressChangedEventArgs> DownloadProgressChanged;
        event EventHandler StatusChanged;

        void CheckUrl(out string fileName);

        void BeginDownload();
        void Download();

        void Pause();

        void Resume();
        void BeginResume();

        void Cancel();
    }

    public class DownloadCompletedEventArgs : EventArgs
    {
        public Int64 DownloadedSize { get; private set; }
        public Int64 TotalSize { get; private set; }
        public Exception Error { get; private set; }
        public TimeSpan TotalTime { get; private set; }
        public FileInfo DownloadedFile { get; private set; }

        public DownloadCompletedEventArgs(
            FileInfo downloadedFile, Int64 downloadedSize,
            Int64 totalSize, TimeSpan totalTime, Exception ex)
        {
            this.DownloadedFile = downloadedFile;
            this.DownloadedSize = downloadedSize;
            this.TotalSize = totalSize;
            this.TotalTime = totalTime;
            this.Error = ex;
        }
    }

    public enum DownloadStatus
    {
        /// <summary>
        /// The DownloadClient is initialized.
        /// </summary>
        Initialized,

        /// <summary>
        /// The client is waiting for an idle thread / resource to start downloading.
        /// </summary>
        Waiting,

        /// <summary>
        /// The client is downloading data.
        /// </summary>
        Downloading,

        /// <summary>
        /// The client is releasing the resource, and then the downloading
        /// will be paused.
        /// </summary>
        Pausing,

        /// <summary>
        /// The downloading is paused.
        /// </summary>
        Paused,

        /// <summary>
        /// The client is releasing the resource, and then the downloading
        /// will be canceled.
        /// </summary>
        Canceling,

        /// <summary>
        /// The downloading is Canceled.
        /// </summary>
        Canceled,

        /// <summary>
        /// The downloading is Completed.
        /// </summary>
        Completed
    }

    public class DownloadProgressChangedEventArgs : EventArgs
    {
        public Int64 ReceivedSize { get; private set; }
        public Int64 TotalSize { get; private set; }
        public int DownloadSpeed { get; private set; }

        public DownloadProgressChangedEventArgs(Int64 receivedSize,
            Int64 totalSize, int downloadSpeed)
        {
            this.ReceivedSize = receivedSize;
            this.TotalSize = totalSize;
            this.DownloadSpeed = downloadSpeed;
        }
    }


    public class HttpDownloadClient : IDownloader
    {
        // Used when creates or writes a file.
        static object fileLocker = new object();

        object statusLocker = new object();


        // The Url of the file to be downloaded.
        public Uri Url { get; private set; }

        // The local path to store the file.
        // If there is no file with the same name, a new file will be created.
        public string DownloadPath { get; set; }

        // Ask the server for the file size and store it.
        // Use the CheckUrl method to initialize this property internally.
        public long TotalSize { get; set; }

        public ICredentials Credentials { get; set; }

        public IWebProxy Proxy { get; set; }

        /// <summary>
        /// Specify whether the remote server supports "Accept-Ranges" header.
        /// Use the CheckUrl method to initialize this property internally.
        /// </summary>
        public bool IsRangeSupported { get; set; }

        // The properties StartPoint and EndPoint can be used in the multi-thread download scenario, and
        // every thread starts to download a specific block of the whole file. 
        public long StartPoint { get; set; }

        public long EndPoint { get; set; }


        // The size of downloaded data that has been writen to local file.
        public long DownloadedSize { get; private set; }

        public int CachedSize { get; private set; }

        public bool HasChecked { get; set; }


        DownloadStatus status;

        // If status changed, fire StatusChanged event.
        public DownloadStatus Status
        {
            get
            {
                return status;
            }
            private set
            {
                lock (statusLocker)
                {
                    if (status != value)
                    {
                        status = value;
                        this.OnStatusChanged(EventArgs.Empty);
                    }
                }
            }
        }

        // Store the used time spent in downloading data. The value does not include
        // the paused time and it will only be updated when the download is paused, 
        // canceled or completed.
        private TimeSpan usedTime = new TimeSpan();

        private DateTime lastStartTime;

        /// <summary>
        /// If the status is Downloading, then the total time is usedTime. Else the total 
        /// should include the time used in current download thread.
        /// </summary>
        public TimeSpan TotalUsedTime
        {
            get
            {
                if (this.Status != DownloadStatus.Downloading)
                {
                    return usedTime;
                }
                else
                {
                    return usedTime.Add(DateTime.Now - lastStartTime);
                }
            }
        }

        // The time and size in last DownloadProgressChanged event. These two fields
        // are used to calculate the download speed.
        private DateTime lastNotificationTime;
        private Int64 lastNotificationDownloadedSize;

        // If get a number of buffers, then fire DownloadProgressChanged event.
        public int BufferCountPerNotification { get; set; }

        // Set the BufferSize when read data in Response Stream.
        public int BufferSize { get; set; }

        // The cache size in memory.
        public int MaxCacheSize { get; set; }

        public event EventHandler<DownloadProgressChangedEventArgs> DownloadProgressChanged;

        public event EventHandler<DownloadCompletedEventArgs> DownloadCompleted;

        public event EventHandler StatusChanged;

        /// <summary>
        /// Download the whole file.
        /// </summary>
        public HttpDownloadClient(string url)
            : this(url, 0)
        {
        }

        /// <summary>
        /// Download the file from a start point to the end.
        /// </summary>
        public HttpDownloadClient(string url, long startPoint)
            : this(url, startPoint, int.MaxValue)
        {
        }

        /// <summary>
        /// Download a block of the file. The default buffer size is 1KB, memory cache is
        /// 1MB, and buffer count per notification is 64.
        /// </summary>
        public HttpDownloadClient(string url, long startPoint, long endPoint)
            : this(url, startPoint, endPoint, 1024, 1048576, 64)
        {
        }

        public HttpDownloadClient(string url, long startPoint,
            long endPoint, int bufferSize, int cacheSize, int bufferCountPerNotification)
        {

            this.StartPoint = startPoint;
            this.EndPoint = endPoint;
            this.BufferSize = bufferSize;
            this.MaxCacheSize = cacheSize;
            this.BufferCountPerNotification = bufferCountPerNotification;

            this.Url = new Uri(url, UriKind.Absolute);

            // Set the default value of IsRangeSupported.
            this.IsRangeSupported = true;

            // Set the Initialized status.
            this.status = DownloadStatus.Initialized;
        }



        /// <summary>
        /// Check the Uri to find its size, and whether it supports "Pause". 
        /// </summary>
        public void CheckUrl(out string fileName)
        {
            fileName = DownloaderHelper.CheckUrl(this);
        }


        /// <summary>
        /// Check whether the destination file exists. If not, create a file with the same
        /// size as the file to be downloaded.
        /// </summary>
        void CheckFileOrCreateFile()
        {
            DownloaderHelper.CheckFileOrCreateFile(this, fileLocker);
        }

        void CheckUrlAndFile(out string fileName)
        {
            CheckUrl(out fileName);
            CheckFileOrCreateFile();

            this.HasChecked = true;
        }

        void EnsurePropertyValid()
        {
            if (this.StartPoint < 0)
            {
                throw new ArgumentOutOfRangeException(
                    "StartPoint cannot be less then 0. ");
            }

            if (this.EndPoint < this.StartPoint)
            {
                throw new ArgumentOutOfRangeException(
                    "EndPoint cannot be less then StartPoint ");
            }

            if (this.BufferSize < 0)
            {
                throw new ArgumentOutOfRangeException(
                    "BufferSize cannot be less then 0. ");
            }

            if (this.MaxCacheSize < this.BufferSize)
            {
                throw new ArgumentOutOfRangeException(
                    "MaxCacheSize cannot be less then BufferSize ");
            }

            if (this.BufferCountPerNotification <= 0)
            {
                throw new ArgumentOutOfRangeException(
                    "BufferCountPerNotification cannot be less then 0. ");
            }
        }


        /// <summary>
        /// Start to download.
        /// </summary>
        public void Download()
        {

            // Only idle download client can be started.
            if (this.Status != DownloadStatus.Initialized)
            {
                throw new ApplicationException("Only Initialized download client can be started.");
            }

            this.Status = DownloadStatus.Waiting;

            // Start to download in the same thread.
            DownloadInternal(null);
        }


        /// <summary>
        /// Start to download using ThreadPool.
        /// </summary>
        public void BeginDownload()
        {

            // Only idle download client can be started.
            if (this.Status != DownloadStatus.Initialized)
            {
                throw new ApplicationException("Only Initialized download client can be started.");
            }

            this.Status = DownloadStatus.Waiting;

            ThreadPool.QueueUserWorkItem(DownloadInternal);
        }

        /// <summary>
        /// Pause the download.
        /// </summary>
        public void Pause()
        {
            // Only idle or downloading client can be paused.
            switch (this.Status)
            {
                case DownloadStatus.Downloading:
                    this.Status = DownloadStatus.Pausing;
                    break;
                default:
                    throw new ApplicationException("Only downloading client can be paused.");
            }
        }

        /// <summary>
        /// Resume the download.
        /// </summary>
        public void Resume()
        {
            // Only paused client can be resumed.
            if (this.Status != DownloadStatus.Paused)
            {
                throw new ApplicationException("Only paused client can be resumed.");
            }

            this.Status = DownloadStatus.Waiting;

            // Start to download in the same thread.
            DownloadInternal(null);
        }

        /// <summary>
        /// Resume the download using ThreadPool.
        /// </summary>
        public void BeginResume()
        {
            // Only paused client can be resumed.
            if (this.Status != DownloadStatus.Paused)
            {
                throw new ApplicationException("Only paused client can be resumed.");
            }

            this.Status = DownloadStatus.Waiting;

            ThreadPool.QueueUserWorkItem(DownloadInternal);
        }

        /// <summary>
        /// Cancel the download.
        /// </summary>
        public void Cancel()
        {
            if (this.Status == DownloadStatus.Initialized
                || this.Status == DownloadStatus.Waiting
                || this.Status == DownloadStatus.Completed
                || this.Status == DownloadStatus.Paused
                || this.Status == DownloadStatus.Canceled)
            {
                this.Status = DownloadStatus.Canceled;
            }
            else if (this.Status == DownloadStatus.Canceling
                || this.Status == DownloadStatus.Pausing
                || this.Status == DownloadStatus.Downloading)
            {
                this.Status = DownloadStatus.Canceling;
            }
        }


        /// <summary>
        /// Download the data using HttpWebRequest. It will read a buffer of bytes from the
        /// response stream, and store the buffer to a MemoryStream cache first.
        /// If the cache is full, or the download is paused, canceled or completed, write
        /// the data in cache to local file.
        /// </summary>
        void DownloadInternal(object obj)
        {

            if (this.Status != DownloadStatus.Waiting)
            {
                return;
            }

            HttpWebRequest webRequest = null;
            HttpWebResponse webResponse = null;
            Stream responseStream = null;
            MemoryStream downloadCache = null;
            this.lastStartTime = DateTime.Now;

            try
            {

                if (!HasChecked)
                {
                    string filename = string.Empty;
                    CheckUrlAndFile(out filename);
                }

                this.EnsurePropertyValid();

                // Set the status.
                this.Status = DownloadStatus.Downloading;

                // Create a request to the file to be  downloaded.
                webRequest = DownloaderHelper.InitializeHttpWebRequest(this);

                // Specify the block to download.
                if (EndPoint != int.MaxValue)
                {
                    webRequest.AddRange(StartPoint + DownloadedSize, EndPoint);
                }
                else
                {
                    webRequest.AddRange(StartPoint + DownloadedSize);
                }

                // Retrieve the response from the server and get the response stream.
                webResponse = (HttpWebResponse)webRequest.GetResponse();

                responseStream = webResponse.GetResponseStream();
                responseStream.ReadTimeout = 15 * 1000; //15 秒读不到数据，就认为吊死。


                // Cache data in memory.
                downloadCache = new MemoryStream(this.MaxCacheSize);

                byte[] downloadBuffer = new byte[this.BufferSize];

                int bytesSize = 0;
                CachedSize = 0;
                int receivedBufferCount = 0;

                // Download the file until the download is paused, canceled or completed.
                while (true)
                {

                    // Read a buffer of data from the stream.
                    bytesSize = responseStream.Read(downloadBuffer, 0, downloadBuffer.Length);

                    // If the cache is full, or the download is paused, canceled or 
                    // completed, write the data in cache to local file.
                    if (this.Status != DownloadStatus.Downloading
                        || bytesSize == 0
                        || this.MaxCacheSize < CachedSize + bytesSize)
                    {

                        try
                        {
                            // Write the data in cache to local file.
                            WriteCacheToFile(downloadCache, CachedSize);

                            this.DownloadedSize += CachedSize;

                            // Stop downloading the file if the download is paused, 
                            // canceled or completed. 
                            if (this.Status != DownloadStatus.Downloading
                                || bytesSize == 0)
                            {
                                break;
                            }

                            // Reset cache.
                            downloadCache.Seek(0, SeekOrigin.Begin);
                            CachedSize = 0;
                        }
                        catch (Exception ex)
                        {
                            // Fire the DownloadCompleted event with the error.
                            this.OnDownloadCompleted(
                                new DownloadCompletedEventArgs(
                                    null,
                                    this.DownloadedSize,
                                    this.TotalSize,
                                    this.TotalUsedTime,
                                    ex));
                            return;
                        }

                    }

                    // Write the data from the buffer to the cache in memory.
                    downloadCache.Write(downloadBuffer, 0, bytesSize);

                    CachedSize += bytesSize;

                    receivedBufferCount++;

                    // Fire the DownloadProgressChanged event.
                    if (receivedBufferCount == this.BufferCountPerNotification)
                    {
                        InternalDownloadProgressChanged(CachedSize);
                        receivedBufferCount = 0;
                    }
                }


                // Update the used time when the current doanload is stopped.
                usedTime = usedTime.Add(DateTime.Now - lastStartTime);

                // Update the status of the client. Above loop will be stopped when the 
                // status of the client is pausing, canceling or completed.
                if (this.Status == DownloadStatus.Pausing)
                {
                    this.Status = DownloadStatus.Paused;
                }
                else if (this.Status == DownloadStatus.Canceling)
                {
                    this.Status = DownloadStatus.Canceled;
                }
                else
                {
                    this.Status = DownloadStatus.Completed;
                    return;
                }

            }
            catch (Exception ex)
            {
                // Fire the DownloadCompleted event with the error.
                this.OnDownloadCompleted(
                    new DownloadCompletedEventArgs(
                        null,
                        this.DownloadedSize,
                        this.TotalSize,
                        this.TotalUsedTime,
                        ex));
                return;
            }
            finally
            {
                // When the above code has ended, close the streams.
                if (responseStream != null)
                {
                    responseStream.Close();
                }
                if (webResponse != null)
                {
                    webResponse.Close();
                }
                if (downloadCache != null)
                {
                    downloadCache.Close();
                }
            }
        }





        /// <summary>
        /// Write the data in cache to local file.
        /// </summary>
        void WriteCacheToFile(MemoryStream downloadCache, int cachedSize)
        {
            // Lock other threads or processes to prevent from writing data to the file.
            lock (fileLocker)
            {
                using (FileStream fileStream = new FileStream(DownloadPath, System.IO.FileMode.Open))
                {
                    byte[] cacheContent = new byte[cachedSize];
                    downloadCache.Seek(0, SeekOrigin.Begin);
                    downloadCache.Read(cacheContent, 0, cachedSize);
                    fileStream.Seek(DownloadedSize + StartPoint, SeekOrigin.Begin);
                    fileStream.Write(cacheContent, 0, cachedSize);
                }
            }
        }

        /// <summary>
        /// The method will be called by the OnStatusChanged method.
        /// </summary>
        /// <param name="e"></param>
        protected virtual void OnDownloadCompleted(DownloadCompletedEventArgs e)
        {
            if (e.Error != null && this.status != DownloadStatus.Canceled)
            {
                this.Status = DownloadStatus.Completed;
            }

            if (DownloadCompleted != null)
            {
                DownloadCompleted(this, e);
            }
        }

        /// <summary>
        /// Calculate the download speed and fire the  DownloadProgressChanged event.
        /// </summary>
        /// <param name="cachedSize"></param>
        private void InternalDownloadProgressChanged(int cachedSize)
        {
            int speed = 0;
            DateTime current = DateTime.Now;
            TimeSpan interval = current - lastNotificationTime;

            if (interval.TotalSeconds < 60)
            {
                speed = (int)Math.Floor((this.DownloadedSize + cachedSize - this.lastNotificationDownloadedSize) / interval.TotalSeconds);
            }
            lastNotificationTime = current;
            lastNotificationDownloadedSize = this.DownloadedSize + cachedSize;

            this.OnDownloadProgressChanged(new DownloadProgressChangedEventArgs
                           (this.DownloadedSize + cachedSize, this.TotalSize, speed));


        }

        protected virtual void OnDownloadProgressChanged(DownloadProgressChangedEventArgs e)
        {
            if (DownloadProgressChanged != null)
            {
                DownloadProgressChanged(this, e);
            }
        }

        protected virtual void OnStatusChanged(EventArgs e)
        {
            switch (this.Status)
            {
                case DownloadStatus.Waiting:
                case DownloadStatus.Downloading:
                case DownloadStatus.Paused:
                case DownloadStatus.Canceled:
                case DownloadStatus.Completed:
                    if (this.StatusChanged != null)
                    {
                        this.StatusChanged(this, e);
                    }
                    break;
                default:
                    break;
            }

            if (this.status == DownloadStatus.Canceled)
            {
                Exception ex = new Exception("用户取消了下载. ");
                this.OnDownloadCompleted(
                    new DownloadCompletedEventArgs(
                        null,
                        this.DownloadedSize,
                        this.TotalSize,
                        this.TotalUsedTime,
                        ex));
            }

            if (this.Status == DownloadStatus.Completed)
            {
                this.OnDownloadCompleted(
                    new DownloadCompletedEventArgs(
                        new FileInfo(this.DownloadPath),
                        this.DownloadedSize,
                        this.TotalSize,
                        this.TotalUsedTime,
                        null));
            }
        }
    }

    public class MultiThreadedWebDownloader : IDownloader
    {
        // Used while calculating download speed.
        static object locker = new object();


        /// <summary>
        /// The Url of the file to be downloaded. 
        /// </summary>
        public Uri Url { get; private set; }

        public ICredentials Credentials { get; set; }

        /// <summary>
        /// Specify whether the remote server supports "Accept-Ranges" header.
        /// Use the CheckUrl method to initialize this property internally.
        /// </summary>
        public bool IsRangeSupported { get; set; }

        /// <summary>
        /// The total size of the file. Use the CheckUrl method to initialize this 
        /// property internally.
        /// </summary>
        public long TotalSize { get; set; }

        /// <summary>
        /// This property is a member of IDownloader interface.
        /// </summary>
        public long StartPoint { get; set; }

        /// <summary>
        /// This property is a member of IDownloader interface.
        /// </summary>
        public long EndPoint { get; set; }

        /// <summary>
        /// The local path to store the file.
        /// If there is no file with the same name, a new file will be created.
        /// </summary>
        public string DownloadPath { get; set; }


        /// <summary>
        /// The Proxy of all the download client.
        /// </summary>
        public IWebProxy Proxy { get; set; }

        /// <summary>
        /// The downloaded size of the file.
        /// </summary>
        public long DownloadedSize
        {
            get
            {
                return this.downloadClients.Sum(client => client.DownloadedSize);
            }
        }

        public int CachedSize
        {
            get
            {
                return this.downloadClients.Sum(client => client.CachedSize);
            }
        }

        // Store the used time spent in downloading data. The value does not include
        // the paused time and it will only be updated when the download is paused, 
        // canceled or completed.
        private TimeSpan usedTime = new TimeSpan();

        private DateTime lastStartTime;

        /// <summary>
        /// If the status is Downloading, then the total time is usedTime. Else the 
        /// total should include the time used in current download thread.
        /// </summary>
        public TimeSpan TotalUsedTime
        {
            get
            {
                if (this.Status != DownloadStatus.Downloading)
                {
                    return usedTime;
                }
                else
                {
                    return usedTime.Add(DateTime.Now - lastStartTime);
                }
            }
        }

        // The time and size in last DownloadProgressChanged event. These two fields
        // are used to calculate the download speed.
        private DateTime lastNotificationTime;

        private long lastNotificationDownloadedSize;

        /// <summary>
        /// If get a number of buffers, then fire DownloadProgressChanged event.
        /// </summary>
        public int BufferCountPerNotification { get; set; }

        /// <summary>
        /// Set the BufferSize when read data in Response Stream.
        /// </summary>
        public int BufferSize { get; set; }

        /// <summary>
        /// The cache size in memory.
        /// </summary>
        public int MaxCacheSize { get; set; }

        DownloadStatus status;

        /// <summary>
        /// If status changed, fire StatusChanged event.
        /// </summary>
        public DownloadStatus Status
        {
            get
            { return status; }

            private set
            {
                if (status != value)
                {
                    status = value;
                    this.OnStatusChanged(EventArgs.Empty);
                }
            }
        }

        /// <summary>
        /// The max threads count. The real threads count number is the min value of this
        /// value and TotalSize / MaxCacheSize.
        /// </summary>
        public int MaxThreadCount { get; set; }

        public bool HasChecked { get; set; }

        // The HttpDownloadClients to download the file. Each client uses one thread to
        // download part of the file.
        List<HttpDownloadClient> downloadClients = null;

        public int DownloadThreadsCount
        {
            get
            {
                if (downloadClients != null)
                {
                    return downloadClients.Count;
                }
                else
                {
                    return 0;
                }
            }
        }

        public event EventHandler<DownloadProgressChangedEventArgs> DownloadProgressChanged;

        public event EventHandler<DownloadCompletedEventArgs> DownloadCompleted;

        public event EventHandler StatusChanged;

        /// <summary>
        /// Download the whole file. The default buffer size is 1KB, memory cache is
        /// 1MB, buffer count per notification is 64, threads count is the double of 
        /// logic processors count.
        /// </summary>
        public MultiThreadedWebDownloader(string url)
            : this(url, 1024, 1048576, 64, Environment.ProcessorCount * 2)
        {
        }

        public MultiThreadedWebDownloader(string url, int bufferSize, int cacheSize,
            int bufferCountPerNotification, int maxThreadCount)
        {

            this.Url = new Uri(url);
            this.StartPoint = 0;
            this.EndPoint = long.MaxValue;
            this.BufferSize = bufferSize;
            this.MaxCacheSize = cacheSize;
            this.BufferCountPerNotification = bufferCountPerNotification;

            this.MaxThreadCount = maxThreadCount;

            // Set the maximum number of concurrent connections allowed by 
            // a ServicePoint object
            ServicePointManager.DefaultConnectionLimit = maxThreadCount;

            // Initialize the HttpDownloadClient list.
            downloadClients = new List<HttpDownloadClient>();

            // Set the Initialized status.
            this.Status = DownloadStatus.Initialized;
        }


        public void CheckUrlAndFile(out string fileName)
        {
            CheckUrl(out fileName);
            CheckFileOrCreateFile();

            this.HasChecked = true;
        }

        /// <summary>
        /// Check the Uri to find its size, and whether it supports "Pause". 
        /// </summary>
        public void CheckUrl(out string fileName)
        {
            fileName = DownloaderHelper.CheckUrl(this);
        }

        /// <summary>
        /// Check whether the destination file exists. If  not, create a file with the same
        /// size as the file to be downloaded.
        /// </summary>
        void CheckFileOrCreateFile()
        {
            DownloaderHelper.CheckFileOrCreateFile(this, locker);
        }

        void EnsurePropertyValid()
        {
            if (this.StartPoint < 0)
            {
                throw new ArgumentOutOfRangeException(
                    "StartPoint cannot be less then 0. ");
            }

            if (this.EndPoint < this.StartPoint)
            {
                throw new ArgumentOutOfRangeException(
                    "EndPoint cannot be less then StartPoint ");
            }

            if (this.BufferSize < 0)
            {
                throw new ArgumentOutOfRangeException(
                    "BufferSize cannot be less then 0. ");
            }

            if (this.MaxCacheSize < this.BufferSize)
            {
                throw new ArgumentOutOfRangeException(
                    "MaxCacheSize cannot be less then BufferSize ");
            }

            if (this.BufferCountPerNotification <= 0)
            {
                throw new ArgumentOutOfRangeException(
                    "BufferCountPerNotification cannot be less then 0. ");
            }

            if (this.MaxThreadCount < 1)
            {
                throw new ArgumentOutOfRangeException(
                       "maxThreadCount cannot be less than 1. ");
            }
        }

        /// <summary>
        /// Start to download.
        /// </summary>
        public void Download()
        {

            // Only idle download client can be started.
            if (this.Status != DownloadStatus.Initialized)
            {
                throw new ApplicationException(
                    "Only Initialized download client can be started.");
            }

            this.EnsurePropertyValid();

            // Set the status.
            this.Status = DownloadStatus.Downloading;

            if (!this.HasChecked)
            {
                string filename = null;
                this.CheckUrlAndFile(out filename);
            }

            HttpDownloadClient client = new HttpDownloadClient(
                    this.Url.AbsoluteUri,
                    0,
                    long.MaxValue,
                    this.BufferSize,
                    this.BufferCountPerNotification * this.BufferSize,
                    this.BufferCountPerNotification);

            // Set the HasChecked flag, so the client will not check the URL again.
            client.TotalSize = this.TotalSize;
            client.DownloadPath = this.DownloadPath;
            client.HasChecked = true;
            client.Credentials = this.Credentials;
            client.Proxy = this.Proxy;

            // Register the events of HttpDownloadClients.
            client.DownloadProgressChanged += client_DownloadProgressChanged;
            client.StatusChanged += client_StatusChanged;
            client.DownloadCompleted += client_DownloadCompleted;

            this.downloadClients.Add(client);
            client.Download();
        }



        /// <summary>
        /// Start to download.
        /// </summary>
        public void BeginDownload()
        {

            // Only idle download client can be started.
            if (this.Status != DownloadStatus.Initialized)
            {
                throw new ApplicationException("Only Initialized download client can be started.");
            }

            this.Status = DownloadStatus.Waiting;

            ThreadPool.QueueUserWorkItem(DownloadInternal);
        }

        void DownloadInternal(object obj)
        {

            if (this.Status != DownloadStatus.Waiting)
            {
                return;
            }

            try
            {
                this.EnsurePropertyValid();

                // Set the status.
                this.Status = DownloadStatus.Downloading;

                if (!this.HasChecked)
                {
                    string filename = null;
                    this.CheckUrlAndFile(out filename);
                }



                // If the file does not support "Accept-Ranges" header, then create one 
                // HttpDownloadClient to download the file in a single thread, else create
                // multiple HttpDownloadClients to download the file.
                if (!IsRangeSupported)
                {
                    HttpDownloadClient client = new HttpDownloadClient(
                        this.Url.AbsoluteUri,
                        0,
                        long.MaxValue,
                        this.BufferSize,
                        this.BufferCountPerNotification * this.BufferSize,
                        this.BufferCountPerNotification);

                    // Set the HasChecked flag, so the client will not check the URL again.
                    client.TotalSize = this.TotalSize;
                    client.DownloadPath = this.DownloadPath;
                    client.HasChecked = true;
                    client.Credentials = this.Credentials;
                    client.Proxy = this.Proxy;

                    this.downloadClients.Add(client);
                }
                else
                {
                    // Calculate the block size for each client to download.
                    int maxSizePerThread =
                        (int)Math.Ceiling((double)this.TotalSize / this.MaxThreadCount);
                    if (maxSizePerThread < this.MaxCacheSize)
                    {
                        maxSizePerThread = this.MaxCacheSize;
                    }

                    long leftSizeToDownload = this.TotalSize;

                    // The real threads count number is the min value of MaxThreadCount and 
                    // TotalSize / MaxCacheSize.              
                    int threadsCount =
                        (int)Math.Ceiling((double)this.TotalSize / maxSizePerThread);

                    for (int i = 0; i < threadsCount; i++)
                    {
                        long endPoint = maxSizePerThread * (i + 1) - 1;
                        long sizeToDownload = maxSizePerThread;

                        if (endPoint > this.TotalSize)
                        {
                            endPoint = this.TotalSize - 1;
                            sizeToDownload = endPoint - maxSizePerThread * i;
                        }

                        // Download a block of the whole file.
                        HttpDownloadClient client = new HttpDownloadClient(
                            this.Url.AbsoluteUri,
                            maxSizePerThread * i,
                            endPoint);

                        // Set the HasChecked flag, so the client will not check the URL again.
                        client.DownloadPath = this.DownloadPath;
                        client.HasChecked = true;
                        client.TotalSize = sizeToDownload;
                        client.Credentials = this.Credentials;
                        client.Proxy = this.Proxy;
                        this.downloadClients.Add(client);
                    }
                }

                // Set the lastStartTime to calculate the used time.
                lastStartTime = DateTime.Now;

                // Start all HttpDownloadClients.
                foreach (var client in this.downloadClients)
                {
                    if (this.Proxy != null)
                    {
                        client.Proxy = this.Proxy;
                    }

                    // Register the events of HttpDownloadClients.
                    client.DownloadProgressChanged += client_DownloadProgressChanged;
                    client.StatusChanged += client_StatusChanged;
                    client.DownloadCompleted += client_DownloadCompleted;


                    client.BeginDownload();
                }
            }
            catch (Exception ex)
            {
                this.Cancel();
                this.OnDownloadCompleted(new DownloadCompletedEventArgs(
                    null,
                    this.DownloadedSize,
                    this.TotalSize,
                    this.TotalUsedTime,
                    ex));
            }
        }

        /// <summary>
        /// Pause the download.
        /// </summary>
        public void Pause()
        {
            // Only downloading downloader can be paused.
            if (this.Status != DownloadStatus.Downloading)
            {
                throw new ApplicationException(
                    "Only downloading downloader can be paused.");
            }

            this.Status = DownloadStatus.Pausing;

            // Pause all the HttpDownloadClients. If all of the clients are paused,
            // the status of the downloader will be changed to Paused.
            foreach (var client in this.downloadClients)
            {
                if (client.Status == DownloadStatus.Downloading)
                {
                    client.Pause();
                }
            }
        }


        /// <summary>
        /// Resume the download.
        /// </summary>
        public void Resume()
        {
            // Only paused downloader can be paused.
            if (this.Status != DownloadStatus.Paused)
            {
                throw new ApplicationException(
                    "Only paused downloader can be resumed. ");
            }

            // Set the lastStartTime to calculate the used time.
            lastStartTime = DateTime.Now;

            // Set the downloading status.
            this.Status = DownloadStatus.Waiting;

            // Resume all HttpDownloadClients.
            foreach (var client in this.downloadClients)
            {
                if (client.Status != DownloadStatus.Completed)
                {
                    client.Resume();
                }
            }
        }

        /// <summary>
        /// Resume the download.
        /// </summary>
        public void BeginResume()
        {
            // Only paused downloader can be paused.
            if (this.Status != DownloadStatus.Paused)
            {
                throw new ApplicationException(
                    "Only paused downloader can be resumed. ");
            }

            // Set the lastStartTime to calculate the used time.
            lastStartTime = DateTime.Now;

            // Set the downloading status.
            this.Status = DownloadStatus.Waiting;

            // Resume all HttpDownloadClients.
            foreach (var client in this.downloadClients)
            {
                if (client.Status != DownloadStatus.Completed)
                {
                    client.BeginResume();
                }
            }

        }

        /// <summary>
        /// Cancel the download
        /// </summary>
        public void Cancel()
        {

            if (this.Status == DownloadStatus.Initialized
                || this.Status == DownloadStatus.Waiting
                || this.Status == DownloadStatus.Completed
                || this.Status == DownloadStatus.Paused
                || this.Status == DownloadStatus.Canceled)
            {
                this.Status = DownloadStatus.Canceled;
            }
            else if (this.Status == DownloadStatus.Canceling
                || this.Status == DownloadStatus.Pausing
                || this.Status == DownloadStatus.Downloading)
            {
                this.Status = DownloadStatus.Canceling;
            }

            // Cancel all HttpDownloadClients.
            foreach (var client in this.downloadClients)
            {
                client.Cancel();
            }

        }

        /// <summary>
        /// Handle the StatusChanged event of all the HttpDownloadClients.
        /// </summary>
        void client_StatusChanged(object sender, EventArgs e)
        {

            // If all the clients are completed, then the status of this downloader is 
            // completed.
            if (this.downloadClients.All(
                client => client.Status == DownloadStatus.Completed))
            {
                this.Status = DownloadStatus.Completed;
            }

            // If all the clients are Canceled, then the status of this downloader is 
            // Canceled.
            else if (this.downloadClients.All(
                client => client.Status == DownloadStatus.Canceled))
            {
                this.Status = DownloadStatus.Canceled;
            }
            else
            {

                // The completed clients will not be taken into consideration.
                var nonCompletedClients = this.downloadClients.
                    Where(client => client.Status != DownloadStatus.Completed);

                // If all the nonCompletedClients are Waiting, then the status of this 
                // downloader is Waiting.
                if (nonCompletedClients.All(
                    client => client.Status == DownloadStatus.Waiting))
                {
                    this.Status = DownloadStatus.Waiting;
                }

                // If all the nonCompletedClients are Paused, then the status of this 
                // downloader is Paused.
                else if (nonCompletedClients.All(
                    client => client.Status == DownloadStatus.Paused))
                {
                    this.Status = DownloadStatus.Paused;
                }
                else if (this.Status != DownloadStatus.Pausing
                    && this.Status != DownloadStatus.Canceling)
                {
                    this.Status = DownloadStatus.Downloading;
                }
            }

        }

        /// <summary>
        /// Handle the DownloadProgressChanged event of all the HttpDownloadClients, and 
        /// calculate the download speed.
        /// </summary>
        void client_DownloadProgressChanged(object sender, DownloadProgressChangedEventArgs e)
        {
            lock (locker)
            {
                if (DownloadProgressChanged != null)
                {
                    int speed = 0;
                    DateTime current = DateTime.Now;
                    TimeSpan interval = current - lastNotificationTime;

                    if (interval.TotalSeconds < 60 && interval.TotalSeconds > 0.01)
                    {
                        speed = (int)Math.Floor((this.DownloadedSize + this.CachedSize -
                            this.lastNotificationDownloadedSize) / interval.TotalSeconds);
                    }

                    lastNotificationTime = current;
                    lastNotificationDownloadedSize = this.DownloadedSize + this.CachedSize;

                    var downloadProgressChangedEventArgs =
                        new DownloadProgressChangedEventArgs(
                            DownloadedSize, TotalSize, speed);
                    this.OnDownloadProgressChanged(downloadProgressChangedEventArgs);
                }

            }
        }

        /// <summary>
        /// Handle the DownloadCompleted event of all the HttpDownloadClients.
        /// </summary>
        void client_DownloadCompleted(object sender, DownloadCompletedEventArgs e)
        {
            if (e.Error != null
                && this.Status != DownloadStatus.Canceling
                && this.Status != DownloadStatus.Canceled)
            {
                this.Cancel();
                this.OnDownloadCompleted(new DownloadCompletedEventArgs(
                    null,
                    this.DownloadedSize,
                    this.TotalSize,
                    this.TotalUsedTime,
                    e.Error));
            }
        }

        /// <summary>
        /// Raise DownloadProgressChanged event. If the status is Completed, then raise
        /// DownloadCompleted event.
        /// </summary>
        /// <param name="e"></param>
        protected virtual void OnDownloadProgressChanged(
            DownloadProgressChangedEventArgs e)
        {
            if (DownloadProgressChanged != null)
            {
                DownloadProgressChanged(this, e);
            }
        }

        /// <summary>
        /// Raise StatusChanged event.
        /// </summary>
        protected virtual void OnStatusChanged(EventArgs e)
        {

            switch (this.Status)
            {
                case DownloadStatus.Waiting:
                case DownloadStatus.Downloading:
                case DownloadStatus.Paused:
                case DownloadStatus.Canceled:
                case DownloadStatus.Completed:
                    if (this.StatusChanged != null)
                    {
                        this.StatusChanged(this, e);
                    }
                    break;
                default:
                    break;
            }

            if (this.Status == DownloadStatus.Paused
                || this.Status == DownloadStatus.Canceled
                || this.Status == DownloadStatus.Completed)
            {
                this.usedTime += DateTime.Now - lastStartTime;
            }

            if (this.Status == DownloadStatus.Canceled)
            {
                Exception ex = new Exception("用户取消了下载. ");
                this.OnDownloadCompleted(
                    new DownloadCompletedEventArgs(
                        null,
                        this.DownloadedSize,
                        this.TotalSize,
                        this.TotalUsedTime,
                        ex));
            }

            if (this.Status == DownloadStatus.Completed)
            {
                this.OnDownloadCompleted(
                    new DownloadCompletedEventArgs(
                        new FileInfo(this.DownloadPath),
                        this.DownloadedSize,
                        this.TotalSize,
                        this.TotalUsedTime,
                        null));
            }
        }

        /// <summary>
        /// Raise DownloadCompleted event.
        /// </summary>
        protected virtual void OnDownloadCompleted(
            DownloadCompletedEventArgs e)
        {
            if (DownloadCompleted != null)
            {
                DownloadCompleted(this, e);
            }
        }
    }

    public static class DownloaderHelper
    {

        public static HttpWebRequest InitializeHttpWebRequest(IDownloader downloader)
        {
            var webRequest = (HttpWebRequest)WebRequest.Create(downloader.Url);
            webRequest.UserAgent = common_value._user_agent;

            if (downloader.Credentials != null)
            {
                webRequest.Credentials = downloader.Credentials;
            }
            else
            {
                webRequest.Credentials = CredentialCache.DefaultCredentials;
            }

            if (downloader.Proxy != null)
            {
                webRequest.Proxy = downloader.Proxy;
            }
            else
            {
                webRequest.Proxy = WebRequest.DefaultWebProxy;
            }

            return webRequest;
        }

        /// <summary>
        /// Check the URL to download, including whether it supports Range, 
        /// </summary>
        /// <param name="downloader"></param>
        /// <returns></returns>
        public static string CheckUrl(IDownloader downloader)
        {
            string fileName = string.Empty;

            // Check the file information on the remote server.
            var webRequest = InitializeHttpWebRequest(downloader);

            using (var response = webRequest.GetResponse())
            {
                foreach (var header in response.Headers.AllKeys)
                {
                    if (header.Equals("Accept-Ranges", StringComparison.OrdinalIgnoreCase))
                    {
                        downloader.IsRangeSupported = true;
                    }

                    if (header.Equals("Content-Disposition", StringComparison.OrdinalIgnoreCase))
                    {
                        string contentDisposition = response.Headers[header];

                        string pattern = ".[^;]*;\\s+filename=\"(?<file>.*)\"";
                        Regex r = new Regex(pattern);
                        Match m = r.Match(contentDisposition);
                        if (m.Success)
                        {
                            fileName = m.Groups["file"].Value;
                        }
                    }
                }

                downloader.TotalSize = response.ContentLength;

                if (downloader.TotalSize <= 0)
                {
                    throw new ApplicationException(
                        "The file to download does not exist!");
                }

                if (!downloader.IsRangeSupported)
                {
                    downloader.StartPoint = 0;
                    downloader.EndPoint = int.MaxValue;
                }
            }

            if (downloader.IsRangeSupported &&
                (downloader.StartPoint != 0 || downloader.EndPoint != long.MaxValue))
            {
                webRequest = InitializeHttpWebRequest(downloader);

                if (downloader.EndPoint != int.MaxValue)
                {
                    webRequest.AddRange(downloader.StartPoint, downloader.EndPoint);
                }
                else
                {
                    webRequest.AddRange(downloader.StartPoint);
                }
                using (var response = webRequest.GetResponse())
                {
                    downloader.TotalSize = response.ContentLength;
                }
            }

            return fileName;
        }


        /// <summary>
        /// Check whether the destination file exists. If not, create a file with the same
        /// size as the file to be downloaded.
        /// </summary>
        public static void CheckFileOrCreateFile(IDownloader downloader, object fileLocker)
        {
            // Lock other threads or processes to prevent from creating the file.
            lock (fileLocker)
            {
                FileInfo fileToDownload = new FileInfo(downloader.DownloadPath);
                if (fileToDownload.Exists)
                {

                    // The destination file should have the same size as the file to be downloaded.
                    if (fileToDownload.Length != downloader.TotalSize)
                    {
                        throw new ApplicationException(
                            "The download path already has a file which does not match"
                            + " the file to download. ");
                    }
                }

                // Create a file.
                else
                {
                    if (downloader.TotalSize == 0)
                    {
                        throw new ApplicationException("The file to download does not exist!");
                    }

                    using (FileStream fileStream = File.Create(downloader.DownloadPath))
                    {
                        /*
                        long createdSize = 0;
                        byte[] buffer = new byte[4096];
                        while (createdSize < downloader.TotalSize)
                        {
                            int bufferSize = (downloader.TotalSize - createdSize) < 4096
                                ? (int)(downloader.TotalSize - createdSize) : 4096;
                            fileStream.Write(buffer, 0, bufferSize);
                            createdSize += bufferSize;
                        }
                        */
                    }
                }
            }
        }
    }


}