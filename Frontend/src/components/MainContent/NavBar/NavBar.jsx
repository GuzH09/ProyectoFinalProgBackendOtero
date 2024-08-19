import { NavLink, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import UsersWidget from './UsersManagerWidget'
import AdminWidget from './AdminManagerWidget'
import ProfileWidget from './ProfileWidget'
import CartWidget from './CartWidget'
import ChatWidget from './ChatWidget'

const NavBar = () => {
  const { profile } = useContext(AuthContext)

  return (
    <nav className="sticky top-0 w-full h-[138px] flex flex-col shadow-md bg-gray-100 lg:px-10 lg:h-[80px] lg:flex-row lg:justify-between lg:items-center xl:px-56">
      <div className="w-full lg:w-1/3">
        <Link to="/home" className="flex flex-row justify-center items-center bg-gray-400 lg:bg-transparent lg:justify-start">
          <div className="w-9 h-[48px] py-1 lg:h-16 lg:w-16 lg:p-2">
            <img src={'/images/logo.png'} className="object-contain w-full" />
          </div>
          <h3 className="text-[#21232A] hover:text-gray-400 text-sm text-left hidden lg:block">
            GuzH Tech Store
          </h3>
        </Link>
      </div>

      <div className="w-full flex flex-row justify-between h-[48px] items-center text-[#21232A] bg-gray-300 text-sm lg:w-1/3 lg:justify-center lg:gap-8 lg:bg-transparent xl:justify-evenly">
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-200 lg:border-transparent lg:block lg:w-auto lg:h-auto'>
          <NavLink to={'/home/category/celular'} className="text-md font-bold">Celulares</NavLink>
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-200 lg:border-transparent lg:block lg:w-auto lg:h-auto'>
          <NavLink to={'/home/category/tablet'} className="text-md font-bold">Tablets</NavLink>
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-200 lg:border-transparent lg:block lg:w-auto lg:h-auto'>
          <NavLink to={'/home/category/notebook'} className="text-md font-bold">Notebooks</NavLink>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between h-[48px] items-center text-[#21232A] bg-gray-200 lg:text-sm lg:w-1/3 lg:justify-end lg:gap-5 lg:bg-transparent xl:gap-10">
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-100 lg:block lg:w-auto lg:h-auto'>
          {profile && <ProfileWidget />}
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-100 lg:block lg:w-auto lg:h-auto'>
          {profile && (profile.role === 'admin' || profile.role === 'premium') && <ChatWidget />}
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-100 lg:block lg:w-auto lg:h-auto'>
          {profile && (profile.role === 'admin' || profile.role === 'premium') && <AdminWidget />}
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-100 lg:block lg:w-auto lg:h-auto'>
          {profile && (profile.role === 'admin') && <UsersWidget />}
        </div>
        <div className='w-full h-full flex justify-center items-center border-1 border-gray-100 lg:block lg:w-auto lg:h-auto'>
          {profile && <CartWidget />}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
