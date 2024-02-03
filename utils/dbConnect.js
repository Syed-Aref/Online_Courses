const mongoose = require("mongoose");


module.exports = mongoose.connect(
  "mongodb+srv://arefahmedprevail:3lUBBYjioxLvqdxR@mongodb-demo.z2x5gnd.mongodb.net/online-courses?retryWrites=true&w=majority"
).then(() => {
  console.log("(SystemMessage_dbConnect.js) Db connected")
}).catch(err => {
  console.log(err.message)
});