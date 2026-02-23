import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from '../context/Appcontext';

const Doctors = () => {

  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ]

  // Apply filter
  const applyFilter = () => {
    if (!doctors) return;

    if (speciality) {
      setFilterDoc(
        doctors.filter(doc => doc.speciality === speciality)
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className='px-4 sm:px-8'>

      <p className='text-gray-600'>
        Browse through the doctors specialist.
      </p>

      <div className='flex flex-col sm:flex-row items-start gap-8 mt-5'>

        {/* ================= MOBILE FILTER BUTTON ================= */}
        <div className='sm:hidden mb-4'>
          <button
            onClick={() => setShowFilter(true)}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg'
          >
            Filters
          </button>
        </div>

        {/* ================= OVERLAY ================= */}
        <div
          onClick={() => setShowFilter(false)}
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
            ${showFilter ? "opacity-100 visible" : "opacity-0 invisible"}
            sm:hidden`}
        ></div>

        {/* ================= SLIDING SIDEBAR ================= */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white z-50 p-5
            transform transition-transform duration-300 ease-in-out
            ${showFilter ? "translate-x-0" : "-translate-x-full"}
            sm:static sm:translate-x-0 sm:h-auto sm:w-60 sm:bg-transparent sm:p-0`}
        >

          <h3 className='text-lg font-semibold mb-4 sm:hidden'>
            Filters
          </h3>

          <div className='flex flex-col gap-3'>
            {specialities.map((item, index) => (
              <p
                key={index}
                onClick={() => {
                  speciality === item
                    ? navigate("/Doctors")
                    : navigate(`/Doctors/${encodeURIComponent(item)}`);

                  setShowFilter(false);
                }}
                className={`px-4 py-2 border rounded-lg cursor-pointer transition-all
                ${speciality === item
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-400"
                  }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* ================= DOCTORS GRID ================= */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

          {filterDoc.map((item, index) => (

            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-8px] transition-all duration-300 shadow-sm hover:shadow-lg'
            >

              {/* Image Container (Face Safe) */}
              <div className='bg-blue-50 h-52 flex items-center justify-center overflow-hidden'>
                <img
                  className='h-full object-contain'
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className='p-4'>

                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <p>Available</p>
                </div>

                <p className='text-gray-900 text-lg font-semibold mt-2'>
                  {item.name}
                </p>

                <p className='text-gray-600 text-sm'>
                  {item.speciality}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  )
}

export default Doctors