const query = require("../utils/query");
const queryWords = require("../utils/queryWords");
const AdmZip = require('adm-zip');
const Controller = require("egg").Controller;
const transform = require("../utils/page2sketch");

class GoSketchController extends Controller {
  async getfile() {
    const { ctx } = this;
    const { url, islogin, email } = ctx.request.body;
    console.log("【convert url】", url);
    const transformRes = await transform(url);
    const { filename, websiteTitle } = transformRes;
    if (islogin) {
      const { add_history } = queryWords;
      await query(add_history, [email, url, filename, filename, websiteTitle]);
    }
    ctx.body = {
      msg: "converting job done",
      websiteUrl: url,
      asketchfile: filename + ".json",
      screenshot: filename + ".jpg",
      websiteTitle
    };
  }
}

module.exports = GoSketchController;
