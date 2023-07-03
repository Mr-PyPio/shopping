"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var db = require('./db.js');

var jwt = require('jsonwebtoken');

var formidable = require('formidable');

var rootPath = require('app-root-path');

var form = formidable({
  multiples: true
});

var path = require('path');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var fs = require('fs'); // 引入jsonwebtoken
// token 类（生成token,验证token）


var TokenObj =
/*#__PURE__*/
function () {
  function TokenObj() {
    _classCallCheck(this, TokenObj);
  }

  _createClass(TokenObj, [{
    key: "createToken",
    value: function createToken(cont, time) {
      var payload = {
        msg: cont
      }; // Token 数据

      var secret = 'pypio.com'; // 这是加密的key（密钥或私钥） 

      return jwt.sign(payload, secret, {
        expiresIn: time // 24小时过期,以秒作为单位

      });
    }
  }, {
    key: "checkToken",
    value: function checkToken(token) {
      var secret = 'pypio.com'; // 这是加密的key（密钥或私钥） 
      // jwt.verify(token, secret, function (err, decode) {
      //   if (err) { // 当token过期，或这是一个伪造的token，或这是无效的token时会触发此逻辑 
      //     if (fn) {
      //       fn(false);
      //     }
      //     return false
      //   } else {
      //     if (fn) {
      //       fn(true);
      //     }
      //     return decode.msg;
      //   }
      // })

      var status = true;

      try {
        jwt.verify(token, secret);
        status = true;
      } catch (_unused) {
        status = false;
      }

      return status;
    }
  }]);

  return TokenObj;
}();

exports.start = function (req, res) {
  var username = req.body.username;
  var sql = 'select * from backstage_user where username = ?';
  db.base(sql, username, function (result) {
    if (result.length) {
      return res.json({
        status: 0,
        msg: '用户名已存在'
      });
    }

    return res.json({
      status: 1,
      msg: '用户名可用'
    });
  });
}; // 登录注册处理


exports.login = function (req, res) {
  var username = req.body.username;
  var pwd = req.body.password;
  var myToken = new TokenObj(); // 查询语句

  var sql = "select username,password,remember from backstage_user where username = '".concat(username, "'");
  db.base(sql, username, function (result) {
    if (!result.length) {
      return res.json({
        status: 400,
        data: result
      });
    } else {
      if (result[0].password == pwd) {
        var token = myToken.createToken(username, 60 * 60);
        return res.json({
          status: 200,
          data: result,
          token: token
        });
      }

      return res.json({
        status: 202,
        data: result
      });
    }
  });
};

exports.register = function (req, res) {
  var username = req.body.username;
  var password = req.body.password; // 插入语句

  var sql = 'insert into backstage_user(username,password) values(?,?)';
  db.base(sql, [username, password], function (result, error) {
    if (error) {
      console.log(result);
      console.log(error + "12345323");
      return res.json({
        status: 0,
        msg: error.sqlMessage
      });
    } else {
      return res.json({
        status: 1,
        msg: "注册成功"
      });
    }
  });
}; // 获取对应产品id的数据


exports.productDetail = function (req, res) {
  var id = parseInt(req.body.id);
  var sql = "select * from cc_products where id = '".concat(id, "'");
  db.base("select product_img,product_icon from cc_products_images where product_id = '".concat(id, "'"), id, function (result2) {
    if (result2.length) {
      db.base(sql, id, function (result) {
        result[0].product_img = result2[0].product_img;
        result[0].product_icon = result2[0].product_icon;
        return res.json({
          status: 200,
          data: result
        });
      });
    } else {
      db.base(sql, id, function (result) {
        result[0].product_img = '';
        result[0].product_icon = '';
        return res.json({
          status: 200,
          data: result
        });
      });
    }
  });
}; // 测试获取表中全部数据


exports.productList = function (req, res) {
  var page = parseInt(req.body.page);
  var pageSize = parseInt(req.body.pageSize);
  var columnsTab = 'id,admin_id,name,status,created_at,updated_at,product_source,sort,popular';
  var columns = {
    1: {
      title: '产品id',
      dataIndex: 'id'
    },
    2: {
      title: '产品名称',
      dataIndex: 'name'
    },
    3: {
      title: '产品图片',
      dataIndex: 'img'
    },
    4: {
      title: '销量',
      dataIndex: 'popular'
    },
    5: {
      title: '库存',
      dataIndex: 'sort'
    },
    6: {
      title: '在库状态',
      dataIndex: 'status'
    },
    7: {
      title: '在库时间',
      dataIndex: 'created_at'
    },
    8: {
      title: '更新时间',
      dataIndex: 'updated_at'
    }
  };
  var sql = 'select ' + columnsTab + ' from cc_products';
  db.base(sql, null, function (result, error) {
    if (error) {
      return res.json({
        status: 400,
        data: error
      });
    } else {
      var size = Math.round(result.length / pageSize);

      if (page >= size) {
        page = size;
      } else if (page <= 1) {
        page = 1;
      }

      var endIndex = page * pageSize;

      if (endIndex > result.length - 1) {
        endIndex = result.length - 1;
      }

      result = result.reverse();
      var end = result.slice((page - 1) * pageSize, endIndex);
      return res.json({
        status: 200,
        data: end,
        total: result.length,
        pageData: {
          page: page,
          lastPage: size,
          pageSize: pageSize
        },
        columns: columns
      });
    }
  });
}; // 获取用户列表


exports.userList = function (req, res) {
  var sql = 'select * from backstage_user';
  db.base(sql, null, function (result, error) {
    if (error) {
      return res.json({
        status: 400,
        data: result
      });
    }

    return res.json({
      status: 200,
      data: result
    });
  });
}; //验证token


exports.loginStatus = function (req, res) {
  var token = req.body.token;
  var myToken = new TokenObj();

  if (!myToken.checkToken(token)) {
    return res.json({
      status: 400,
      msg: '已过期'
    });
  } else {
    return res.json({
      status: 200,
      msg: myToken.checkToken(token)
    });
  }
}; //上传图片


exports.upLoadImg = function (req, res) {
  // form.parse(req, (err, fields, files) => {
  //   return res.json({
  //     status: 200,
  //     msg: {
  //       'fields: ': fields,
  //       'files: ': files
  //     }
  //   })
  // });
  form.keepExtensions = true; // 保留文件扩展名

  form.uploadDir = path.join(rootPath.path, '\\src\\server\\img'); // 临时存储路径
  // 数据解析

  form.parse(req, function (err, fileds, files) {
    if (err) {
      throw err;
    }

    var file = files.file;
    var name = file.originalFilename;
    var extensions = name.split('.').pop();
    var fileName = "".concat(uuidv4(), ".").concat(extensions);
    var filePath = file.filepath; // 从临时存储路径中读取文件

    var data = fs.readFileSync(filePath); // 将读取文件保存到新的位置

    fs.writeFile(path.join(rootPath.path, '\\src\\server\\img\\') + fileName, data, function (err) {
      if (err) {
        return console.log(err);
      } // 删除临时文件


      console.log(filePath);
      fs.unlink(filePath, function () {}); // 返回文件服务器中该文件的url

      res.json("http://192.168.0.102:8082/".concat(fileName));
    });
  });
}; // 产品添加图片


exports.productAddImg = function (req, res) {
  var product_id = req.body.product_id;
  var product_img = req.body.product_img;
  var product_icon = req.body.product_icon;
  var sql = '';
  var parm = [];
  db.base("select * from cc_products_images where product_id = '".concat(product_id, "'"), product_id, function (result) {
    if (!result.length) {
      sql = 'insert into cc_products_images(product_id,product_img,product_icon) values(?,?,?)';
      parm = [product_id, product_img, product_icon];
      axios2(sql, parm);
    } else {
      sql = "update cc_products_images set product_img = ?,product_icon = ? where product_id = ".concat(product_id);
      parm = [product_img, product_icon];
      axios2(sql, parm);
    }
  });

  function axios2(sql, parm) {
    db.base(sql, parm, function (result, error) {
      if (error) {
        return res.json({
          status: 400,
          data: result
        });
      }

      return res.json({
        status: 200,
        data: result
      });
    });
  }
}; // 获取产品尺码表


exports.productSizes = function (req, res) {
  var id = req.body.id;
  var sql = "select * from cc_product_sizes where product_id = '".concat(id, "'");
  db.base(sql, id, function (result, error) {
    if (result) {
      return res.json({
        status: 200,
        data: result
      });
    } else {
      return res.json({
        status: 400,
        data: error
      });
    }
  });
};