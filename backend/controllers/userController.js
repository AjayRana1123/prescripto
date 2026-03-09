import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import pkg from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const { v2: cloudinary } = pkg;

// ================= RAZORPAY INSTANCE =================

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});


// ================= REGISTER USER =================

const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success:false, message:"Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success:false, message:"Enter valid email" });
    }

    if (password.length < 8) {
      return res.json({ success:false, message:"Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);

    res.json({ success:true, token });

  } catch (error) {

    console.log(error);
    res.json({ success:false, message:error.message });

  }

};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success:false, message:"User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success:false, message:"Invalid password" });
    }

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);

    res.json({ success:true, token });

  } catch (error) {

    console.log(error);
    res.json({ success:false, message:error.message });

  }

};


// ================= GET USER PROFILE =================

const getProfile = async (req,res) => {

  try {

    const user = await userModel
      .findById(req.userId)
      .select("-password");

    res.json({ success:true, user });

  } catch (error) {

    res.json({ success:false, message:error.message });

  }

};


// ================= UPDATE PROFILE =================

const updateProfile = async (req,res) => {

  try {

    const { name, phone, address, dob, gender } = req.body;
    const image = req.file;

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        address: JSON.parse(address),
        dob,
        gender
      },
      { new:true }
    ).select("-password");

    if (image) {

      const uploadedImage = await cloudinary.uploader.upload(
        image.path,
        { resource_type:"image" }
      );

      await userModel.findByIdAndUpdate(req.userId,{
        image: uploadedImage.secure_url
      });

      user.image = uploadedImage.secure_url;

    }

    res.json({ success:true, user });

  } catch (error) {

    res.json({ success:false, message:error.message });

  }

};


// ================= BOOK APPOINTMENT =================

const bookAppointment = async (req,res) => {

  try {

    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel
      .findById(docId)
      .select("-password");

    if (!docData) {
      return res.json({ success:false, message:"Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success:false, message:"Doctor not available" });
    }

    let slotsBooked = docData.slots_booked || {};

    if (slotsBooked[slotDate]) {

      if (slotsBooked[slotDate].includes(slotTime)) {
        return res.json({ success:false, message:"Slot not available" });
      }

      slotsBooked[slotDate].push(slotTime);

    } else {

      slotsBooked[slotDate] = [slotTime];

    }

    const userData = await userModel
      .findById(userId)
      .select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      doctorId: docId,
      userData,
      docData,
      amount: docData.fee,
      slotDate,
      slotTime,
      date: Date.now(),
      payment:false
    };

    const appointment = new appointmentModel(appointmentData);

    await appointment.save();

    await doctorModel.findByIdAndUpdate(docId,{
      slots_booked: slotsBooked
    });

    res.json({
      success:true,
      message:"Appointment booked successfully"
    });

  } catch (error) {

    console.log(error);
    res.json({ success:false, message:error.message });

  }

};


// ================= LIST USER APPOINTMENTS =================

const listAppointment = async (req,res) => {

  try {

    const appointments = await appointmentModel
      .find({ userId:req.userId })
      .sort({ date:-1 });

    res.json({ success:true, appointments });

  } catch (error) {

    res.json({ success:false, message:error.message });

  }

};


// ================= CANCEL APPOINTMENT =================

const cancelAppointment = async (req,res) => {

  try {

    const { appointmentId, reason } = req.body

    const appointment = await appointmentModel.findById(appointmentId)

    if (!appointment) {
      return res.json({
        success:false,
        message:"Appointment not found"
      })
    }

    if (appointment.userId.toString() !== req.userId) {
      return res.json({
        success:false,
        message:"Unauthorized action"
      })
    }

    appointment.cancelled = true
    appointment.cancelReason = reason

    await appointment.save()

    const { doctorId, slotDate, slotTime } = appointment

    const doctor = await doctorModel.findById(doctorId)

    let slotsBooked = doctor.slots_booked || {}

    if (slotsBooked[slotDate]) {

      slotsBooked[slotDate] =
      slotsBooked[slotDate].filter(slot => slot !== slotTime)

      await doctorModel.findByIdAndUpdate(doctorId,{
        slots_booked: slotsBooked
      })

    }

    res.json({
      success:true,
      message:"Appointment cancelled successfully"
    })

  } catch (error) {

    console.log(error)

    res.json({
      success:false,
      message:error.message
    })

  }

}

// ================= CREATE RAZORPAY ORDER =================

const paymentRazorpay = async (req,res) => {

  try {

    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.cancelled || appointment.payment) {
      return res.json({ success:false, message:"Invalid appointment" });
    }

    const options = {
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success:true, order });

  } catch (error) {

    console.log(error);
    res.json({ success:false, message:error.message });

  }

};


// ================= VERIFY PAYMENT =================

const verifyPayment = async (req,res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

      await appointmentModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment:true }
      );

      res.json({
        success:true,
        message:"Payment verified successfully"
      });

    } else {

      res.json({
        success:false,
        message:"Payment verification failed"
      });

    }

  } catch (error) {

    console.log(error);
    res.json({ success:false, message:error.message });

  }

};


// ================= EXPORT =================

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyPayment
};