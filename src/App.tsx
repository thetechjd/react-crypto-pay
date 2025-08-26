import CryptoPayButton from './components/CryptoPayButton/CryptoPayButton'
import './App.css'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    const handleMessage = async (event:any) => {

     
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
     apiKey={'pk_H0q1poCP0iOWzsWq270wLcaxvLckUhnW'}
     productId={'sometestid0'}
     displayName={'Chessboard'}
     email='required'
     shippingAddress={null}
     label='Pay with Crypto'
     style={null}
     cartStyle={null}
     lang='en'
     eth={true}
     sol="true"
     redirect='http://localhost:5173'
     onSuccess={doSomething}
     shoppingCart={false}
     noQuantity={true}
     priceOnly={true}
     
     
     
     />
    
      
     
     </>
    
    
  )
}

export default App
