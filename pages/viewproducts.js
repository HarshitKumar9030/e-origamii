import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, Search, Package, DollarSign, Tag, Info } from 'lucide-react'

const Viewproducts = ({ products }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredProducts, setFilteredProducts] = useState(products)

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [router])

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productId.toString().includes(searchTerm)
        )
        setFilteredProducts(results)
    }, [searchTerm, products])

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
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
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5">
                            <div className="h-14 w-14 bg-cyan-500 rounded-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                                <h2 className="leading-relaxed">View Products</h2>
                                <p className="text-sm text-gray-500 font-normal leading-relaxed">Browse and search your product catalog</p>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="flex flex-col">
                                    <label className="leading-loose">Search Products</label>
                                    <div className="relative focus-within:text-gray-600 text-gray-400">
                                        <Search className="absolute left-3 top-2 w-6 h-6" />
                                        <input
                                            type="text"
                                            className="pr-4 pl-12 py-2 border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                            placeholder="Search by name, description or ID"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
                <div className="py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <Tag className="w-5 h-5 text-gray-500" />
                                        <span className="text-sm text-gray-600">ID: {product.productId}</span>
                                    </div>
                                    <div className="font-bold text-xl mb-2 text-gray-800">{product.name}</div>
                                    <p className="text-gray-700 text-base mb-4">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-lg font-semibold text-green-600">₹ {product.price}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Implement view details functionality
                                                toast.info(`Viewing details for ${product.name}`)
                                            }}
                                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
                                        >
                                            <Info className="w-4 h-4 mr-1" />
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Go Back
                </button>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewproducts`)
    const products = await res.json()
    return {
        props: {
            products
        }
    }
}

export default Viewproducts