//prod 产品 test 测试

let active = "test";

if (active=='prod'){
  base_uri="http://api.vesal.cn:8000/vesal-jiepao-prod/";
} if (active=='test'){
  base_uri= "http://118.24.119.234:8003/vesal-jiepao-test/"
}

export default {
   base_uri
};
