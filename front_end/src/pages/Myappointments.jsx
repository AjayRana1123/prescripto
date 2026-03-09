import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Myappointments = () => {

  const { backendUrl, token, getDoctorsData, cancelAppointment } = useContext(AppContext)

  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])

  const [showModal,setShowModal] = useState(false)
  const [selectedAppointment,setSelectedAppointment] = useState(null)
  const [reason,setReason] = useState("")

  // ================= FORMAT DATE =================

  const formatDate = (dateString) => {

    if (!dateString) return ""

    const [day, month, year] = dateString.split('-')

    const date = new Date(`${year}-${month}-${day}`)

    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

  }

  // ================= GET APPOINTMENTS =================

  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/appointments",
        { headers: { token } }
      )

      if (data.success) {
        setAppointments(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch appointments")
    }

  }

  // ================= OPEN CANCEL MODAL =================

  const openCancelModal = (appointmentId) => {

    setSelectedAppointment(appointmentId)
    setShowModal(true)

  }

  // ================= CONFIRM CANCEL =================

  const confirmCancel = async () => {

    if(!reason){
      toast.error("Please provide cancellation reason")
      return
    }

    await cancelAppointment(selectedAppointment,reason)

    setShowModal(false)
    setReason("")

    getUserAppointments()

  }

  // ================= INIT RAZORPAY =================

  const initPay = (order) => {

    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded")
      return
    }

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: "Appointment Payment",

      order_id: order.id,

      handler: async (response) => {

        try {

          const { data } = await axios.post(
            backendUrl + '/api/user/verify-payment',
            response,
            { headers: { token } }
          )

          if (data.success) {

            toast.success("Payment Successful")

            getUserAppointments()

            navigate('/my-appointments')

          }

        } catch (error) {

          console.log(error)

          toast.error(error.message)

        }

      }

    }

    const rzp = new window.Razorpay(options)

    rzp.open()

  }

  // ================= CREATE RAZORPAY ORDER =================

  const appointmentRazorpay = async (appointmentId) => {

    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {

        initPay(data.order)

      }
      else {

        toast.error(data.message)

      }

    } catch (error) {

      toast.error(error.message)

    }

  }

  // ================= LOAD APPOINTMENTS =================

  useEffect(() => {

    if (token) {

      getUserAppointments()

    }

  }, [token])

  return (

    <div>

      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>
        My Appointments
      </p>

      <div>

        {appointments.length === 0 && (

          <p className='mt-6 text-gray-500'>
            No appointments booked yet
          </p>

        )}

        {appointments.map((item) => (

          <div
            key={item._id}
            className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'
          >

            {/* Doctor Image */}

            <div>

              <img
                className='w-32 bg-indigo-50'
                src={item.docData.image}
                alt=""
              />

            </div>

            {/* Doctor Info */}

            <div className='flex-1 text-sm text-zinc-600'>

              <p className='text-neutral-800 font-semibold'>
                {item.docData.name}
              </p>

              <p>{item.docData.speciality}</p>

              <p className='text-zinc-700 font-medium mt-1'>
                Address:
              </p>

              <p className='text-xs'>
                {item.docData.address.line1}
              </p>

              <p className='text-xs'>
                {item.docData.address.line2}
              </p>

              {/* Appointment Date */}

              <p className='text-xs mt-2'>

                <span className='font-medium'>
                  Appointment:
                </span>

                {" "}

                {formatDate(item.slotDate)} | {item.slotTime}

              </p>

              {/* Booked Date */}

              <p className='text-xs mt-1'>

                <span className='font-medium'>
                  Booked On:
                </span>

                {" "}

                {new Date(item.date).toLocaleDateString('en-GB', {

                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'

                })}

              </p>

            </div>

            {/* Buttons */}

            <div className='flex flex-col gap-2 justify-end'>

              {/* Paid */}

              {item.payment && !item.cancelled && (

                <button
                  disabled
                  className='text-sm sm:min-w-48 py-2 border rounded bg-green-600 text-white cursor-not-allowed'
                >
                  Paid
                </button>

              )}

              {/* Pay Online */}

              {!item.payment && !item.cancelled && (

                <button
                  onClick={()=>appointmentRazorpay(item._id)}
                  className='text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                >
                  Pay Online
                </button>

              )}

              {/* Cancel */}

              {!item.cancelled && (

                <button
                  onClick={()=>openCancelModal(item._id)}
                  className='text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                >
                  Cancel Appointment
                </button>

              )}

              {/* Cancelled */}

              {item.cancelled && (

                <button
                  disabled
                  className='text-sm sm:min-w-48 py-2 border rounded bg-red-600 text-white cursor-not-allowed'
                >
                  Cancelled
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* ================= CANCEL MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Cancel Appointment
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Please select or enter the reason for cancellation.
            </p>

            <select
              className="w-full border p-2 rounded mb-3"
              onChange={(e)=>setReason(e.target.value)}
            >

              <option value="">
                Select Reason
              </option>

              <option value="Patient unavailable">
                Patient unavailable
              </option>

              <option value="Emergency">
                Emergency
              </option>

              <option value="Rescheduling">
                Rescheduling
              </option>

            </select>

            <textarea
              placeholder="Custom reason..."
              className="w-full border p-2 rounded mb-4"
              onChange={(e)=>setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

export default Myappointments