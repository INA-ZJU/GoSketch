"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.post("/gosketch/getfile", controller.gosketch.getfile);
  router.post("/user/login", controller.user.login);
  router.post("/user/register", controller.user.register);
  router.post("/user/regmail", controller.user.regmail);
  router.post("/star/add", controller.star.addstar);
  router.post("/star/remove", controller.star.removestar);
  router.post("/user/history", controller.user.gethistory);
  router.post("/user/star", controller.star.getstar);
};
