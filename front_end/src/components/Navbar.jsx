import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
   const navigate = useNavigate();
   const [showMenu, setShowMenu] = useState(false);
   const {token,setToken}=useContext(AppContext)

   const logout=()=>{
      setToken(false)
      localStorage.removeItem('token')
   }
   return (
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b  border-b-gray-400'>
         <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=" " />
         <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
               <li className='py-1'>Home</li>
               <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/Doctors">
               <li className='py-1'>ALL DOCTORS</li>
               <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/About">
               <li className='py-1'>ABOUT</li>
               <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/Contact">
               <li className='py-1'>CONTACT</li>
               <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
         </ul>
         <div className='flex items-center gap-4'>
            {
               token
               ?<div className='flex items-center gap-2 cursor-pointer group relative'>
                  <img className='w-8 rounded-full' src={assets.profile_pic} alt =""/>
                  <img  className='w-2.5' src={assets.dropdown_icon} alt=""/>
                  <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'> 
                     <div className='min-w-48 bg-stone-100 rounded flex flex-col'> 
                          <p onClick={()=>navigate('Myprofile')} className='hover:text-black cursor-pointer' >My Profile</p>
                          <p  onClick={()=>navigate('Myappointments')}className='hover:text-black cursor-pointer'>My Appointments</p>
                          <p onClick={logout}>Logout</p>
                        </div>
                  </div>


                  </div>
               :
               <button onClick={() => navigate('/Login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create account</button>
               
            }
            <img  onClick={()=>setShowMenu(true)} src={assets.menu_icon}  className='w-6 md:hidden' alt="" />
            {/* mobile menu */}
           {/* Mobile Menu */}
<div className={`${
  showMenu ? 'fixed inset-0 w-full h-full' : 'hidden'
} md:hidden bg-white z-30`}>

  <div className='flex items-center justify-between px-5 py-6 border-b'>
    <img className='w-36' src={assets.logo} alt="" />
    <img
      className='w-7 cursor-pointer'
      onClick={() => setShowMenu(false)}
      src={assets.cross_icon}
      alt=""
    />
  </div>

  <ul className='flex flex-col items-center gap-6 mt-10 text-lg font-medium'>
    <NavLink  onClick={()=>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block' >Home</p></NavLink>
    <NavLink  onClick={()=>setShowMenu(false)} to='/Doctors'><p  className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
    <NavLink   onClick={()=>setShowMenu(false)} to='/About'><p  className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
    <NavLink  onClick={()=>setShowMenu(false)} to='/Contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
  </ul>

</div>
            </div>
      </div>
   )
}

export default Navbar