import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X, Plus, ShoppingCart, ClipboardList, Package, Truck, LogOut, Menu, User, Bell, Search, BarChart2 } from 'lucide-react';

// Define menuItems outside the component
const menuItems = [
    { title: 'Dashboard', icon: <BarChart2 size={20} />, path: '/dashboard' },
    { title: 'Add Product', icon: <Plus size={20} />, path: '/addproduct' },
    { title: 'New Order', icon: <ShoppingCart size={20} />, path: '/neworder' },
    { title: 'View Orders', icon: <ClipboardList size={20} />, path: '/vieworders' },
    { title: 'View Products', icon: <Package size={20} />, path: '/viewproducts' },
    { title: 'Change Order Status', icon: <Truck size={20} />, path: '/status' },
];

const Dashboard = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [name, setName] = useState('User');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState(menuItems);  // Initialize filteredItems with menuItems

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/');
        } else {
            const storedName = localStorage.getItem('name');
            if (storedName) {
                setName(storedName);
            } else {
                setName('User'); // Default fallback
            }
            // Simulating fetching notifications
            setNotifications([
                { id: 1, message: 'New order received' },
                { id: 2, message: 'Product stock low' },
            ]);
        }
    }, [router]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredItems(menuItems);
        } else {
            const filtered = menuItems.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    }, [searchQuery]);

    const logout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(prev => !prev);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-center h-16 border-b">
                    <h1 className="text-xl font-semibold text-gray-800">Sales Dashboard</h1>
                </div>
                <nav className="mt-8">
                    {filteredItems.map((item, index) => (
                        <a
                            key={index}
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                            onClick={() => router.push(item.path)}
                        >
                            {React.cloneElement(item.icon, { className: "text-gray-500" })}
                            <span className="mx-4 font-medium">{item.title}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none lg:hidden">
                            <Menu size={24} />
                        </button>
                        <div className="relative mx-4 lg:mx-0">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Search size={18} className="text-gray-400" />
                            </span>
                            <input
                                className="w-full sm:w-64 rounded-full border border-gray-300 pl-10 pr-4 py-2 focus:border-gray-400 focus:outline-none"
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button className="flex text-gray-500 focus:outline-none" onClick={toggleNotifications}>
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, index) => (
                                            <div key={index} className="p-3 border-b">
                                                <p className="text-sm text-gray-700">{notif.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-sm text-gray-500">No new notifications</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative ml-6">
                            <button className="flex items-center text-gray-700 focus:outline-none">
                                <User size={20} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">{name}</span>
                            </button>
                        </div>
                        <button onClick={logout} className="ml-6 text-gray-500 focus:outline-none hover:text-gray-700 transition-colors duration-200">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {name}</h2>
                        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.slice(1).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                    onClick={() => router.push(item.path)}
                                >
                                    <div className="p-3 mr-4 text-white rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}>
                                        {React.cloneElement(item.icon, { size: 24 })}
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-gray-600">{item.title}</p>
                                        <p className="text-lg font-semibold text-gray-700">Click to view</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Quick Stats */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h3>
                            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { title: 'Total Orders', value: '248', icon: <ShoppingCart size={24} />, color: 'bg-blue-500' },
                                    { title: 'Total Products', value: '1,423', icon: <Package size={24} />, color: 'bg-green-500' },
                                    { title: 'Pending Deliveries', value: '42', icon: <Truck size={24} />, color: 'bg-orange-500' },
                                    { title: 'Total Revenue', value: '$24,780', icon: <BarChart2 size={24} />, color: 'bg-purple-500' },
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                                        <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-gray-600">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-700">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Dashboard;
