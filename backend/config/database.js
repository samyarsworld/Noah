const mongoose = require("mongoose");

// const databaseConnect = () => {
//   mongoose.set('strictQuery', true);
//   mongoose.connect(process.env.MONGODB_ATLAS_URL)
//     .then(() => console.log('Connected to mongo'))
//     .catch((err) => {
//       console.error('Failed to connect with mongo');
//       console.error(err);
//     });
// };

const databaseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongodb Database Connected");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = databaseConnect;
