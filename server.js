const express = require('express');
const app = express();
const {connectDB} = require('./connectDB')
const bodyparser = require("body-parser");
const route = require('./app')


app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use('/api/v1', route)
app.get('/api/doc', (req, res)=>{
  res.sendFile(__dirname + '/public/index.html')
})
app.get("*", (req, res) => {
    res.json({
      msg: "Improper route. Check API docs plz."
    })
})


app.listen(3000, async function(err){
    await connectDB()
    console.log('Server listening on port 3000');
});