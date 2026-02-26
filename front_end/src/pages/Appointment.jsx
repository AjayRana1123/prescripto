import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)
  const [docSlot, setDocSlot] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const daysOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']


  const getAvailableSlots = async () => {
    setDocSlot([])

    // getting current date
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date with index

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)

      }
      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
        // increment time by 30 minutes

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlot(prev => ([...prev, timeSlots]))
    }
  }

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])


  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlot)
  }, [docSlot])


  return docInfo && (
    <div className='mt-5'>
      {/* Main container */}
      <div className='flex flex-col sm:flex-row gap-6'>

        {/* Doctor Image */}
        <div className='sm:w-72 w-full'>
          <img
            className='bg-primary rounded-lg w-full'
            src={docInfo.image}
            alt=""
          />
        </div>

        {/* Doctor Info Card */}
        <div className='flex-1 border border-gray-300 rounded-lg p-6 bg-white'>

          {/* Name + Verified */}
          <p className='flex items-center gap-2 text-2xl font-semibold text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>

          {/* Degree + Speciality */}
          <div className='flex items-center gap-3 mt-2 text-gray-600'>
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className='px-3 py-1 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          {/* About Section */}
          <div className='mt-4'>
            <p className='flex items-center gap-2 font-medium text-gray-800'>
              About
              <img className='w-4' src={assets.info_icon} alt="" />
            </p>
            <p className='text-gray-600 mt-2 text-sm leading-relaxed'>
              {docInfo.about}
            </p>
          </div>
          <p className='tex-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600' >{currencySymbol} {docInfo.fee} </span>
          </p>

        </div>

      </div>
      {/* booking slots */}
      <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center overflow-x-scroll mt-4 '  >
          {docSlot.length && docSlot.map((item,index)=>(
            <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text--white':'border border-gray-200'}`}   key={index}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p> {item[0] && item[0].datetime.getDate()}  </p>
              </div>
         ) )}
        </div>

        <div className='flex  items-center gap-3 w-full overflow-x-scroll mt-4' >
          {docSlot.length && docSlot[slotIndex].map((item,index)=>(
            <p onClick={()=>{
              setSlotTime(item.time)
            }} className={`text-s, font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer  ${item.time === slotTime ? 'bg-primary text-white ': 'text-gray-400 border border-gray-300'}  `}  key ={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button  className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer' >Book an appointment</button>
      </div>
      {/* listing  related doctors */}
       <RelatedDoctors 
   docId={docId} 
   speciality={docInfo.speciality} 
/>
    </div>
  )
}
export default Appointment