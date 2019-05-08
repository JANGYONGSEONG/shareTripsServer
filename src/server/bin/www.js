const Myapp = require('../app');
const app = Myapp.app;

const hostname= '192.168.171.160';
const port = 8080;

app.listen(port, hostname, () => console.log("Listening on port 8080!"));
