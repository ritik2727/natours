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
app.listen(port, () => {
  console.log(`server running : ${port}`);
});
