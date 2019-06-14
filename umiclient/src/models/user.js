import { asyncLogin, sendRegcodeMail, asyncRegister,starTransFile } from '@/services/api';
import { message } from 'antd';

export default {
  state: {
    isLogin: false,
    userinfo: null,
    star: null,
    history: null,
  },
  reducers: {
    setuser(state, { payload }) {
      console.log(payload);
      const { historyinfo, starinfo } = payload;
      let history = [];
      for (const i in historyinfo) {
        history.push({
          key: historyinfo[i].Id,
          name: historyinfo[i].jsonfile_name,
          title: historyinfo[i].title,
          url: historyinfo[i].website_url,
          visit_time: historyinfo[i].visit_time,
        });
      }
      let star = [];
      for (const i in starinfo) {
        star.push({
          key: starinfo[i].Id,
          name: starinfo[i].jsonfile_name,
          title: starinfo[i].title,
          url: starinfo[i].website_url,
          star_time: starinfo[i].star_time,
        });
      }
      let newstate = {
        isLogin: true,
        userinfo: payload.userinfo,
        star,
        history,
      };
      return newstate;
    },
  },
  effects: {
    *login({ payload }, { put, select, call }) {
      const { email, password } = payload.emailLoginInfo;

      const res = yield call(asyncLogin, { email, password });
      console.log(res);

      const { msg, code } = res.data;
      if (code === 0) {
        message.success(msg);
        // login success
        yield put({
          type: 'setuser',
          payload: res.data,
        });
      } else {
        message.error(msg);
      }
    },
    *regmail({ payload }, { put, select, call }) {
      const { email } = payload;
      const res = yield call(sendRegcodeMail, { email });
      console.log(res);
      const { msg, code } = res.data;
      if (code === 0) {
        message.success(msg);
      }
    },
    *register({ payload }, { put, select, call }) {
      const { email, regcode, password, repeat_password } = payload;
      if (password !== repeat_password) {
        message.error('两次输入的密码不一致！');
        return;
      }
      const res = yield call(asyncRegister, {
        email,
        regcode,
        password,
      });
      console.log(res);
      const { msg, code } = res.data;
      if (code === 0) {
        message.success(msg);
      } else {
        message.error(msg);
      }
    },
    *starfile({ payload }, { put, select, call }) {
      const isLogin = yield select(state => state.user.isLogin);
      if(!isLogin)
      {
        message.error("登陆后才可收藏");
        return;
      }
      const { record } = payload;
      const {name,title,url} = record;
      const email = yield select(state => state.user.userinfo.email);
      const res = yield call(starTransFile, {
        email,
        website_url:url,
        filename:name,
        website_title:title
      });
      message.success("收藏成功");
    },
  },
};
