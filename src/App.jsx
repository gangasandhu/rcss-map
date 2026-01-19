import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import { Route, Routes } from 'react-router-dom'
import AddProduct from './components/AddProduct'
import Navbar from './components/Navbar'

function App() {

  return (
    <div data-theme="light">
      <Navbar />
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='/products' element={<AddProduct />} />
      </Routes>
    </div>
  )
}

export default App
