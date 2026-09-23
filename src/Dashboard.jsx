import { Outlet } from 'react-router-dom'
import './css/dashboard.css'
import { Toaster } from 'react-hot-toast'


const Dashboard = () => {


  return (
    <div className='dash_outer'>
      <Toaster />
      <header>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/Learn">Learn</a>
            </li>
            <li>
              <a href="/Edit">Edit</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />

      </main>
    </div>
  )
}

export default Dashboard

