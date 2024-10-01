import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Navbar = ({ onLogout, userName }) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timer)
    }
  }, [])

  const menuItems = [
    { title: '+ Add Product', path: '/addproduct', icon: '📦' },
    { title: '+ New Order', path: '/neworder', icon: '🛒' },
    { title: 'View Orders', path: '/vieworders', icon: '📋' },
    { title: 'Change Order Status', path: '/status', icon: '🔄' },
    { title: 'View Products', path: '/viewproducts', icon: '🏷️' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`hidden md:block ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div className={`hidden md:block ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Welcome, {userName}
            </div>
            <div className="relative">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100' : 'text-white hover:text-gray-200 hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {menuItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(item.path)
                          setIsMenuOpen(false)
                        }}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.title}
                      </a>
                    ))}
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault()
                        onLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar