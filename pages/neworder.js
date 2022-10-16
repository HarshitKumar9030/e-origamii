import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";

const NewOrder = ({ products }) => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oid, setOid] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const handleProduct = (e, product) => {
    const p = products.find((product) => product._id === e.target.value);
    setPrice(p.price);
    setProduct(p.productId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "status") {
      setStatus(value);
    } else if (name === "date") {
      setDate(value);
    }
    logAll()
  };

  const logAll = () => {
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(oid);
    console.log(product);
    console.log(price);
    console.log(status);
    console.log(date);
    };

  const generateOid = () => {
    if (oid === "") {
      const oid = CryptoJS.lib.WordArray.random(16).toString();
      setOid(oid);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !email ||
      !phone ||
      !oid ||
      !product ||
      !price ||
      !status ||
      !date
    ) { 
        toast.error("Please fill all the fields");
    }else{
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/neworder`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              email: email,
              phone: phone,
              uniqueId: oid,
              productId: product,
              price: price,
              status: status,
              date: date,
            }),
          });
          const data = await res.json();
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Order Placed Successfully");
            setTimeout(() => {
                router.push("/dashboard");
                }, 1000);
                
          }

    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="goBack">
        <button
          className="text-4xl mt-2 ml-2 font-bold text-gray-700 "
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-28 sm:py-12">
        <div className="flex flex-col rounded-t-lg items-center justify-center w-full px-4 pt-6 pb-8 mt-6 overflow-hidden text-left transition-all transform bg-white border border-gray-300 rounded-lg shadow-xl sm:max-w-md sm:w-full sm:p-6">
          <div className="flex flex-col  items-center justify-center w-full">
            <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="w-full mt-6">
              <h2 className="mb-1 text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                New Order
              </h2>
              <p className="text-sm text-gray-500">
                Please fill in the details below to create a new order.
              </p>
            </div>
          </div>
          <div className="w-full mt-6">
            <form className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Order ID
                </label>
                <input
                  disabled
                  value={oid}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Order ID"
                />
                <button
                  type="button"
                  onClick={generateOid}
                  className="px-6 font-semibold bg-blue-600 py-2 hover:bg-blue-700 rounded-lg text-white duration-300"
                >
                  Generate
                </button>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Order Date
                </label>
                <input
                    onChange={handleChange}
                    name="date"
                    value={date}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="date"
                  placeholder="Order Date"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Order Status
                </label>
                <select onChange={handleChange} value={status} name='status' className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline">
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Customer Name
                </label>
                <input
                    onChange={handleChange}
                    name="name"
                    value={name}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Customer Name"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Customer Email
                </label>
                <input
                    onChange={handleChange}
                    name="email"
                    value={email}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="Customer Email"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Customer Phone
                </label>
                <input
                    onChange={handleChange}
                    name="phone"
                    value={phone}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Customer Phone"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Select Product
                </label>
                <select
                  onChange={handleProduct}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                >
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}, Price: {product.price}₹
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                  Product Id
                </label>
                <input
                  disabled
                  value={product}
                  className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Product Id"
                />
              </div>
                <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Product Price
                </label>
                <input
                    disabled
                    value={`${price} ₹`}
                    className="px-4 py-3 text-base text-gray-700 placeholder-gray-400 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Product Price"
                />  
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 font-semibold bg-blue-600 py-2 hover:bg-blue-700 rounded-lg text-white duration-300"
                >
                    Submit
                </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/viewproducts`);
  const product = await res.json();
  return {
    props: {
      products: product,
    },
  };
}
export default NewOrder;
