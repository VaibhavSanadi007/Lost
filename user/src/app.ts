import express from 'express';

const app = express();
const port = process.env.port;



app.listen(port,()=>{
  console.log("server listening at port",port)
})