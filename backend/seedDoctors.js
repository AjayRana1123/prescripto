import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "./models/doctorModel.js";
import bcrypt from "bcrypt";
import path from "path";

dotenv.config();

// 🔹 MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const doctorsData = [
  { name: "Dr. Richard James", speciality: "General physician", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Emily Larson", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fee: 60 },
  { name: "Dr. Sarah Patel", speciality: "Dermatologist", degree: "MBBS", experience: "1 Year", fee: 30 },
  { name: "Dr. Christopher Lee", speciality: "Pediatricians", degree: "MBBS", experience: "2 Years", fee: 40 },
  { name: "Dr. Jennifer Garcia", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Andrew Williams", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Christopher Davis", speciality: "General physician", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Timothy White", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fee: 60 },
  { name: "Dr. Ava Mitchell", speciality: "Dermatologist", degree: "MBBS", experience: "1 Year", fee: 30 },
  { name: "Dr. Jeffrey King", speciality: "Pediatricians", degree: "MBBS", experience: "2 Years", fee: 40 },
  { name: "Dr. Zoe Kelly", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Patrick Harris", speciality: "Neurologist", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Chloe Evans", speciality: "General physician", degree: "MBBS", experience: "4 Years", fee: 50 },
  { name: "Dr. Ryan Martinez", speciality: "Gynecologist", degree: "MBBS", experience: "3 Years", fee: 60 },
  { name: "Dr. Amelia Hill", speciality: "Dermatologist", degree: "MBBS", experience: "1 Year", fee: 30 },
];

const seedDoctors = async () => {
  try {
    await doctorModel.deleteMany();
    console.log("Old Doctors Deleted 🗑️");

    const doctorsWithImages = [];

    for (let i = 0; i < doctorsData.length; i++) {
      const imagePath = path.join("images", `doc${i + 1}.png`);

      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        folder: "doctors",
      });

      const hashedPassword = await bcrypt.hash("123456", 10);

      doctorsWithImages.push({
        ...doctorsData[i],
        image: uploadResult.secure_url,
        email: `doctor${i + 1}@prescripto.com`,
        password: hashedPassword,
        about: "Experienced and dedicated medical professional providing quality healthcare.",
        address: {
          line1: "Richmond Cross",
          line2: "Ring Road, London",
        },
        date: Date.now(),
      });

      console.log(`Uploaded doc${i + 1} ✅`);
    }

    await doctorModel.insertMany(doctorsWithImages);

    console.log("All Doctors Seeded Successfully 🚀🔥");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedDoctors();
});