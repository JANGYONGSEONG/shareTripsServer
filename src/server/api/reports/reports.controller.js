const Myapp = require('../../app');
const bodyParser = Myapp.bodyParser;

const path = require("path");
const fs = require('fs');

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'capstone',
  password: '123123',
  database: 'capstone'
});

connection.connect();

exports.upload = (req,res,next) => {
  const writer = req.body.writer;
  const title = req.body.title;
  const location = req.body.location;
  const content = req.body.content;

  const image_savepath = req.file.path;

  const image_originname = req.file.originalname;
  const image_savename = req.file.filename;

  const src = fs.createReadStream(image_savepath);
  const dest = fs.createWriteStream(path.join(__dirname,'../../upload/image/'+image_originname));
  src.pipe(dest);
  src.on('end',function(){console.log('complete')});
  src.on('error', function(err) {console.log('error')});
  fs.unlink(image_savepath,function(){
    console.log("fs.unlink");
  });

  fs.open(path.join(__dirname,'../../upload/image/'+image_originname),'r',function(err, fd){
    if(err){
      console.log("fs open fail");
      throw err;
    }
    var buffer = new Buffer.from(path.join(__dirname,'../../upload/image/'+image_originname));
    fs.read(fd,buffer,0,buffer.length,0,function(err, num){


    });
    connection.query('insert into report(title,writer,location,content,image_originname,image_savename,image) values(?,?,?,?,?,?,?)',[title,writer,location,content,image_originname,image_savename,buffer],function(err,result){
      if(err){
        console.log("upload fail");
        throw err;
      }

      return res.status(200).json();
    });
  });

  fs.unlink(path.join(__dirname,'../../upload/image/'+image_originname),function(){
    console.log("fs.unlink");
  });
}
