import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        
        {/* Основной контент с прокруткой */}
        <main className={`
          flex-1 min-h-0 overflow-auto transition-all duration-300
          ${isSidebarOpen ? 'md:ml-64' : ''}
        `}>
          <div className="p-4 md:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}