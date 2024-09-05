import mongoose from "mongoose";
 
export const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://gyeongcheong23:OMIM5vasaz7gnC84@cluster0.d8iwxjc.mongodb.net/gyeongcheong").then(() => console.log('DB connected'));
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI).then(() => console.log('DB connected'));
}