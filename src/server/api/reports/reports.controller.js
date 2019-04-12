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

exports.show = (req,res) => {
  const username = req.params.username;

  connection.query('select * from report where writer = ?',[username],function(err,rows){
    if(err){
      console.log("select report fail");
      throw err;
    }else{
      if(rows.length!=0){

        const yy = rows[0].date.getFullYear();
        const mm = rows[0].date.getMonth()+1;
        const dd = rows[0].date.getDate();

        const filePath = path.join(__dirname,"../../upload/"+rows[0].image_savename);
        const fileName = rows[0].image_originname;

        const report = {
          username: rows[0].writer,
          title: rows[0].title,
          imagePath: "test",
          location: rows[0].location,
          content: rows[0].content,
          date: yy+"."+mm+"."+dd,
          view: rows[0].view
        }

        return res.status(200).json(report);
        //const fileStream = fs.createReadStream(filePath);
        //fileStream.pipe(res);
      }else{
        return res.status(400).send();
      }
    }
  });
}

exports.image = (req,res) => {
  const username = req.params.username;
  connection.query('select * from report where writer = ?',[username],function(err,rows){
    if(err){
      console.log("select report fail");
      throw err;
    }else{
      if(rows.length!=0){

        const filePath = path.join(__dirname,"../../upload/"+rows[0].image_savename);
        const fileName = rows[0].image_originname;


        res.writeHeader(200,{
          "Content-Type": "image/jpeg",
          "Content-Disposition": "attachment; filename=" + fileName
        });
        const filestream = fs.createReadStream(filePath);
        filestream.pipe(res);
      }else{
        return res.status(400).send();
      }
    }
  });
}


exports.upload = (req,res,next) => {
  const writer = req.body.writer.split("\"")[1];
  const title = req.body.title.split("\"")[1];
  const location = req.body.location.split("\"")[1];
  const content = req.body.content.split("\"")[1];

  const image_savepath = req.file.path;

  const image_originname = req.file.originalname;
  const image_savename = req.file.filename+".jpg";

  const src = fs.createReadStream(image_savepath);
  const dest = fs.createWriteStream(path.join(__dirname,'../../upload/'+image_savename+".jpg"));
  src.pipe(dest);
  src.on('end',function(){console.log('complete')});
  src.on('error', function(err) {console.log('error')});
  fs.unlink(image_savepath,function(){
    console.log("fs.unlink");
  });


  connection.query('insert into report(title,writer,location,content,image_originname,image_savename,image_path) values(?,?,?,?,?,?,?)',[title,writer,location,content,image_originname,image_savename,image_savepath],function(err,result){
      if(err){
        console.log("upload fail");
        throw err;
      }

      return res.status(200).json();
  });

}
