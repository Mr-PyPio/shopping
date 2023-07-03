/**
 * 图片服务器搭建
 */

//载入http模块
const http = require("http");
//载入fs模块
const fs = require("fs");
//载入path模块
const path = require("path");
//载入url模块
const url = require("url");
//载入zlib模块
const zlib = require("zlib");

//当前目录名
var curDir = "";

//服务器创建
const server = http.createServer(function (req, res) {
  //定义mime对象设置相应的响应头类型
  var mime = {
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpg",
    ".png": "image/png",
    ".tiff": "image/tiff",
    ".pdf": "application/pdf"
  };

  //获取请求url并转换请求路径
  var pathName = url.parse(req.url).pathname;
  //对路径进行解码以防中文乱码
  pathName = decodeURI(pathName);
  //获取资源文件的绝对路径
  var filePath = path.resolve(__dirname + '/img' + pathName);
  console.log("请求图片资源绝对路径：", filePath);
  //获取文件的扩展名
  var extName = path.extname(pathName);
  //设置内容类型
  var contentType = mime[extName] || "text/plain";

  //根据读取文件状态来决定如何读取静态文件
  fs.stat(filePath, function (err, stats) {
    //读取图片文件错误处理
    if (err) {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("<h1>404 没有找到 </h1>");
    }

    //文件存在
    if (!err && stats.isFile()) {
      readFile(filePath, contentType);
    }

    //图片文件流式读取
    function readFile(filePath, contentType) {
      //设置http消息头
      res.writeHead(200, { "content-type": contentType, "content-encoding": "gzip" });
      //创建流对象读取文件
      var stream = fs.createReadStream(filePath);
      stream.on("error", function () {
        res.writeHead(500, { "content-type": contentType });
        res.end("<h1>500 服务器错误</h1>");
      });

      //链式管道操作将文件内容流到客户端
      stream.pipe(zlib.createGzip()).pipe(res);
    }


    //如果路径是目录
    if (!err && stats.isDirectory()) {
      var html = "<head><meta charset = 'utf-8'/></head><body><ul>";
      //获取当前目录名
      curDir = path.basename(path.relative(__dirname, filePath));

      fs.readdir(filePath, (err, files) => {
        if (err) {
          console.log("读取路径失败！");
        } else {
          for (var file of files) {
            var curPath = path.join(curDir, file);
            html += "<li><a href = '${curPath}'>${file}</a></li>";
          }
          html += "</ul></body>";

          res.writeHead(200, { "content-type": "text/html" });
          res.end(html);
        }
      });
    }

  });

});

//指定服务器监听的端口
var port = 8082;
server.listen(port, function () {
  console.log(`图片服务器正在运行在端口：${port}`);
  console.log(`访问地址：http://192.168.0.102:8082:${port}`);
});