const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');

const transform = require('../middleware/page2sketch');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123455',
  database : 'html2sketch'
  });
  connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'func路径测试' });
  const pathfile = path.resolve(__dirname , '../public/page.asketch.json');
  res.download(pathfile);
});

router.post('/getfile', function(req, res) {
  const url = req.body.data;
  console.log("url:",url);
  const filename = Date.now();
  transform(url,filename);
  res.send({
    href: 'http://localhost:3000/func/download?filename='+filename,
    filename: filename
  });
});

router.get('/download', function(req, res) {
  const filename = req.query.filename;
  console.log('filename', filename);
  const pathfile = path.resolve(__dirname , '../public/', filename+'.json');
  res.download(pathfile);
});

router.post('/login', function(req, res) {
  const {username, password} = req.body;
  console.log({username, password});
  const queryword = `select password from user where username='${username}'`; 
  console.log(queryword);
  connection.query(queryword,
    function (err, result) {
      if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
      console.log(result);
      let isValid = false;
      if(result.length)
      {
        isValid = result[0].password === password;
        console.log(isValid);
      }
      res.send({isValid});
    });  
})

router.post('/starfile', function(req, res) {
  let fileID,userID;
  let isSuccess = false;
  const {filename, username} = req.body;
  console.log({filename, username});
  const queryword1 = `insert into file (filename) values (${filename})`;
  const queryword2 = `select id from user where username = '${username}'`;
  const queryword3 = `insert into user_star_file (userid,fileid) values (?,?)`;
  connection.query(queryword1,function(err, result) {
    if(err) {console.log('error message', err); return;}
    console.log(result);
    fileID = result.insertId;
    console.log(fileID);
    connection.query(queryword2,function(err, result) {
      if(err) {console.log('error message', err); return;}
      console.log(result);
      userID = result[0].id;
      console.log(userID);
      connection.query(queryword3,[userID,fileID],function(err, result) {
        if(err) {console.log('error message', err); return;}
        console.log(result);
        if(result.affectedRows === 1) {
          isSuccess = true;
        }
      })
    })
  });

  router.post('/getstarfile', function(req, res) {
    const username = req.body;
    res.send('get');
  })
 // const queryword2 = `insert into user_star_file (fileid,userid) values (${fileID},${userID})`;
  res.send({isSuccess});
})

module.exports = router;
