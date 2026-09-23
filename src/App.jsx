import React from 'react'
import Dashboard from './Dashboard'
import Edit from './Edit'
import Learn from './Learn'
import Login from './Login'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

  return isLoggedIn ? children : <Navigate to="/Login" replace />
}

const crudroutes = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/Edit",
      element: (<ProtectedRoute>
        <Edit />
      </ProtectedRoute >)
    },
    {
      path: "/Learn",
      element: <Learn />
    },
    {
      path: "/Login",
      element: <Login />
    },
    {
      path: "*",
      element: <Dashboard />
    }
  ])

const App = () => {
  return (
    <div>
      <Toaster />
      <RouterProvider router={crudroutes}></RouterProvider>
    </div>
  )
}

export default App
