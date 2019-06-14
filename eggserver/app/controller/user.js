const query = require("../utils/query");
const queryWords = require("../utils/queryWords");
const mail = require("../utils/mail");

const Controller = require("egg").Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;
    console.log(ctx.request.body);

    const {
      select_password_from_user,
      check_valid_user,
      get_userinfo,
      get_star,
      get_history
    } = queryWords;
    const checkUserExist = await query(check_valid_user, [email]);
    if (checkUserExist[0].count === 0) {
      ctx.body = {
        msg: "无该用户",
        code: 4001
      };
      return;
    }
    const queryResult = await query(select_password_from_user, [email]);
    console.log("res:", queryResult, "type:", typeof queryResult);

    let bodytxt;
    if (queryResult[0].password !== password) {
      bodytxt = {
        msg: "密码不正确",
        code: 4002
      };
    } else if (queryResult[0].password === password) {
      const userinfo = await query(get_userinfo, [email]);
      const starinfo = await query(get_star, [email]);
      const historyinfo = await query(get_history, [email]);
      bodytxt = {
        msg: "成功登陆",
        userinfo: userinfo[0],
        starinfo,
        historyinfo,
        code: 0
      };
    }

    ctx.body = bodytxt;
  }
  async register() {
    const { ctx } = this;
    const { email, password, regcode } = ctx.request.body;
    console.log(ctx.request.body);
    const {
      register_user,
      check_valid_user,
      check_unvalid_user,
      check_regcode
    } = queryWords;

    const checkUserExist = await query(check_valid_user, [email]);
    if (checkUserExist[0].count !== 0) {
      ctx.body = {
        msg: "已有该用户",
        code: 4001
      };
      return;
    }
    const checkUnvalidUser = await query(check_unvalid_user, [email]);
    if (checkUnvalidUser[0].count === 0) {
      // 还没有发送过邮件
      ctx.body = {
        msg: "未验证邮箱",
        code: 4002
      };
      return;
    }
    const checkRegcode = await query(check_regcode, [email]);
    if (checkRegcode[0].regcode !== regcode) {
      ctx.body = {
        msg: "邮箱验证码错误",
        code: 4003
      };
      return;
    }
    const regResult = await query(register_user, [password, email]);

    ctx.body = {
      msg: "成功注册",
      code: 0
    };
  }
  async regmail() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    const {
      check_unvalid_user,
      register_user_emailonly,
      register_user_emailonly_update
    } = queryWords;
    const randomCode = Math.round(1e6 * Math.random());
    mail(
      email,
      "注册gosketch验证码邮件",
      "<h1>" + randomCode.toString() + "</h1>"
    );
    const checkRes = await query(check_unvalid_user, [email]);
    if (checkRes[0].count === 0) {
      // 还没有发送过邮件
      await query(register_user_emailonly, [email, randomCode]);
    } else {
      // 发送过邮件
      await query(register_user_emailonly_update, [randomCode, email]);
    }
    ctx.body = {
      msg: "已发送邮件",
      code: 0
    };
  }
  async gethistory() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    const { get_history } = queryWords;
    const historydata = await query(get_history, [email]);
    ctx.body = {
      history: historydata,
      msg: "getall",
      code: 0
    };
  }
}

module.exports = UserController;
