const db = require('./db.js')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const rootPath = require('app-root-path');
const form = formidable({ multiples: true });
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// 引入jsonwebtoken
// token 类（生成token,验证token）
class TokenObj {
  createToken(cont, time) {
    var payload = { msg: cont } // Token 数据
    var secret = 'pypio.com' // 这是加密的key（密钥或私钥） 
    return jwt.sign(payload, secret, {
      expiresIn: time // 24小时过期,以秒作为单位
    })
  }
  checkToken(token) {
    var secret = 'pypio.com' // 这是加密的key（密钥或私钥） 
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
    let status = true
    try {
      jwt.verify(token, secret)
      status = true
    } catch {
      status = false
    }
    return status
  }
}

exports.start = (req, res) => {
  let username = req.body.username
  let sql = 'select * from backstage_user where username = ?'
  db.base(sql, username, (result) => {
    if (result.length) {
      return res.json({ status: 0, msg: '用户名已存在' })
    }
    return res.json({ status: 1, msg: '用户名可用' })
  })
}
// 登录注册处理
exports.login = (req, res) => {
  let username = req.body.username
  let pwd = req.body.password
  let myToken = new TokenObj()
  // 查询语句
  let sql = `select username,password,remember from backstage_user where username = '${username}'`
  db.base(sql, username, (result) => {
    if (!result.length) {
      return res.json({ status: 400, data: result })
    } else {
      if (result[0].password == pwd) {
        const token = myToken.createToken(username, 60 * 60)
        return res.json({ status: 200, data: result, token: token })
      }
      return res.json({ status: 202, data: result })
    }
  })
}
exports.register = (req, res) => {
  let username = req.body.username
  let password = req.body.password
  // 插入语句
  let sql = 'insert into backstage_user(username,password) values(?,?)'
  db.base(sql, [username, password], (result, error) => {
    if (error) {
      console.log(result)
      console.log(error + "12345323")
      return res.json({ status: 0, msg: error.sqlMessage })
    } else {
      return res.json({ status: 1, msg: "注册成功" })
    }
  })
}

// 获取对应产品id的数据
exports.productDetail = (req, res) => {
  let id = parseInt(req.body.id)
  let sql = `select * from cc_products where id = '${id}'`
  db.base(`select product_img,product_icon from cc_products_images where product_id = '${id}'`, id, (result2) => {
    if (result2.length) {
      db.base(sql, id, (result) => {
        result[0].product_img = result2[0].product_img
        result[0].product_icon = result2[0].product_icon
        return res.json({
          status: 200, data: result
        })
      })
    } else {
      db.base(sql, id, (result) => {
        result[0].product_img = ''
        result[0].product_icon = ''
        return res.json({
          status: 200, data: result
        })
      })
    }

  })
}

// 获取勾选位列表数据
exports.catalogList = (req, res) => {
  let sql = `select id,code,name,productsList from catalog_list`
  db.base(sql, null, (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//获取id数组对于的产品数据
const getArrProducts = arr => {
  let arr2 = JSON.parse(arr)
  let sql = ''
  for (let i = 0; i < arr2.length; i++) {
    sql += `select id, name, status from cc_products where id=${arr2[i]};`
  }
  return new Promise((resolve, reject) => {
    db.base(sql, null, async res => {
      if (res) {
        let imageArr = await getProductImg()
        for (let i = 0; i < res.length; i++) {
          res[i] = res[i][0]
          for (let f = 0; f < imageArr.length; f++) {
            if (res[i].id == imageArr[f].product_id) {
              res[i].product_img = JSON.parse(imageArr[f].product_img)[0]
            } else {
              res[i].product_img = ''
            }
            res[i].key = res[i].id
          }
        }

        resolve(res)
      } else {
        resolve([])
      }
    })
  })
}

const getProductImg = () => {
  return new Promise((resolve, reject) => {
    db.base('select * from cc_products_images', null, res => {
      if (res) {
        resolve(res)
      } else {
        resolve([])
      }
    })
  })
}

// 根据id获取对应勾选位数据
exports.catalogDetail = (req, res) => {
  let id = req.body.id
  let sql = `select * from catalog_list where id = ${id}`
  db.base(sql, id, async result => {
    if (!result.length) {
      return res.json({
        status: 400, data: result, productList: []
      })
    } else {
      let productList
      if (Boolean(result[0].productsList)) {
        productList = await getArrProducts(result[0].productsList)
      } else {
        productList = []
      }
      return res.json({
        status: 200, data: result, productList: productList
      })
    }
  })
}

//修改勾选位
exports.changeCatalog = (req, res) => {
  let detail = req.body.data
  let id = req.body.id
  let num = req.body.num
  let name = req.body.name
  let code = req.body.code
  let sql = ''
  let arr = []
  if (detail) {
    sql = 'update catalog_list set productsList=?,name=?,code=?  where id=?'
    arr = [detail, name, code, id]
  } else {
    sql = 'update catalog_list set name=?,code=?  where id=?'
    arr = [name, code, id]
  }
  db.base(sql, arr, (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//创建勾选位
exports.catalogCreate = (req, res) => {
  let id = req.body.id
  let name = req.body.name
  let code = req.body.code
  let sql = 'insert into catalog_list(id,code,name) values(?,?,?)';
  db.base(sql, [id, code, name], (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//勾选位获取产品部分信息
exports.getProductsList = async (req, res) => {
  let page = parseInt(req.body.page)
  let pageSize = parseInt(req.body.pageSize)
  let id = req.body.id
  let imgArr = await getProductImg()
  let arrlayProduct = []

  db.base('select productsList from catalog_list where id=?', id, res => {
    if (res) {
      arrlayProduct = Boolean(res[0].productsList) ? JSON.parse(res[0].productsList) : []
    }
  })

  db.base('select id, name, status from cc_products', null, (result) => {
    if (result) {
      for (let i = 0; i < result.length; i++) {
        for (let f = 0; f < imgArr.length; f++) {
          if (result[i].id == imgArr[f].product_id) {
            result[i].product_img = imgArr[f].product_img
          } else {
            result[i].product_img = ''
          }
          result[i].key = result[i].id
        }
        if (arrlayProduct.indexOf(`${result[i].id}`) >= 0) {
          result.splice(i, 1)
          i--
        }
      }
      let size = Math.round(result.length / pageSize)
      if (page >= size) {
        page = size
      } else if (page <= 1) {
        page = 1
      }
      let endIndex = page * pageSize
      if (endIndex > result.length - 1) {
        endIndex = result.length - 1
      }
      result = result.reverse()
      let end = result.slice((page - 1) * pageSize, endIndex)
      return res.json({
        status: 200,
        data: end,
        total: result.length,
        pageData: {
          page: page,
          lastPage: size,
          pageSize: pageSize,
        },
        arrlayProduct: arrlayProduct,
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//勾选位添加产品
exports.addProductOfCatalog = (req, res) => {
  let arr = JSON.stringify(req.body.arr)
  let id = req.body.id
  let sql = 'update catalog_list set productsList=?  where id=?'
  db.base(sql, [arr, id], (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//勾选位删除产品
exports.delateCatalogList = (req, res) => {
  let id = req.body.id
  let sql = ''
  for (let i = 0; i < id.length; i++) {
    sql += `delete from catalog_list where id=${id[i]};`
  }
  console.log(sql)
  db.base(sql, null, (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

// 获取广告位列表数据
exports.bannerList = (req, res) => {
  let sql = `select id,code,name,num from banner_list`
  db.base(sql, null, (result) => {
    if (result) {

      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

// 根据id获取对应广告位数据
exports.bannerDetail = (req, res) => {
  let id = req.body.id
  let sql = `select * from banner_list where id = ${id}`
  db.base(sql, id, (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//删除广告位
exports.delateBanner = (req, res) => {
  let id = req.body.id
  let sql = 'delete from banner_list where id=?'
  let i = 0
  delate(i)
  function delate(i) {
    if (i < id.length) {
      db.base(sql, id[i], (result) => {
        if (result) {
          i++
          delate(i)
        } else {
          return res.json({
            status: 400, data: result
          })
        }
      })
    } else {
      let sql2 = `select id,code,name,num from banner_list`
      db.base(sql2, null, (result) => {
        if (result) {
          return res.json({
            status: 200, data: result
          })
        } else {
          return res.json({
            status: 400, data: result
          })
        }
      })
    }
  }
}

//修改广告位
exports.changeBanner = (req, res) => {
  let detail = req.body.data
  let id = req.body.id
  let num = req.body.num
  let name = req.body.name
  let code = req.body.code
  let sql = ''
  let arr = []
  if (detail) {
    sql = 'update banner_list set detail=?,num=?  where id=?'
    arr = [detail, num, id]
  } else {
    sql = 'update banner_list set name=?,code=?  where id=?'
    arr = [name, code, id]
  }
  db.base(sql, arr, (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}

//创建banner
exports.bannerCreate = (req, res) => {
  let id = req.body.id
  let name = req.body.name
  let code = req.body.code
  let sql = 'insert into banner_list(id,code,name) values(?,?,?)';
  db.base(sql, [id, code, name], (result) => {
    if (result) {
      return res.json({
        status: 200, data: result
      })
    } else {
      return res.json({
        status: 400, data: result
      })
    }
  })
}
// 测试获取表中全部数据
exports.productList = (req, res) => {
  let page = parseInt(req.body.page)
  let pageSize = parseInt(req.body.pageSize)
  let columnsTab = 'id,admin_id,name,status,created_at,updated_at,product_source,sort,popular'
  let columns = {
    1: {
      title: '产品id',
      dataIndex: 'id',
    },
    2: {
      title: '产品名称',
      dataIndex: 'name',
    },
    3: {
      title: '产品图片',
      dataIndex: 'img',
    },
    4: {
      title: '销量',
      dataIndex: 'popular',
    },
    5: {
      title: '库存',
      dataIndex: 'sort',
    },
    6: {
      title: '在库状态',
      dataIndex: 'status',
    },
    7: {
      title: '在库时间',
      dataIndex: 'created_at'
    },
    8: {
      title: '更新时间',
      dataIndex: 'updated_at'
    }
  }
  let sql = 'select ' + columnsTab + ' from cc_products';
  db.base(sql, null, (result, error) => {
    if (error) {
      return res.json({
        status: 400,
        data: error
      })
    } else {
      let size = Math.round(result.length / pageSize)
      if (page >= size) {
        page = size
      } else if (page <= 1) {
        page = 1
      }
      let endIndex = page * pageSize
      if (endIndex > result.length - 1) {
        endIndex = result.length - 1
      }
      result = result.reverse()
      let end = result.slice((page - 1) * pageSize, endIndex)
      return res.json({
        status: 200,
        data: end,
        total: result.length,
        pageData: {
          page: page,
          lastPage: size,
          pageSize: pageSize,
        },
        columns: columns
      })
    }
  })
}

// 获取用户列表
exports.userList = (req, res) => {
  let sql = 'select * from backstage_user';
  db.base(sql, null, (result, error) => {
    if (error) {
      return res.json({
        status: 400,
        data: result
      })
    }
    return res.json({
      status: 200,
      data: result
    })
  })
}

//验证token
exports.loginStatus = (req, res) => {
  const token = req.body.token
  let myToken = new TokenObj()
  if (!myToken.checkToken(token)) {
    return res.json({
      status: 400,
      msg: '已过期'
    })
  } else {
    return res.json({
      status: 200,
      msg: myToken.checkToken(token)
    })
  }
}

//上传图片
exports.upLoadImg = (req, res) => {
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
    const file = files.file;
    const name = file.originalFilename;
    const extensions = name.split('.').pop();
    const fileName = `${uuidv4()}.${extensions}`;
    const filePath = file.filepath;
    // 从临时存储路径中读取文件
    const data = fs.readFileSync(filePath);
    // 将读取文件保存到新的位置
    fs.writeFile(
      path.join(rootPath.path, '\\src\\server\\img\\') + fileName,
      data,
      function (err) {
        if (err) {
          return console.log(err);
        }
        // 删除临时文件
        console.log(filePath)
        fs.unlink(filePath, function () { });
        // 返回文件服务器中该文件的url
        res.json(`http://192.168.0.102:8082/${fileName}`);
      }
    );
  });
}
// 产品添加图片
exports.productAddImg = (req, res) => {
  let product_id = req.body.product_id
  let product_img = req.body.product_img
  let product_icon = req.body.product_icon
  let sql = ''
  let parm = []
  db.base(`select * from cc_products_images where product_id = '${product_id}'`, product_id, (result) => {
    if (!result.length) {
      sql = 'insert into cc_products_images(product_id,product_img,product_icon) values(?,?,?)';
      parm = [product_id, product_img, product_icon,]
      axios2(sql, parm)
    } else {
      sql = `update cc_products_images set product_img = ?,product_icon = ? where product_id = ${product_id}`;
      parm = [product_img, product_icon,]
      axios2(sql, parm)
    }
  })

  function axios2(sql, parm) {
    db.base(sql, parm, (result, error) => {
      if (error) {
        return res.json({
          status: 400,
          data: result
        })
      }
      return res.json({
        status: 200,
        data: result
      })
    })
  }
}

// 获取产品尺码表
exports.productSizes = (req, res) => {
  let id = req.body.id
  let sql = `select * from cc_product_sizes where product_id = '${id}'`
  db.base(sql, id, (result, error) => {
    if (result) {
      return res.json({
        status: 200,
        data: result
      })
    } else {
      return res.json({
        status: 400,
        data: error
      })
    }
  })
}

//保存尺码表
exports.saleProductSizes = (req, res) => {
  let content = req.body.content
  let id = req.body.id
  let type = req.body.type
  let isAdd = req.body.add
  if (isAdd == 1) {
    let sql = 'insert into cc_product_sizes(product_id,sizes,size_group) values(?,?,?)';
    db.base(sql, [id, content[0], content[1]], (result, error) => {
      if (error) {
        return res.json({
          status: 400,
          data: result
        })
      }
      return res.json({
        status: 200,
        data: result
      })
    })

  } else {
    let sql = ''
    if (type.indexOf('group') != -1) {
      sql = 'update cc_product_sizes set sizes=?,size_group=?  where product_id=?'
      db.base(sql, [content[0], content[1], id], (result, error) => {
        if (result) {
          return res.json({
            status: 200,
            data: result
          })
        } else {
          return res.json({
            status: 400,
            data: error
          })
        }
      })
    } else {
      sql = 'update cc_product_sizes set sizes=? where product_id=?'
      db.base(sql, [content[0], id], (result, error) => {
        if (result) {
          return res.json({
            status: 200,
            data: result
          })
        } else {
          return res.json({
            status: 400,
            data: error
          })
        }
      })
    }
  }
}

