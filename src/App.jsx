import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CryptoPayButton from './components/CryptoPayButton/CryptoPayButton'
import './App.css'

function App() {
  
  

  return (
   
      
     <CryptoPayButton
     apiKey={'ntjCcsamqnVIrV8kCmYM4nllTqBgAtnql0S'}
     productId={'sometestid0'}
     label='Pay with Crypto'
     
     
     />
      
     
    
    
  )
}

export default App
