
const { mongoose } = require('mongoose')

const connectDB = async () => {
  try {
    
    const x = await mongoose.connect('mongodb+srv://nimrat:fHx0IBgTR4NKudTa@cluster0.fxiblat.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
    console.log("Connected to db");
    
  } catch (error) {
    console.log('db error');
  }
}

module.exports = { connectDB }