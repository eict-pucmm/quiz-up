import mongoose from 'mongoose';

export default function (mongoDB) {
  mongoose
    .connect(mongoDB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connection Succesful to MongoDB! :D');
    })
    .catch(err => console.log('ERROR', err));
}
