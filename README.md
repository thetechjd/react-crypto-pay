# React-Crypto-Pay


React-Crypto-Pay is an api for evm-chain crypto payment integration.

## Features

- Accept payments across multiple EVM networks
- Accept any token you want
- Integrates with Web3Modal
- Create affiliate codes for your own referral program

## Installation

React-Crypto-Pay requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install @cryptocadet/react-crypto-pay @coinbase/wallet-sdk @walletconnect/ethereum-provider axios react react-dom styled-components web3modal 
```

## NextJS

In order to install for NextJS, the CryptoPay Modal must be imported dynamically:

```sh
npm install @cryptocadet/react-crypto-pay @coinbase/wallet-sdk @walletconnect/ethereum-provider axios react react-dom styled-components web3modal
```

Create a components folder within your app or src folder, and create a new file.

```sh
import {CryptoPayModal} from 'react-crypto-pay'
const ComponentName = () => {

    return (

        <CryptoPayModal
        apiKey={'YOUR_API_KEY'}
        productId={'YOUR_PROD_ID'}
        requireWalletConnection={true}
        label="BUTTON TITLE"
      /> 

    )
}

export default ComponentName;
```

In your page or index file, dynamically import the created component:

```sh
export default function Home() {

  const ComponentName = dynamic(() => import("./../components/ComponentName"), { ssr: false });

  return (
    <ComponentName />
  )
```

## Styles

React Crypto Pay Modal style can be customized by targeting the cryptopaymodal and cryptopaybutton classes and the style tag in JSX. Web3Modal styles can be imported by adding the following in the component file:

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



