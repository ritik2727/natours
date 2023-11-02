const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(
      `${con.connection.host} DB connection successfully established`
    );
  });

// server start

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`server running : ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException',err=>{
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
})