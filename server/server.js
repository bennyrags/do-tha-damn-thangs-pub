const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const thangsRouter = require('./modules/thangs');

//app use 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('server/public'));
app.use('/thangs', thangsRouter);

//console.log('This is thangs router', thangsRouter);

//listen
app.listen(PORT, () => {
console.log('THIS APP IS LISTENIN ON PORT ', PORT);

});