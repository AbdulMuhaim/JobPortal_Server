const mongoose= require("mongoose")

const connectToDatabase = () => {
    mongoose
      .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connected successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };



  module.exports = connectToDatabase;