import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Status = ({ orders }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const [status, setStatus] = useState("");

  const changeStatus = async (e, order) => {
        e.preventDefault();
        const id = order.uniqueId;
        setStatus(e.id.value);
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/changestatus`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status,
            }),
        }
    );
  };

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
        <button
          className="text-4xl mt-2 ml-2 font-bold text-gray-700 "
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div className="container justify-center flex items-center mt-4 mx-auto">
        <div className="grid grid-cols-1 w-48 md:w-10/12 md:grid-cols-3 gap-2">
          {orders.map((order) => (
            <div
              key={order.uniqueId}
              className="max-w-sm rounded overflow-hidden shadow-xl border-2"
            >
              <div className="px-6 py-4">
                <div className=" top-2 right-2 text-base text-gray-600">
                  Product: {order.name}
                </div>
                <div className="font-bold text-xl mt-1 mb-2">{order.email}</div>
                <p className="text-gray-700 text-base">Date: {order.date}</p>
                <p className="text-gray-900 text-lg">
                  Current Status: {order.status}
                </p>
                <div className="flex flex-col space-y-1">
                  <label className="text-lg font-medium text-gray-700 tracking-wide">
                    Change Status
                  </label>
                  <select
                    onChange={(e, order) => {changeStatus}}
                    name={order.uniqueId}
                    className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  ₹ {order.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Status;

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/vieworders`);
  const order = await res.json();
  return {
    props: {
      orders: order,
    },
  };
}
