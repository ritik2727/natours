const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const fs = require('fs');
const TourModel = require('../../models/tourModel');
const userModel = require('../../models/userModel');
const reviewModel = require('../../models/reviewModel');

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(
      `${con.connection.host} DB connection successfully established`
    );
  });

//   read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await TourModel.create(tours);
    await userModel.create(user,{validateBeforeSave:false});
    await reviewModel.create(reviews);
    console.log('Data import to the mongodb');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// importData();

const DeleteData = async () => {
  try {
    await TourModel.deleteMany();
    await userModel.deleteMany();
    await reviewModel.deleteMany();
    console.log('Data delete from the mongodb');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
// DeleteData();

if (process.argv[2] === '-d') {
  DeleteData();
} else {
  importData();
}
