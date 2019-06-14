const select_password_from_user = "select password from user where email=?";

const check_user = "select count(password) as count from user where email=?";

const check_valid_user = "select count(*) as count from user where email=? and valid=1";

const check_unvalid_user = "select count(*) as count from user where email=? and valid=0";

const check_regcode = "select regcode from user where email=?";

const register_user = "update user set password=?,valid=1 where email=?";

const register_user_emailonly = "insert into user (email,regcode,valid) values (?,?,0)";

const register_user_emailonly_update = "update user set regcode=? where email=?";

const add_history =
  "insert into history \
(email,website_url,jsonfile_name,screenshot_name,title,visit_time) \
values (?,?,?,?,?,now())";

const get_history = "select * from history where email=? order by visit_time desc";

const add_star = "insert into star \
(email,website_url,jsonfile_name,screenshot_name,title,star_time) \
values (?,?,?,?,?,now())";

const remove_star = "delete from star where email=? and Id=?";

const get_star = "select * from star where email=? order by star_time desc";

const get_userinfo = " select Id,email from user where email=?";

module.exports = {
  select_password_from_user,
  check_user,
  check_unvalid_user,
  check_valid_user,
  check_regcode,
  register_user,
  register_user_emailonly,
  register_user_emailonly_update,
  add_history,
  get_history,
  get_userinfo,
  add_star,
  remove_star,
  get_star
};
