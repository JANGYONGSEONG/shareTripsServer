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
        const report = [];

        rows.map((row,index)=>{
          const yy = row.date.getFullYear();
          const mm = row.date.getMonth()+1;
          const dd = row.date.getDate();

          const filePath = path.join(__dirname,"../../upload/"+row.image_savename);
          const fileName = row.image_originname;

          report.push({
            id: row.report_id,
            username: row.writer,
            title: row.title,
            imagePath: "test",
            location: row.location,
            content: row.content,
            date: yy+"."+mm+"."+dd,
            view: row.view
          });
        });

        return res.status(200).json(report);
      }else{
        return res.status(400).send();
      }
    }
  });
}

exports.showAll = (req,res) => {
  connection.query('select * from report',function(err,rows){
    if(err){
      console.log("select report fail");
      throw err;
    }else{
      if(rows.length!=0){
        const report = [];

        rows.map((row,index)=>{
          const yy = row.date.getFullYear();
          const mm = row.date.getMonth()+1;
          const dd = row.date.getDate();

          const filePath = path.join(__dirname,"../../upload/"+row.image_savename);
          const fileName = row.image_originname;

          report.push({
            id: row.report_id,
            username: row.writer,
            title: row.title,
            imagePath: "test",
            location: row.location,
            content: row.content,
            date: yy+"."+mm+"."+dd,
            view: row.view
          });
        });

        return res.status(200).json(report);
      }else{
        return res.status(400).send();
      }
    }
  });
}

exports.userImage = (req,res) => {
  const username = req.params.username;
  const reportID = req.params.reportID;
  connection.query('select * from report where writer = ? and report_id = ?',[username,reportID],function(err,rows){
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

exports.image = (req,res) => {
  const reportID = req.params.reportID;
  connection.query('select * from report where report_id = ?',[reportID],function(err,rows){
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
  const dest = fs.createWriteStream(path.join(__dirname,'../../upload/'+image_savename));
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
