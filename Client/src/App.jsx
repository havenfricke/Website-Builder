import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './Components/Navbar'
import React from 'react'

 export function App() {

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
