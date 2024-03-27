import mongoose from "mongoose";
const uri = "mongodb+srv://ak7584:test123@cluster0.wx3cuec.mongodb.net/et_db";

mongoose.pluralize(null);

const connectMongo = async () => {
  try {
    const clientOptions = {
      serverApi: {
        version: "1" as "1",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    };
    mongoose.connect(uri, clientOptions);
    mongoose.connection.on("error", (err) => {
      console.log("err", err);
    });
    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB");
    });
    // await mongoose.connection.useDb("et_db");
    // await mongoose.connection.collection("users").insertOne({
    //   name: "test",
    //   phoneNumber: "1234567890",
    //   password: "test",
    // });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await mongoose.disconnect();
  }
};

export default connectMongo;
