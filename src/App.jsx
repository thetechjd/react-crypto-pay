import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import CryptoPayButton from './components/CryptoPayButton/CryptoPayButton'
import CryptoPayModal from './components/CryptoPayModal/CryptoPayModal'
import './App.css'

function App() {
  
  

  return (
   
      
     <CryptoPayModal
     apiKey={'YOUR_API_KEY'}
     productId={'YOUR_PROD_ID'}
     label='Pay with Crypto'
     
     
     />
      
     
    
    
  )
}

export default App
