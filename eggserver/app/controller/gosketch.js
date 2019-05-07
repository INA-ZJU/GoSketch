"use strict";

const Controller = require("egg").Controller;
const transform = require("../utils/page2sketch");
class GoSketchController extends Controller {
  async getfile() {
    const { ctx } = this;
    const { url } = ctx.request.body;
    console.log("【convert url】", url);
    const transformRes = await transform(url);
    const { filename, websiteTitle } = transformRes;
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
