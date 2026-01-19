import { useState } from 'react'
import './App.css'
import Map from './components/Map'

function App() {

  return (
    <div data-theme="light">
      <div className='flex items-center justify-center'>
        <Map />
      </div>
    </div>
  )
}

export default App
