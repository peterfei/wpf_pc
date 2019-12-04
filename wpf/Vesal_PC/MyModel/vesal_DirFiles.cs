using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading;
using System.Xml;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Vesal_DirFiles
    {
        public static string findFileInPath(string path, string fileName,bool isRecursion = true)
        {
            string lowFileName = fileName.ToLower() + "";
            DirectoryInfo dif = new DirectoryInfo(path);
            FileSystemInfo[] fsis = dif.GetFileSystemInfos();
            for (int i = 0; i < fsis.Length; i++)
            {
                FileSystemInfo tmp = fsis[i];
                if (tmp is DirectoryInfo && isRecursion)
                {
                    return findFileInPath(tmp.FullName, lowFileName);
                }
                if (get_file_name_from_full_path(tmp.FullName).ToLower() == lowFileName)
                {
                    return get_dir_from_full_path(tmp.FullName);
                }
            }
            return "";
        }

        /// <summary>
        /// 加载xml
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static XmlDocument loadXml(string path, string fileName)
        {

            XmlDocument doc = new XmlDocument();
            string filepath;
            filepath = path + fileName;
            if (filepath.EndsWith(".xml.xml")) {
                filepath = filepath.Replace(".xml.xml", ".xml");
            }
            if (!File.Exists(filepath))
            {
                return null;
            }
            else
            {
                doc.Load(filepath);
            }
            return doc;
        }


        /// <summary>
        /// 获得目标文件夹下第一个子文件夹名词
        /// </summary>
        /// <param name="searchDirPath"></param>
        /// <returns></returns>
        public static string GetFirstDirInDir(string searchDirPath)
        {
            DirectoryInfo dir = new DirectoryInfo(searchDirPath);
            FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
            foreach (FileSystemInfo i in fileinfo)
            {
                if (i is DirectoryInfo)            //判断是否文件夹
                {
                    return i.Name;
                }
            }
            return "";
        }
        /// <summary>
        /// 删除目录下所有子文件夹(递归)
        /// </summary>
        /// <param name="srcPath"></param>
        public static void DelectDirFiles(string srcPath,List<string> filterDirNames = null)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(srcPath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        if (srcPath == i.FullName)
                        {
                            continue;
                        }
                        DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        if (filterDirNames != null && filterDirNames.Contains(subdir.Name)) {
                            continue;
                        }
                        subdir.Delete(true);          //删除子目录和文件
                    }
                    else
                        DelFile(i.FullName);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        /// <summary>
        /// 删除目录下所有子文件夹(递归)
        /// </summary>
        /// <param name="srcPath"></param>
        public static void DelectDir(string srcPath)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(srcPath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        if (srcPath == i.FullName)
                        {
                            continue;
                        }
                        DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        subdir.Delete(true);          //删除子目录和文件
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        

        public static String get_file_name_from_full_path(String path)
        {
            int pos = path.LastIndexOf("/");
            if (pos < 0)
            {
                pos = path.LastIndexOf("\\");
                if (pos < 0)
                    return path;

                return path.Substring(pos + 1);
            }

            return path.Substring(pos + 1);
        }

        public static String get_dir_from_full_path(String path)
        {
            int pos = path.LastIndexOf("/");
            if (pos < 0)
            {
                pos = path.LastIndexOf("\\");
                if (pos < 0)
                    return path;

                return path.Substring(0, pos + 1);
            }

            return path.Substring(0, pos + 1);
        }

        public static String get_name_suffix(String full_name)
        {
            int pos = full_name.LastIndexOf(".");
            if (pos < 0)
            {
                return full_name;
            }
            return full_name.Substring(pos + 1);
        }

        public static String remove_name_suffix(String full_name)
        {
            int pos = full_name.LastIndexOf(".");
            if (pos < 0)
            {
                return full_name;
            }

            return full_name.Substring(0, pos);
        }

        public static void CreateDir(String dir)
        {
            try
            {
                if (!Directory.Exists(dir)) //如果不存在就创建file文件夹
                {
                    Directory.CreateDirectory(dir);
                }
            }
            catch (Exception e){
            }
        }

        public static List<string> GetAllDirInfoFromPath(string path)
        {
            List<string> list = new List<string>();
            DirectoryInfo dir = new DirectoryInfo(path);
            DirectoryInfo[] dirinfo = dir.GetDirectories();

            if(dirinfo.Length==0)
            {
                FileInfo[]  info_list= dir.GetFiles();
                for (int i = 0; i < info_list.Length; i++)
                {
                    list.Add(info_list[i].FullName);
                }
            }
            return list;
        }


        public static bool if_exit_directory(String dir)
        {
            if (Directory.Exists(dir))
            {
                return true;
            }
            else
                return false;
        }

        public static void DelFile(String file_path)
        {
            try
            {
                if (File.Exists(file_path))
                {
                    File.Delete(file_path);
                }
            }
            catch { }
        }
        public static void DeleteFolder(string filePath)
        {
           // string srcPath = filePath.Substring(0, filePath.Length - 4);
           
            try
            {
                DirectoryInfo dir = new DirectoryInfo(filePath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        subdir.Delete(true);          //删除子目录和文件
                    }
                    else
                    {
                        File.Delete(i.FullName);      //删除指定文件
                    }
                }
                Directory.Delete(filePath);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        public static void ClearFolder(string filePath)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(filePath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        subdir.Delete(true);          //删除子目录和文件
                    }
                    else
                    {
                        File.Delete(i.FullName);      //删除指定文件
                    }
                }               
            }
            catch (Exception e)
            {
                
            }
        }

        public static void ClearFileWithSuffix(string filePath,params string[] suffixs)
        {
            for (int i = 0; i < suffixs.Length; i++)
            {
                ClearFileWithSuffix(filePath, suffixs[i]);
            }
        }

        public static void ClearFileWithSuffix(string filePath, string suffixs)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(filePath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();  //返回目录中所有文件和子目录
                foreach (FileSystemInfo i in fileinfo)
                {
                    if (i is DirectoryInfo)            //判断是否文件夹
                    {
                        //DirectoryInfo subdir = new DirectoryInfo(i.FullName);
                        //subdir.Delete(true);          //删除子目录和文件
                    }
                    else
                    {
                        if(i.FullName.Split('.')[1]==suffixs.Trim())
                            File.Delete(i.FullName);      //删除指定文件
                    }
                }
            }
            catch (Exception e)
            {

            }
        }

        public static void Vesal_DirCopy(string scr_path, string des_path)
        {
            try
            {
                string[] files = Directory.GetFiles(scr_path);
                foreach (string fn in files)
                {
                    string new_fn = fn.Replace("\\", "/");
                    string name = Vesal_DirFiles.get_file_name_from_full_path(new_fn);
                    File.Copy(fn, des_path + "/" + name, true);
                }
            }
            catch
            {
            }
        }

        /// <summary>
        /// 将对象转换为byte数组
        /// </summary>
        /// <param name="obj">被转换对象</param>
        /// <returns>转换后byte数组</returns>
        public static byte[] Object2Bytes(object obj)
        {
            byte[] buff;
            using (MemoryStream ms = new MemoryStream())
            {
                IFormatter iFormatter = new BinaryFormatter();
                iFormatter.Serialize(ms, obj);
                buff = ms.GetBuffer();
            }
            return buff;
        }

        /// <summary>
        /// 将byte数组转换成对象
        /// </summary>
        /// <param name="buff">被转换byte数组</param>
        /// <returns>转换完成后的对象</returns>
        public static object Bytes2Object(byte[] buff)
        {
            object obj;
            using (MemoryStream ms = new MemoryStream(buff))
            {
                IFormatter iFormatter = new BinaryFormatter();
                obj = iFormatter.Deserialize(ms);
            }
            return obj;
        }

        //序列化对象为string
        public static string SerializeClassObject(object o)
        {
            string json = JsonConvert.SerializeObject(o);
            return json;
        }
        //反序列化对象为实例化类
        public static T DeserializeObject<T>(string i)
        {
            // JsonSerializer serializer = new JsonSerializer();
            // StringReader sr = new StringReader(i);
            // object o = serializer.Deserialize(new JsonTextReader(sr),typeof(T));
            T o = JsonConvert.DeserializeObject<T>(i);
            return o;
        }

        static Encoding UTF8 = Encoding.Default;

        /// <summary>
        /// 按行读取文本配置
        /// </summary>     
        /// <param name="txt_file_path">txt配置文件路径</param>
        /// <returns>返回行数组</returns>
        public static List<string> ReadFileWithLine (string txt_file_path)
        {
            try
            {
                List<string> _list = new List<string>(); 
                FileStream fs = new FileStream(txt_file_path, FileMode.Open);
                StreamReader sr = new StreamReader(fs);
                string strLine = null;
                while ((strLine = sr.ReadLine()) != null)
                {
                    _list.Add(strLine.Replace(",","").Trim());
                }
                //关闭流
                sr.Close();
                fs.Close();
                return _list;
            }
            catch (System.Exception e)
            {
                return null;
            }
        }

        //public List<T> Readjson(string json_path)
        //{
        //    using (System.IO.StreamReader file = System.IO.File.OpenText(json_path))
        //    {
        //        using (JsonTextReader reader = new JsonTextReader(file))
        //        {
        //            JObject o = (JObject)JToken.ReadFrom(reader);
        //            Dictionary<string, object> r = JsonConvert.DeserializeObject<Dictionary<string, object>>(o.ToString());
        //            if (r.ContainsKey("AcuList"))
        //            {
        //                return JsonConvert.DeserializeObject<List<T>>(r["AcuList"].ToString());
        //            }
        //        }
        //    }
        //    return null;
        //}

}