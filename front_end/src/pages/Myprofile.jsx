import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {

  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2024-07-20'
  })

  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className='max-w-3xl mx-auto py-10 px-6 text-sm text-gray-600'>

      {/* Profile Image */}
      <div className='flex items-center gap-6'>
        <img
          className='w-28 h-28 rounded-lg object-cover'
          src={userData.image}
          alt=""
        />
        <div className='w-28 h-28 bg-indigo-100 rounded-lg flex items-center justify-center'>
          <span className='text-4xl text-indigo-400'>👤</span>
        </div>
      </div>

      {/* Name */}
      <div className='mt-6'>
        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData(prev => ({ ...prev, name: e.target.value }))
            }
            className='text-2xl font-semibold border-b outline-none'
          />
        ) : (
          <h2 className='text-2xl font-semibold text-gray-800'>
            {userData.name}
          </h2>
        )}
      </div>

      <hr className='my-6' />

      {/* Contact Info */}
      <div>
        <p className='font-semibold text-gray-500 mb-4 underline'>
          CONTACT INFORMATION
        </p>

        <div className='space-y-3'>

          <div className='flex gap-6'>
            <p className='w-28'>Email id:</p>
            <p className='text-primary'>{userData.email}</p>
          </div>

          <div className='flex gap-6'>
            <p className='w-28'>Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, phone: e.target.value }))
                }
                className='border px-2 py-1 rounded'
              />
            ) : (
              <p className='text-primary'>{userData.phone}</p>
            )}
          </div>

          <div className='flex gap-6'>
            <p className='w-28'>Address:</p>
            {isEdit ? (
              <div>
                <input
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value
                      }
                    }))
                  }
                  className='border px-2 py-1 rounded mb-2 block'
                />
                <input
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))
                  }
                  className='border px-2 py-1 rounded'
                />
              </div>
            ) : (
              <p>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Basic Info */}
      <div className='mt-8'>
        <p className='font-semibold text-gray-500 mb-4 underline'>
          BASIC INFORMATION
        </p>

        <div className='space-y-3'>

          <div className='flex gap-6'>
            <p className='w-28'>Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, gender: e.target.value }))
                }
                className='border px-2 py-1 rounded'
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}
          </div>

          <div className='flex gap-6'>
            <p className='w-28'>Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, dob: e.target.value }))
                }
                className='border px-2 py-1 rounded'
              />
            ) : (
              <p>
                {new Date(userData.dob).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className='flex gap-4 mt-8'>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className='border border-primary text-primary px-6 py-2 rounded-full cursor-pointer hover:bg-blue-600 hover:text-white'
          >
            Edit
          </button>
        )}

        {isEdit && (
          <button
            onClick={() => setIsEdit(false)}
            className='border border-primary text-primary px-6 py-2 rounded-full cursor-pointer hover:bg-blue-600 hover:text-white'
          >
            Save information
          </button>
        )}
      </div>

    </div>
  )
}

export default MyProfile