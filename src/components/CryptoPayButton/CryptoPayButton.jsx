import { useState, useEffect, useRef } from "react";
import cadetLogo from "../../assets/cryptocadetlogo_white.png";
import metamaskLogo from "../../assets/MetaMask_Fox.png";
import coinbaseLogo from "../../assets/coinbase_icon.png";
import phantomLogo from "../../assets/phantom-logo.png";
import "./../../index.css";

const CryptoPayButton = ({
  apiKey,
  style,
  cartStyle,
  productId,
  displayName,
  email=null,
  shippingAddress=null,
  label,
  lang='en',
  eth=true,
  sol,
  redirect,
  onSuccess,
  shoppingCart,
  noQuantity,
  priceOnly,
}) => {
  
  
  const [showModal, setShowModal] = useState(false);
  const [refCode, setRefCode] = useState("")
  const [checkout, setCheckout] = useState(false)
  

  const endPoint = "https://api.cryptocadet.app";
  //const endPoint = "http://localhost:3004";
  const portal = "http://localhost:5174"
  //const portal = "https://portal.cryptocadet.app"

  const wrapperRef = useRef(null);


  useEffect(() => {
      function handleClickOutside(event) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
              setShowModal(false);
              console.log("Modal closed")
          }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [wrapperRef]);


  const translation = {
    "en": "Open",
    "fr": "Ouvrir",
    "ar": "افتح",
    "es": "Abrir",
    "pt": "Abrir",
    "de": "Öffnen",
    "zh": "打开"
  }




  function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
  }


  const handleDevice = async () => {

    let refCode = "";

    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      if (q.get("referrer")){
       refCode = q.get("referrer");
       setRefCode(refCode)
      }
      
    }

    if(!localStorage.getItem(`${apiKey}-cart`)){
      addItemToLocalStorageArray(`${apiKey}-cart`, {displayName: displayName, productId: productId})
    }

    if (isMobileDevice()) {
      console.log("You are using a mobile device.");
      setShowModal(true)
     
  
    } else {
      console.log("You are not using a mobile device.");
      openPortal(refCode);
      
      
     
    }

  }

  const openPortal = async (refCode) => {
    // where the user should come back to (current page)
    const returnUrl = window.location.href; // includes current path + query
  
    const apiUrl = `${endPoint}/api/user/checkout`;
    const data = { apiKey };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        // handle error state however you want
        console.error("Checkout init failed");
        return;
      }
  
      const cart = localStorage.getItem(`${apiKey}-cart`);
      const prodParam = cart ? cart : JSON.stringify({ productId });
  
      const portalUrl = new URL(portal);
      portalUrl.searchParams.set("pubKey", apiKey);
      portalUrl.searchParams.set("prod", prodParam);
      portalUrl.searchParams.set("referrer", refCode ?? "");
      portalUrl.searchParams.set("email", email ?? "");
      portalUrl.searchParams.set("shippingAddress", shippingAddress ?? "");
      portalUrl.searchParams.set("lang", lang ?? "");
      portalUrl.searchParams.set("eth", String(eth ?? ""));
      portalUrl.searchParams.set("sol", String(sol ?? ""));
      portalUrl.searchParams.set("shoppingCart", cart ? "true" : "false");
      portalUrl.searchParams.set("noQuantity", String(!!noQuantity));
      portalUrl.searchParams.set("priceOnly", String(!!priceOnly));
  
      // Stripe-style: single return URL that you will append success/cancel to
      portalUrl.searchParams.set("return_url", returnUrl);
  
      // (optional) clear cart before leaving
      localStorage.removeItem(`${apiKey}-cart`);
  
      // redirect same tab
      window.location.assign(portalUrl.toString());
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

             // Listener setup
    const handleMessage = (event) => {
      if (event.data === "Receipt added successfully") {  // Replace with the actual origin of your portal
          console.log("Received message:", event.data);
          // Handle the message here
          console.log("we did it!")
          if(onSuccess){
            try {
              onSuccess();
            } catch(err) {
              console.log('Could not complete success function')
            }
          }
      }
  };

  const phantomConnect = async () => {
 
    
    const queryParams = new URLSearchParams({
      pubKey: apiKey,
      prod: productId,
      email: email,
      shippingAddress: shippingAddress,
      lang: lang,
      shoppingCart: localStorage.getItem(`${apiKey}-cart`) ? true : false ,
      noQuantity: noQuantity,
      walletApp: true,
      priceOnly: priceOnly,
      ref: "https://cryptocadet.io"

    });
    
   
    const encodedUrl = encodeURIComponent(`https://portal.cryptocadet.app?${queryParams.toString()}`);
  
    const url = `https://phantom.app/ul/browse/${encodedUrl}`;
   window.location.href = url;
  };


  const goToCoinbase = async () => {
    const url = `https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fportal.cryptocadet.app%3FpubKey%3D${apiKey}%26prod%3D${localStorage.getItem(`${apiKey}-cart`) ? localStorage.getItem(`${apiKey}-cart`) : productId}%26referrer%3D${refCode}%26email%3D${email}%26shippingAddress%3D${shippingAddress}%26lang%3D${lang}%26shoppingCart%3D${localStorage.getItem(`${apiKey}-cart`) ? true : false}%26noQuantity%3D${noQuantity}%26priceOnly%3D${priceOnly}%26walletApp%3D${true}`;
    localStorage.removeItem(`${apiKey}-cart`)
    window.location.href = url;
  }
  const goToMetamask = async () => {
    const url = `https://metamask.app.link/dapp/portal.cryptocadet.app?pubKey=${apiKey}&prod=${localStorage.getItem(`${apiKey}-cart`) ? localStorage.getItem(`${apiKey}-cart`) : productId}&referrer=${refCode}&email=${email}&shippingAddress=${shippingAddress}&lang=${lang}&shoppingCart=${localStorage.getItem(`${apiKey}-cart`) ? true : false}&noQuantity=${noQuantity}&priceOnly=${priceOnly}&walletApp=true`;
    localStorage.removeItem(`${apiKey}-cart`)
    window.location.href = url;
  }

  function addItemToLocalStorageArray(key, item) {
    // Retrieve the existing array from local storage
    let existingItems = localStorage.getItem(key);


    // If no existing array exists, create a new one, otherwise convert the string to an array
    let itemsArray = existingItems ? JSON.parse(existingItems) : [];

    // Add new item to the array
    itemsArray.push(item);

    // Serialize the array back to a string and store it in local storage
    localStorage.setItem(key, JSON.stringify(itemsArray));

    console.log(itemsArray)
}




  

 


  const defaultButtonStyle = {
    // Define default styles here
    padding: "10px 20px",
    backgroundColor: "#0c0a09",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };
  const defaultCartStyle = {
    // Define default styles here
    padding: "9px 18px",
    backgroundColor: "#0c0a09",
    color: "#fff",
    marginLeft: '2px',
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };
  
  // Default styles for the modal and buttons
  const defaultStyle = {
    modalContainer: {
      display: "block",
      ...style,
    },
    modalContent: {
      background: "#1c1917",
      borderRadius: "8px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      color: "#fff",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#0c0a09",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      
    },
    inputField: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#0c0a09",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textAlign: "center",
    },
  };

  return (
    <>
       {!showModal ? ( 
        <div style={{display: "flex", flexDirection: "column"}}>
        <span>
      <button
        onClick={handleDevice}
        style={{ ...defaultButtonStyle, ...style }} 
      >
        {label}
      </button>
      {shoppingCart && (
      <button
      onMouseEnter={() => { setCheckout(true); }}
onMouseLeave={() => { 
    setTimeout(() => { setCheckout(false); }, 3000);console.log("Timeout executed.")}}
      onClick={()=> {addItemToLocalStorageArray(`${apiKey}-cart`, {displayName: displayName, productId: productId})}}
      style={{...defaultCartStyle, ...cartStyle}}
      data-testid="cart-button"
      >
       &#128722;
      </button>


       )} 
      </span>

       </div>
       ) : (
        <div ref={wrapperRef} style={defaultStyle.modalContainer} data-testid="modal">
          <div style={defaultStyle.modalContent}>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={cadetLogo} style={{ height: "48px" }} />
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                cryptocadet&trade;
              </h2>
            </span>
            
                <button onClick={goToMetamask} style={defaultStyle.button} >
                    <span style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent:"center"
                
              }}><img src={metamaskLogo} style={{ height: "24px", marginRight: "10px" }} />{translation[lang]} Metamask</span>
                  </button>
                  <button onClick={goToCoinbase} style={defaultStyle.button}>
                  <span style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent:"center"
                
                
              }}><img src={coinbaseLogo} style={{ height: "24px", marginRight: "10px" }} />{translation[lang]} CoinBase</span>
                  </button>
                  <button onClick={phantomConnect} style={defaultStyle.button}>
                  <span style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent:"center"
                
                
              }}><img src={phantomLogo} style={{ height: "24px",marginRight: "10px" }} />{translation[lang]} Phantom</span>
                  </button>
                       
          </div>
        </div>
                )} 
    </>
  );
};

export default CryptoPayButton;
