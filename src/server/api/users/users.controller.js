const MyApp = require("../../app");
const app = MyApp.app;
const bodyParser = MyApp.bodyParser;

const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'capstone',
  password: '123123',
  database: 'capstone'
};

var connection;

function handleDisconnect(){
  connection = mysql.createConnection(dbConfig);
  connection.connect( function onConnect(err){
    if(err){
        console.log('error when connecting to db:' , err);
        setTimeout(handleDisconnect, 10000);
    }
  });

  connection.on('error', function onError(err){
    console.log('db error',err);
    if(err.code == 'PROTOCOL_CONNECTION_LOST'){
      handleDisconnect();
    }else{
      throw err;
    }
  });
}

handleDisconnect();

exports.show = (req,res) => {
  const id = req.params.id;
  connection.query('select * from user where id = ?',[id],function(err,row){
    if(err){
      console.log("user show api error");
      throw err;
    }
    if(row.length!=0){
      const user = {
        id: row[0].id,
        password: row[0].password,
        username: row[0].username,
        email: row[0].email,
        theme: row[0].theme,
        country: row[0].country
      };
      return res.status(200).json(user);
    }else{
      return res.status(404).send();
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
  connection.query('insert into user(id,password,username,email) values (?,?,?,?)',[user.id,user.password,user.username,user.email],function(err,result){
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
  connection.query('select * from user where id = ?',[id],function(err, row){
    if(err){
      console.log("user login api error");
      throw err;
    }
    if(row.length!=0){
      if(row[0].password==password){
        const user = {
          id: row[0].id,
          password: row[0].password,
          username: row[0].username,
          email: row[0].email,
          theme: row[0].theme,
          country: row[0].country
        };
        return res.status(200).json(user);
      }else{
        return res.status(404).send();
      }
    }else{
      return res.status(404).send();
    }
  });
}

exports.modifyUsername = (req,res) => {
  console.log(req)

  const id = req.params.id;
  const username = req.body.username;

  connection.query('update user set username = ? where id = ?',[username,id],function(err,result){
    if(err){
      throw err;
    }
    if(result){
      return res.status(200).send();
    }else{
      return res.status(400).send();
    }
  });
}

exports.modifyEmail = (req,res) => {
  const id = req.params.id;
  const email = req.body.email;

  connection.query('update user set email = ? where id = ?',[email,id],function(err,result){
    if(err){
      throw err;
    }
    if(result){
      return res.status(200).send();
    }else{
      return res.status(400).send();
    }
  });
}

exports.modifyTheme = (req,res) => {
  const id = req.params.id;
  let theme;
  if(req.body.theme==='empty'){
    theme = NULL;
  }else{
    theme = req.body.theme;
  }

  connection.query('update user set theme = ? where id = ?',[theme,id],function(err,result){
    if(err){
      throw err;
    }
    if(result){
      return res.status(200).send();
    }else{
      return res.status(400).send();
    }
  });
}

exports.modifyCountry = (req,res) => {
  const id = req.params.id;
  let country;
  if(req.body.country==='empty'){
    country = NULL;
  }else{
    country = req.body.country;
  }

  connection.query('update user set country = ? where id = ?',[country,id],function(err,result){
    if(err){
      throw err;
    }
    if(result){
      return res.status(200).send();
    }else{
      return res.status(400).send();
    }
  });
}

exports.deleteUser = (req,res) => {
  const id = req.params.id;
  connection.query('delete from user where id = ?',[id],function(err,result){
    if(err){
      console.log("user delete api error");
      throw err;
    }
    if(result){
      return res.status(204).send();
    }else{
      return res.status(400).send();
    }
  });
}
