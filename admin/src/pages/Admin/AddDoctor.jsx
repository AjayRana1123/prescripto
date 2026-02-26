import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from 'react-toastify'
import axios from "axios";

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl, aToken } = useContext(AdminContext)

  // function to submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        toast.error("Image not selected");
        return;
      }
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      // console log form data

      // formData.forEach((value,key)=>{
      //   console.log(`${key}:${value}`)
      // })


      // Your API call logic will go here
      const {data}=await axios.post(backendUrl +'/api/admin/add-doctor',formData,{headers:{aToken}})
      console.log(data)

      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setDegree('')
        setFees('')
        setAbout('')
        setAddress1('')
        setAddress2('')
        setSpeciality('')
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };



  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setDocImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 sm:p-6">

      <p className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        Add Doctor
      </p>

      <form onSubmit={onSubmitHandler} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md border w-full max-w-6xl">

        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">

          <label htmlFor="doc-image" className="cursor-pointer">
            <img
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 p-2 object-cover border"
              src={preview || assets.upload_area}
              alt="Doctor"
            />
          </label>

          <input
            type="file"
            id="doc-image"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          <p className="text-sm text-gray-500">
            Upload doctor <br /> picture
          </p>

        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4">

            <div>
              <p className="mb-1 text-sm">Doctor Name</p>
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">Doctor Email</p>
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                placeholder="Your email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">Doctor Password</p>
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">Experience</p>
              <select onChange={(e) => setExperience(e.target.value)}
                value={experience} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1} Year</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1 text-sm">Fees</p>
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="number"
                placeholder="Your fees"
                required
                onChange={(e) => setFees(e.target.value)}
                value={fees}
              />
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4">

            <div>
              <p className="mb-1 text-sm">Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)}
                value={speciality} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>General Physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <p className="mb-1 text-sm">Education</p>
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Education"
                required
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">Address</p>
              <input
                className="w-full border rounded-md p-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Address 1"
                required
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
              />
              <input
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Address 2"
                required
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
              />
            </div>

            <div>
              <p className="mb-1 text-sm">About</p>
              <textarea
                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={5}
                placeholder="Write about doctor"
                required
                onChange={(e) => setAbout(e.target.value)}
                value={about}
              ></textarea>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-600 transition-all duration-300"
        >
          Add Doctor
        </button>

      </form>
    </div>
  );
};

export default AddDoctor;