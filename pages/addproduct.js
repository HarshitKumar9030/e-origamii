import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CryptoJS from 'crypto-js'


const AddProduct = () => {
    const router = useRouter()
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const randomId = () => {
        return Math.floor(Math.random() * 100000)
    }

    const handleChange = (e) => {
        if (e.target.name === 'name') {
            setName(e.target.value)
        } else if (e.target.name === 'price') {
            setPrice(e.target.value)
        } else if (e.target.name === 'description') {
            setDescription(e.target.value)
        }
    }
    

    const addProduct = async (e) => {
        e.preventDefault()
        if(name==='' || price==='' || description===''){
            toast.error('Please fill all the fields')
        }else{
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addproducts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: randomId(),
                name: name,
                price: price,
                description: description,
            }),
        })
        const data = await res.json()
        if (data.error) {
            toast.error(data.error)
        } else {
            toast.success('Product added successfully')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        }
        setName('')
        setPrice('')
        setDescription('')
        }
    }

  return (
    <>
    <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
    />
    <div className="goBack text-4xl mt-2 ml-2 font-bold text-gray-700 ">
        <button onClick={() => router.back()}>Go Back</button>
    </div>
    <div className="flex justify-center items-center h-screen">
        <div className="md:w-1/3">
            <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input name='name' onChange={handleChange} value={name} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Product Name" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price in INR (₹)
                    </label>
                    <input name='price' value={price} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" placeholder="Product Price" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea name='description' value={description} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Product Description" />
                </div>
                <div onClick={addProduct} className="flex items-center justify-between">
                    <button className="bg-blue-600 ease-in hover:rounded-full duration-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default AddProduct