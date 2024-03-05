import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CryptoPay from './CryptoPayButton'
import CryptoPayModal, {openModal} from './CryptoPayModal'
import './App.css'

function App() {
  
  const [showButton, setButton] = useState(true)

  
    const getModal = () => {

     openModal()
     setButton(false)

    }
  

  

  return (
    <>
      
     <CryptoPayModal
     apiKey={'YOUR_API_KEY'}
     productId={'YOUR_PROD_ID'}
     
     
     />
      
      {showButton && (
          <CryptoPay 
          onClick={getModal}
          label='Pay with Crypto'
          
          />
      )}
    
    </>
  )
}

export default App
