const MyApp = require("../../app");
const app = MyApp.app;
const bodyParser = MyApp.bodyParser;

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
  const id = req.params.id;
  connection.query('select * from user where id = ?',[id],function(err,rows){
    if(err){
      console.log("user show api error");
      throw err;
    }
    if(row.length!=0){
      return res.status(200).json(row);
    }else{
      return res.status(404).json({error: 'Unknown user'});
    }
  });
}

exports.join = (req,res) => {
  const user = {
    id: req.body.id,
    password: req.body.password,
    username: req.body.username,
    email: req.body.email
  };
  connection.query('insert into user values (?,?,?,?)',[user.id,user.password,user.username,user.email],function(err,result){
    if(err){
      console.log("user create api error");
      throw err;
    }
    return res.status(201).json(user);
  });
}

exports.login = (req,res) => {
  const id = req.body.id;
  const password = req.body.password;
  connection.query('select password from user where id = ?',[id],function(err, row){
    if(err){
      console.log("user login api error");
      throw err;
    }
    if(row.length!=0){
      if(row[0].password==password){
        return res.status(200).json({message:"login success"});
      }else{
        return res.status(404).json({error:"password does not match"});
      }
    }else{
      return res.status(404).json({error: 'Unknown user'});
    }
  })
}

exports.update = (req,res) => {

}

exports.modify = (req,res) => {

}

exports.destroy = (req,res) => {

}
