import doctorModel from "../models/doctorModel.js"

const changeAvailability = async (req, res) => {
    try {
        const {docId}=req.body
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availability Changed'})

    } catch (error) {
        console.log("ERROR:", error)
        res.json({ success: false, message: error.message })
    }
}

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export {changeAvailability}

