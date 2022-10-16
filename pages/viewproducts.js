import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

const Viewproducts = ({ products }) => {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [])
  return (
    <>
        <div className="goBack text-4xl mt-2 ml-2 font-bold text-gray-700">
            <button className='text-4xl mt-2 ml-2 font-bold text-gray-700 ' onClick={() => router.back()}>Go Back</button>
        </div>
        <div className="container justify-center flex items-center mt-4 mx-auto">
            <div className="grid grid-cols-1 w-48 md:w-10/12 md:grid-cols-3 gap-2">
                
                {products.map((product) => (
                    <div key={product._id} className="max-w-sm rounded overflow-hidden shadow-xl border-2">
                        <div className="px-6 py-4">
                            <div className=" top-2 right-2 text-base text-gray-600">ID: {product.productId}</div>
                            <div className="font-bold text-xl mt-1 mb-2">{product.name}</div>
                            <p className="text-gray-700 text-base">
                                {product.description}
                            </p>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">₹ {product.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}


export async function getServerSideProps(context) {
    const { id } = context.query
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewproducts`)
    const product = await res.json()
    return {
        props: {
            products: product
        }
    }
}



export default Viewproducts