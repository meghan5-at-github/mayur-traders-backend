// index.js
const express = require('express');
const app = express();
const routes = require('./route');
const cors = require('cors');
app.use(cors());  
app.use(express.json());

const port = process.env.PORT || 3000;
console.log("index ",port);
app.use('/api', routes);

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
