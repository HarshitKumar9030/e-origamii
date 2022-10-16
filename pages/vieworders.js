import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";

const ViewOrders = ({ orders }) => {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/')
        }
    }, [])
  return (
    <>
        <ToastContainer
            position="top-left"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <div className="goBack text-4xl mt-2 ml-2 font-bold text-gray-700">
            <button className='text-4xl mt-2 ml-2 font-bold text-gray-700 ' onClick={() => router.back()}>Go Back</button>
        </div>
        <div className="container justify-center flex items-center mt-4 mx-auto">
            <div className="grid grid-cols-1 w-48 md:w-10/12 md:grid-cols-3 gap-2">
                
                {orders.map((order) => (
                    <div key={order.uniqueId} className="max-w-sm rounded overflow-hidden shadow-xl border-2">
                        <div className="px-6 py-4">
                            <div className=" top-2 right-2 text-base text-gray-600">Product: {order.name}</div>
                            <div className="font-bold text-xl mt-1 mb-2">{order.email}</div>
                            <p className="text-gray-700 text-base">
                                Date: {order.date}
                            </p>
                            <p className="text-gray-900 text-lg">
                                Status: {order.status}
                            </p>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">₹ {order.price}</span>
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/vieworders`)
    const order = await res.json()
    return {
        props: {
            orders: order
        }
    }
}

export default ViewOrders