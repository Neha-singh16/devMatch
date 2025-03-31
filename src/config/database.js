const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://NamasteNode:qwHM4zB1KqMV38p5@namastenode.fpw8h.mongodb.net/devTinder");
}

 module.exports = {
    connectDB,
 }