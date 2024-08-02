import CryptoPayButton from './components/CryptoPayButton/CryptoPayButton'
import './App.css'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    const handleMessage = async (event) => {

     
      let response =  event.data;
     

      if (response) {
        response = String(response);
       /*  try {
          response = JSON.parse(response);
          console.log(response)
          
         
          if (response.message == "Receipt added successfully") {
            console.log("Listener worked!")
          }
         
          
            
        } catch (err) {}
         */
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

useEffect(() => {
  console.log('making sure it logs')
}, [])
  

  const doSomething = () => {
    console.log('did something')
  }
  

  return (
   <>
      
     <CryptoPayButton
     apiKey={'yourapikey'}
     productId={'sometestid0'}
     displayName={'Chessboard'}
     email='required'
     shippingAddress={null}
     label='Pay with Crypto'
     style={null}
     cartStyle={null}
     lang='en'
     eth='true'
     sol="true"
     redirect='http://localhost:5173'
     onSuccess={doSomething}
     shoppingCart={false}
     noQuantity={true}
     
     
     
     />
    
      
     
     </>
    
    
  )
}

export default App
