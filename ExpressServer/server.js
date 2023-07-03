//Name: Gan Wen Tao
// Admission No: p2200378
// Class: DIT/FT/1B/10

const app = require('./controller/app');
const port = 8081;
const hostname = 'localhost';
const server = app.listen(port, hostname, function(){
    console.log(`Web app hosted at http://${hostname}:${port}`);
});