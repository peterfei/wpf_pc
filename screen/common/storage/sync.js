/**
 * Created by guangqiang on 2017/11/15.
 */
import { storage } from "./index";

/**
 * sync方法的名字必须和所存数据的key完全相同
 * 方法接受的参数为一整个object，所有参数从object中解构取出
 * 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject
 * @type {{user: ((params))}}
 */
const sync = {
  initStructData(params) {
    let { resolve, reject } = params;

    let data = params.syncParams.extraFetchOptions.data;

    const paramArr = [];
    if (Object.keys(data).length !== 0) {
      for (const key in data) {
        paramArr.push(`${key}=${data[key]}`);
      }
    }
    const url =
      api.base_uri + "/v1/app/struct/getPcInitData?" + paramArr.join("&");
    console.log("==================================");

    alert("initStructData url is " + url);

    let responseData = fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: token
      }
    })
      .then(resp => resp.json())
      .then(
        result => {
          if (result && result.List) {
            storage.save("initStructData", id, result.List);

            resolve && resolve(result.List);
          } else {
            reject && reject(new Error("data parse error"));
          }
        },
        error => {
          console.log("initStructData error");
          reject && reject(error);
        }
      );
  }
};

export { sync };
