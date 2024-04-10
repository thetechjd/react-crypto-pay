import { useState, useEffect, useRef } from "react";
import cadetLogo from "../../assets/cryptocadetlogo_white.png";
import metamaskLogo from "../../assets/MetaMask_Fox.png";
import coinbaseLogo from "../../assets/coinbase_icon.png";
import "./../../index.css";

const CryptoPayButton = ({
  apiKey,
  style,
  productId,
  email=null,
  shippingAddress=null,
  label,
  lang='en'
}) => {
  
  const [showModal, setShowModal] = useState(false);
  const [refCode, setRefCode] = useState("")
  

  const endPoint = "https://api.cryptocadet.app";
  //const endPoint = "http://localhost:3004";

  const wrapperRef = useRef(null);


  useEffect(() => {
      function handleClickOutside(event) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
              setShowModal(false);
             
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

    if (isMobileDevice()) {
      console.log("You are using a mobile device.");
      setShowModal(true)
     
  
    } else {
      console.log("You are not using a mobile device.");
      openPortal(refCode);
      
      
     
    }

  }

  const openPortal = async (refCode) => {

   
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
    width=400,height=500,left=${window.screen.width},top=0`;
    const newWindow = window.open("", "_blank", params);


    // Define your API URL and the data you want to send
    const apiUrl = `${endPoint}/api/user/get-user`;
    const data = {
      apiKey,
    };

    try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      

      if (response.ok) {
          const newUrl = `https://portal.cryptocadet.app?pubKey=${apiKey}&prod=${productId}&referrer=${refCode}&email=${email}&shippingAddress=${shippingAddress}&lang=${lang}`;
          console.log('Navigating to:', newUrl);
          newWindow.location = newUrl;
      } else {
          console.log('Closing window due to unsuccessful response');
          newWindow.close();
      }
  } catch (error) {
      console.error('Error:', error);
      console.log('Closing window due to error');
      newWindow.close();
  }
  };

 


  const defaultButtonStyle = {
    // Define default styles here
    padding: "10px 20px",
    backgroundColor: "#0c0a09",
    color: "#fff",
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
      <button
        onClick={handleDevice}
        style={{ ...defaultButtonStyle, ...style }} 
      >
        {label}
      </button>
       ) : (
        <div ref={wrapperRef} style={defaultStyle.modalContainer}>
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
            
                 <a href={`https://metamask.app.link/dapp/portal.cryptocadet.app?pubKey=${apiKey}&prod=${productId}&referrer=${refCode}&email=${email}&shippingAddress=${shippingAddress}&lang=${lang}`}><button style={defaultStyle.button} >
                    <span style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}><img src={metamaskLogo} style={{ height: "24px" }} />{translation[lang]} Metamask</span>
                  </button></a>
                  <a href={`https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fportal.cryptocadet.app%3FpubKey%3D${apiKey}%26prod%3D${productId}%26referrer%3D${refCode}%26email%3D${email}%26shippingAddress%3D${shippingAddress}%26lang%3D${lang}`}> <button style={defaultStyle.button}>
                  <span style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
                
              }}><img src={coinbaseLogo} style={{ height: "24px" }} />{translation[lang]} Coinbase Wallet</span>
                  </button></a>
                  
              

              
             
          
          </div>
        </div>
                )} 
    </>
  );
};

export default CryptoPayButton;
