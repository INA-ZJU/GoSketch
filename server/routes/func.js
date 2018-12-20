var express = require('express');
var router = express.Router();

var transform = require('../middleware/page2sketch');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'func路径测试' });
});

router.post('/getfile', function(req, res) {
  const url = req.body.url;
  transform(url);
  res.send("Test pass");
  //res.sendFile(__dirname+'public/images/', 'example.png');
})

module.exports = router;
