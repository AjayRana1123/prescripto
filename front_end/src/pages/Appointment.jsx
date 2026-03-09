import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlot, setDocSlot] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const navigate = useNavigate()

  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']


  // ================= GET AVAILABLE SLOTS =================

  const getAvailableSlots = async () => {

    setDocSlot([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {

      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21,0,0,0)

      if (today.getDate() === currentDate.getDate()) {

        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)

      } else {

        currentDate.setHours(10)
        currentDate.setMinutes(0)

      }

      let timeSlots = []

      while (currentDate < endTime) {

        let formattedTime = currentDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + '-' + month + '-' + year
        const slotTime = formattedTime.toLowerCase()

        const isSlotAvailable =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true

        if (isSlotAvailable) {

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })

        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)

      }

      setDocSlot(prev => [...prev, timeSlots])

    }

  }


  // ================= FETCH DOCTOR INFO =================

  const fetchDocInfo = () => {

    const doc = doctors.find(doc => doc._id === docId)

    setDocInfo(doc)

  }


  // ================= BOOK APPOINTMENT =================

  const bookAppointment = async () => {

    if (!token) {
      toast.warn("Login to book appointment")
      return navigate('/login')
    }

    if (!slotTime) {
      toast.warn("Please select a time slot")
      return
    }

    try {

      const date = docSlot[slotIndex].find(slot => slot.time === slotTime)?.datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + '-' + month + '-' + year

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        {
          docId,
          slotDate,
          slotTime
        },
        { headers:{ token } }
      )

      if (data.success) {

        toast.success(data.message)

        getDoctorsData()

        navigate('/my-appointments')

      } else {

        toast.error(data.message)

      }

    } catch (error) {

      console.log(error)
      toast.error(error.message)

    }

  }


  // ================= USE EFFECTS =================

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])


  // ================= UI =================

  return docInfo && (
    <div className='mt-5'>

      {/* Doctor Info Section */}

      <div className='flex flex-col sm:flex-row gap-6'>

        <div className='sm:w-72 w-full'>
          <img className='bg-primary rounded-lg w-full' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-300 rounded-lg p-6 bg-white'>

          <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          <div className='flex items-center gap-3 mt-2 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='px-3 py-1 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          <div className='mt-4'>
            <p className='flex items-center gap-2 font-medium text-gray-800'>
              About
              <img className='w-4' src={assets.info_icon} alt="" />
            </p>

            <p className='text-gray-600 mt-2 text-sm leading-relaxed'>
              {docInfo.about}
            </p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:
            <span className='text-gray-600'> {currencySymbol} {docInfo.fee}</span>
          </p>

        </div>

      </div>


      {/* SLOT BOOKING */}

      <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700'>

        <p>Booking slots</p>

        {/* DATE */}

        <div className='flex gap-3 items-center overflow-x-scroll mt-4'>

          {docSlot.length > 0 && docSlot.map((item,index)=>(
            
            <div
              onClick={()=>setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
              key={index}
            >

              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>

              <p>{item[0] && item[0].datetime.getDate()}</p>

            </div>

          ))}

        </div>


        {/* TIME */}

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>

          {docSlot.length > 0 && docSlot[slotIndex]?.map((item,index)=>(

            <p
              onClick={()=>setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
              key={index}
            >

              {item.time.toLowerCase()}

            </p>

          ))}

        </div>


        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'
        >
          Book an appointment
        </button>

      </div>


      <RelatedDoctors
        docId={docId}
        speciality={docInfo.speciality}
      />

    </div>
  )

}

export default Appointment