import { NavLink, Outlet } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

function App() {
  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container-cos py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
