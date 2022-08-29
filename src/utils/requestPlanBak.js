import axios from 'axios'
import {Notification, Message} from 'element-ui'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const request = axios.create({
  baseURL: 'http://47.97.196.72:5000/',
  timeout: 12000,   //请求时间,
  withCredentials: false, // send cookies when cross-domain requests
})
let that = this
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};

axios.defaults.headers['post']['Content-Type'] = 'application/json';
axios.defaults.headers['put']['Content-Type'] = 'application/json';
axios.defaults.headers['patch']['Content-Type'] = 'application/json';


request.interceptors.response.use(function (res) {

  // 对响应数据做点什么
  if (res.data.isSuccess == true) {
    return res.data
  } else {
    if (res.data.exception) {
      Message({
        message: res.data.exception,
        type: 'error',
        duration: 1500
      })
    }
    if (res.data.data.exception) {
      Message({
        message: res.data.data.exception,
        type: 'error',
        duration: 1500
      })
    }


  }
});


export default request
