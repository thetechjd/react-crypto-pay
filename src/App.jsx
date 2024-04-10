import CryptoPayButton from './components/CryptoPayButton/CryptoPayButton'
import './App.css'

function App() {
  
  

  return (
   
      
     <CryptoPayButton
     apiKey={'YOUR_API_KEY'}
     productId={'YOUR_PRODUCT_ID'}
     email='required'
     shippingAddress='required'
     label='Pay with Crypto'
     style={null}
     lang='en'
     
     
     />
      
     
    
    
  )
}

export default App
