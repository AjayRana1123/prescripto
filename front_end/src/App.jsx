import React from 'react'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Myappointments from './pages/Myappointments'
import Contact from './pages/Contact'
import About from './pages/About'
import Myprofile from './pages/Myprofile'
import Appointment from './pages/Appointment'


import { Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Doctors/:speciality' element={<Doctors />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/About' element={<About />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Myprofile' element={<Myprofile />} />
        <Route path='/Myappointments' element={<Myappointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App