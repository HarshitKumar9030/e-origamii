import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Package, Calendar, Mail, DollarSign, Truck, Search } from 'lucide-react';

const Status = ({ orders }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const results = orders.filter(order =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const changeStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/changestatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            status: newStatus,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setFilteredOrders(prevOrders =>
          prevOrders.map(order =>
            order.uniqueId === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("An error occurred while updating the status");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="bg-cyan-500 rounded-full p-3">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Status Management</h1>
              <p className="text-sm text-gray-500">Update and track order statuses</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition duration-300 ease-in-out"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Search Orders</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-300 ease-in-out"
                placeholder="Search by product, email or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div key={order.uniqueId} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">{order.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{order.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-lg font-semibold">₹ {order.price}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                  </label>
                  <select
                    onChange={(e) => changeStatus(order.uniqueId, e.target.value)}
                    value={order.status}
                    className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300 ease-in-out"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/vieworders`);
  const orders = await res.json();
  return {
    props: {
      orders,
    },
  };
}