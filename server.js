const app = require('./app');

// server start
const port = 5000;
app.listen(port, () => {
  console.log(`server running : ${port}`);
});
