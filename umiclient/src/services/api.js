import axios from 'axios';
const backendurl = 'http://localhost:7001/';
export async function asyncLogin(params) {
  return axios.post(backendurl + 'user/login', params);
}
export async function sendRegcodeMail(params) {
  return axios.post(backendurl + 'user/regmail', params);
}
export async function asyncRegister(params) {
  return axios.post(backendurl + 'user/register', params);
}
export async function starTransFile(params) {
  return axios.post(backendurl + 'star/add', params);
}