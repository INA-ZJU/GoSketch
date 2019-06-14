const query = require("../utils/query");
const queryWords = require("../utils/queryWords");
const Controller = require("egg").Controller;

class StarController extends Controller {
  async addstar() {
    const { ctx } = this;
    const { email, website_url, filename, website_title } = ctx.request.body;
    const { add_star } = queryWords;
    const insertResult = await query(add_star, [
      email,
      website_url,
      filename,
      filename,
      website_title
    ]);
    ctx.body = {
      starid: insertResult.insertId,
      code: 0,
      msg: "insert success"
    };
  }
  async removestar() {
    const { ctx } = this;
    const { email, starid } = ctx.request.body;
    const { remove_star } = queryWords;
    await query(remove_star, [email, starid]);
  }
  async getstar() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    const { get_star } = queryWords;
    const stardata = await query(get_star, [email]);
    ctx.body = {
      stars: stardata,
      msg: "getall",
      code: 0
    };
  }
}

module.exports = StarController;
