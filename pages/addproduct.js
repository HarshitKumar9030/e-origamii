import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, Package, DollarSign, FileText, Plus, Loader } from 'lucide-react'

const AddProduct = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [router])

    const randomId = () => {
        return Math.floor(Math.random() * 100000)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        switch (name) {
            case 'name':
                setName(value)
                break
            case 'price':
                setPrice(value)
                break
            case 'description':
                setDescription(value)
                break
            default:
                break
        }
    }

    const addProduct = async (e) => {
        e.preventDefault()
        if (name === '' || price === '' || description === '') {
            toast.error('Please fill all the fields')
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addproducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: randomId(),
                    name,
                    price,
                    description,
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
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
            setName('')
            setPrice('')
            setDescription('')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900">Add a New Product</h2>
                            <Package className="h-10 w-10 text-blue-500" />
                        </div>
                        <p className="text-gray-600 mb-8">Enter the details of the new product below.</p>
                        <form onSubmit={addProduct} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Product Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={name}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Enter product name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price (INR)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={price}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Enter product price"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Go Back
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        <Plus className="h-5 w-5 mr-2" />
                                    )}
                                    {isLoading ? 'Adding...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct