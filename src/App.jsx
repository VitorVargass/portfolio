import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar/navbar'
import Body from './components/body/body'
import 'tailwindcss'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Body/>
    </>
  )
}

export default App;
