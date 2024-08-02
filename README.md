# React-Crypto-Pay


React-Crypto-Pay is an api for evm-chain and Solana crypto payment integration.

## Updates

React-Crypto-Pay v4.0.0 now has the following additional features!

- DisplayName property so buyers can easily recognize what they purchased
- onSuccess method added for post-transaction actions such as automatic downloads and mints
- shoppingcart for multiple items
- noQuantity flag for one-off purchases
- API available
- SUSDT test environment token available for Solana Devnet testing
- Phantom wallet support added

## Features

- Accept payments across multiple EVM networks and Solana
- Accept any token you want
- Integrates with Web3Modal
- Create affiliate codes for your own referral program

## Installation

React-Crypto-Pay requires [Node.js](https://nodejs.org/) v17+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install @cryptocadet/react-crypto-pay 
```

## NextJS

In order to install for NextJS, the CryptoPay Modal must be imported dynamically:

```sh
npm install @cryptocadet/react-crypto-pay 
```

Create a components folder within your app or src folder, and create a new file.

```sh
import {CryptoPayModal} from 'react-crypto-pay'
const ComponentName = () => {

    return (

         <CryptoPayButton
     apiKey={'YOUR_API_KEY'}
     productId={'YOUR_PRODUCT_ID'}
     displayName={'ITEM_DISPLAY_NAME'}
     email='required'
     shippingAddress='required'
     label='BUTTON TITLE'
     style={null}
     cartStyle={null}
     lang='en'
     eth='false'
     sol='true'
     redirect='http://localhost:5173'
     onSuccess={doSomething}
     shoppingCart='false'
     noQuantity='true'
     
      /> 

    )
}


export default ComponentName;
```

The pay portal defaults to `eth` but you can set this to false. In order to add Solana, `sol` should be set to 'true'.

The `email` and `shippingAddress` variables can be required in order to request the user's email and shipping address upon payment. Styles can be input via the style variable to change the button style. The lang property corresponds to the ISO 639-1 Code for the following supported languages:

- ar (Arabic)
- de (German)
- en (English)
- es (Spanish)
- fr (French)
- pt (Portuguese)
- zh (Chinese)

The `onSuccess` property determines what happens after a transaction is successfully completed. For instance, it can trigger a download or a mint, or some other action. The `redirect` property can be used to redirect the user after a successful transaction.

`shoppingCart` when set true enables a shopping cart button that appears alongside the main button. Multiple items can be added to the cart before a final sale is made. `noQuantity` property is for one-off sales that don't need to ask the buyer for a quantity, because they can only purchase one at a time, or the item being purchases is unique. If the 'noQuantity' property is set to `true` then the shoppingCart property should be set to false, and vice-versa. 




In your page or index file, dynamically import the created component:

```sh
export default function Home() {

  const ComponentName = dynamic(() => import("./../components/ComponentName"), { ssr: false });

  return (
    <ComponentName />
  )
```

## Styles

React Crypto Pay Button style can be customized by targeting the cryptopaymodal and cryptopaybutton classes and the style tag in JSX. Web3Modal styles can be imported by adding the following in the component file:

```sh
import 'react-crypto-pay/dist/style.css'
```


## License 

MIT

## Contributions

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer



