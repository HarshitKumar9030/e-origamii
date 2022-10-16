import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'


const Dashboard = () => {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [])

    const [menu, setMenu] = useState(false)
    const changeMenu = () => {
        setMenu(!menu)
    }

    const name = "Aditya"

    const logout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

  return (
    <>
        <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      />
    <div>
        <div className="header flex justify-between md:justify-around mt-2 mx-2 items-center selection:bg-transparent ">
            <h1 className='text-2xl text-gray-900 underline underline-offset-2 font-bold '>Dashboard</h1>
            <div onClick={changeMenu} className={`add flex  justify-center border-blue-600 duration-300 border-2 ease-in  bg-white hover:bg-blue-600 active:bg-blue-600 text-lg hover:text-gray-100 font-semibold cursor-pointer  py-2 px-6 items-center rounded-2xl hover:rounded-full ${menu ? "bg-blue-600 text-white rounded-full":"bg-white"}`}>Menu </div>
        </div>
        <hr className='w-auto flex justify-center mx-12 mt-2' />
        <div className="welcome">
            <div className="text-center mt-2 text-4xl md:text-6xl text-gray-900 font-bold">Welcome <span className='tbounce text-blue-600 relative duration-300'>{name}</span></div>
        </div>
        <div className="mt-8 text-center text-gray-700 font-bold text-2xl md:text-4xl ml-4">Sales <span className="text-gray-900">Manager</span></div>
        <div className="content flex md:flex-row mt-12 justify-center items-center mx-auto flex-col space-y-4 md:space-y-0 md:space-x-4">
            <div onClick={()=> router.push('/addproduct')} className="px-32 py-28 rounded-lg bg-gray-400 flex justify-center items-center hover:bg-slate-600 duration-300 ease-in cursor-pointer hover:text-white font-bold text-xl mx-2 w-32 h-32">+ Add Product</div>
            <div onClick={()=> router.push('/neworder')} className="px-32 py-28 rounded-lg bg-gray-400 flex justify-center items-center hover:bg-slate-600 duration-300 ease-in cursor-pointer hover:text-white font-bold text-xl mx-2 w-32 h-32">+ New Order</div>
            <div onClick={()=> router.push('/vieworders')} className="px-32 py-28 rounded-lg bg-gray-400 flex justify-center items-center hover:bg-slate-600 duration-300 ease-in cursor-pointer hover:text-white font-bold text-xl mx-2 w-32 h-32">View Orders</div>
            <div onClick={()=> router.push('/viewproducts')} className="px-32 py-28 rounded-lg bg-gray-400 flex justify-center items-center hover:bg-slate-600 duration-300 ease-in cursor-pointer hover:text-white font-bold text-xl mx-2 w-32 h-32">View Products</div>
            <div onClick={()=> router.push('/status')} className="px-32 py-28 rounded-lg bg-gray-400 flex justify-center items-center hover:bg-slate-600 duration-300 ease-in cursor-pointer hover:text-white font-bold text-xl mx-2 w-32 h-32">Change Order Status</div>

        </div>
        <div className="footer font-semibold text-xl mt-4 mx-auto md:absolute bottom-2 text-center left-96 right-96">Made with love by <span className='text-blue-600'>Harshit Kumar</span>(ATL).</div>
    </div>

    {menu && <div className='flex flex-col menu absolute top-16 right-2 lg:right-[17.25rem] h-[10.1rem] w-[12rem] rounded-lg bg-gray-400'>
        <div onClick={()=> router.push('/addproduct')} className="w-full h-10 bg-gray-900 rounded-t-lg flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-200 text-white text-center">+ Add Product</div>
        <div onClick={()=> router.push('/neworder')} className="w-full h-10   flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-900 text-white">+ New Order</div>
        <div onClick={()=> router.push('/vieworders')}  className="w-full h-10 bg-gray-900  flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-200 text-white text-center">View Orders</div>
        <div onClick={()=> router.push('/status')}  className="w-full h-10 bg-gray-600  flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-200 text-white text-center">Change Order Status</div>
        <div onClick={()=> router.push('/viewproducts')}  className="w-full h-10  flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-900 text-white text-center">View Products</div>
        <div onClick={logout} className="w-full h-10 bg-gray-900  flex justify-center items-center font-bold duration-300 cursor-pointer hover:text-gray-200 text-white rounded-b-lg text-center">Logout</div>
        </div>}
    </>
  )
}

export default Dashboard