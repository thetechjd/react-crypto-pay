import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import cadetLogo from "./assets/cryptocadetlogo_white.png";
import Web3 from "web3";
import Web3Modal from "web3modal";
import EthereumProvider from "@walletconnect/ethereum-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import axios from "axios";
import WaveLoading from "./components/WaveLoading";

let modalInstance = null;

const endPoint = "http://localhost:3004"

const CryptoPayModal = ({
  requireWalletConnection = true,
  apiKey,
  style,
  productId,
}) => {
  const modalRef = useRef(null);

  const [payOptions, setPayOptions] = useState(
    requireWalletConnection ? false : true
  );
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState();
  const [showModal, setShowModal] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [user, setUser] = useState();
  const [network, setNetwork] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");
  const [refCode, setRefCode] = useState("");
  const [routerAddress, setRouterAddress] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("referrer")) {
      setRefCode(q.get("referrer"));
    }
  });

  const getUser = async () => {
    
    try {
      const response = await axios.post(
        `${endPoint}/api/user/get-key`,
        {
          apiKey,
        }
      );
      
      setUser(response.data);
    } catch (error) {
     
    }
  };

  const openModal = () => {
    getUser();
    const modalElement = modalRef.current;
    if (modalElement) {
      modalElement.style.display = "block";
    }
  };

  // Expose toggleModal function globally
  modalInstance = {
    openModal: () => openModal(),
  };

  const providerOptions = {
    walletconnect: {
      package: EthereumProvider, // required
      options: {
        rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5", // required
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "Ascendant.Finance", // Required
        rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5", // Optional if `infuraId` is provided; otherwise it's required

        darkMode: true, // Optional. Use dark theme, defaults to false
      },
    },
  };

  async function connectWallet() {
    setWaiting(true);

    try {
      let web3Modal = new Web3Modal({
        network: "mainnet", // optional
        theme: "dark",
        cacheProvider: false,

        providerOptions,
      });
      const web3ModalInstance = await web3Modal.connect();
      const provider = new Web3(web3ModalInstance);
      if (web3ModalInstance) {
        setProvider(provider);
        console.log(provider);

        const accounts = await provider.eth.getAccounts();
        const address = accounts[0];
        setWalletAddress(address);
        setPayOptions(true);
        setWaiting(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getNetwork = async (network) => {
    setMessage("")
    // Logic to pay in ETH
    // const response = await axios.get("http://localhost:3004/hello");
    // console.log(response.data);
    console.log(`Paying in ${network}`);
    setNetwork(network);

    try {
      const response = await axios.post(
        `${endPoint}/api/user/config`,
        {
          network,
        }
      );
      setRouterAddress(response.data);
    } catch (error) {
      setMessage("Invalid network.");

      setTimeout(() => {
        setNetwork("")}, 1000
      );
    }
  };

  const payWithToken = async (token) => {
    setWaiting(true);
    setMessage("");

    try {
      const price = user.products[productId];
      const tokenAddress = user.options[network][token];

      const router = await axios.post(
        `${endPoint}/api/user/options`,
        {
          network,
          token: routerAddress,
        }
      );

      const response = await axios.post(
        `${endPoint}/api/user/options`,
        {
          network,
          token: tokenAddress,
        }
      );

      const abi = JSON.parse(response.data);
      const routerAbi = JSON.parse(router.data);

      const tokenContract = await new provider.eth.Contract(abi, tokenAddress);
      const routerContract = await new provider.eth.Contract(
        routerAbi,
        routerAddress
      );

      const decimals = await tokenContract.methods
        .decimals(tokenAddress)
        .call();

      let qty = 0;
      if (quantity === 0) {
        qty = 1;
      } else {
        qty = quantity;
      }

      const total = price * qty;

      let amount = String(total * 10 ** Number(decimals));
      console.log(amount);
      setMessage("Awaiting approval...");
      await tokenContract.methods
        .approve(routerAddress, amount)
        .send({ from: walletAddress })
        .then(() => {
          setMessage("Sending transaction...");
        });

      const event = routerContract.events.TokenTransfer();

      // Build the transaction object
      const transactionObject = {
        from: walletAddress,
        to: routerAddress,
        value: "0x0", // For ERC-20 transfers, set value to 0
        gas: 150000,
        data: routerContract.methods
          .payWithToken(routerAddress, tokenAddress, amount)
          .encodeABI(),
      };

      let tx;

      // Send the transaction
      await provider.eth
        .sendTransaction(transactionObject)
        .on("transactionHash", (hash) => {
          tx = hash;

          setMessage("Awaiting confirmation...");
        })
        .on("confirmation", async (receipt) => {
          setWaiting(false);
        })
        .on("error", (error) => {
          console.error("Error:", error);
          setMessage("Something went wrong. Contact support.");
        });

      event.on("data", async function (event) {
        if (event.returnValues.received) {
          setMessage("Transaction successful!");
          await axios.post(`${endPoint}/api/user/send-email`, {
            email: user.email,
            tx,
            network,
            price: total,
            token,
          });

          await postReceipt(total, token);

          window.location.href = `${window.location.origin}?success=true&tx=${tx}`;
        } else {
          setMessage(
            "Something went wrong. Did you send from the correct network?"
          );
        }
      });
    } catch (error) {
      if (error.code == 4001) console.log("Transfer failed");
      // window.location.href = `${window.location.origin}?canceled=true`;
    }
  };
  const payWithTokenWithReferral = async (token) => {
    setWaiting(true);
    setMessage("");

    try {
      const referral = await axios.post(
        `${endPoint}/api/user/get-ref`,
        {
          apiKey,
          refCode,
        }
      );

      const referralAddress = referral.data.walletAddress;
      const refPercent = referral.data.percent;

      try {
        const price = user.products[productId];
        const tokenAddress = user.options[network][token];

        const router = await axios.post(
            `${endPoint}/api/user/options`,
          {
            network,
            token: routerAddress,
          }
        );

        const response = await axios.post(
            `${endPoint}/api/user/options`,
          {
            network,
            token: tokenAddress,
          }
        );

        const abi = JSON.parse(response.data);
        const routerAbi = JSON.parse(router.data);

        const tokenContract = await new provider.eth.Contract(
          abi,
          tokenAddress
        );
        const routerContract = await new provider.eth.Contract(
          routerAbi,
          routerAddress
        );

        const decimals = await tokenContract.methods
          .decimals(tokenAddress)
          .call();

        let qty = 0;
        if (quantity === 0) {
          qty = 1;
        } else {
          qty = quantity;
        }

        const total = price * qty;

        let amount = String(total * 10 ** Number(decimals));
        console.log(amount);
        setMessage("Awaiting approval...");
        await tokenContract.methods
          .approve(routerAddress, amount)
          .send({ from: walletAddress })
          .then(() => {
            setMessage("Sending transaction...");
          });

        const event = routerContract.events.TokenTransfer();

        // Build the transaction object
        const transactionObject = {
          from: walletAddress,
          to: routerAddress,
          value: "0x0", // For ERC-20 transfers, set value to 0
          gas: 150000,
          data: routerContract.methods
            .payWithToken(
              routerAddress,
              tokenAddress,
              amount,
              referralAddress,
              refPercent
            )
            .encodeABI(),
        };

        let tx;

        // Send the transaction
        await provider.eth
          .sendTransaction(transactionObject)
          .on("transactionHash", (hash) => {
            tx = hash;

            setMessage("Awaiting confirmation...");
          })
          .on("confirmation", async (receipt) => {
            setWaiting(false);
          })
          .on("error", (error) => {
            console.error("Error:", error);
            setMessage("Something went wrong. Contact support.");
          });

        event.on("data", async function (event) {
          if (event.returnValues.received) {
            setMessage("Transaction successful!");
            await axios.post(`${endPoint}/api/user/send-email`, {
              email: user.email,
              tx,
              network,
              price: total,
              token,
            });

            await postReceipt(total, token);

            window.location.href = `${window.location.origin}?success=true&tx=${tx}`;
          } else {
            setMessage(
              "Something went wrong. Did you send from the correct network?"
            );
          }
        });
      } catch (error) {
        if (error.code == 4001) console.log("Transfer failed");
        // window.location.href = `${window.location.origin}?canceled=true`;
      }
    } catch (error) {
      setMessage("Invalid referral code.");
      payWithToken(token);
    }
  };

  const payWithNative = async (token) => {
    setWaiting(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${endPoint}/api/user/price`,
        {
          network,
        }
      );

      const router = await axios.post(
        `${endPoint}/api/user/options`,
        {
          network,
          token: routerAddress,
        }
      );

      const abi = JSON.parse(router.data);

      const routerContract = await new provider.eth.Contract(
        abi,
        routerAddress
      );

      const price = user.products[productId];

      const rate = Number(response.data.ethusd);

      const conversion = price / rate;

      let qty = 0;
      if (quantity === 0) {
        qty = 1;
      } else {
        qty = quantity;
      }

      const total = conversion * qty;

      let amount = String(total * 10 ** 18);

      const event = routerContract.events.NativeTransfer();

      // Build the transaction object
      const transactionObject = {
        from: walletAddress,
        to: routerAddress,
        value: amount,
        gas: 150000,
        data: routerContract.methods
          .payWithNative(user.walletAddress)
          .encodeABI(),
      };

      let tx;

      // Send the transaction
      await provider.eth
        .sendTransaction(transactionObject)
        .on("transactionHash", (hash) => {
          tx = hash;
          console.log("Transaction Hash:", hash);
          setMessage("Awaiting confirmation...");
        })
        .on("confirmation", async (receipt) => {
          console.log("Receipt:", receipt);
          setWaiting(false);
        })

        .on("error", (error) => {
          console.error("Error:", error);
        });

      event.on("data", async function (event) {
        console.log(event.returnValues.received);

        if (event.returnValues.received) {
          setMessage("Transaction successful!");

          await axios.post(`${endPoint}/api/user/send-email`, {
            email: user.email,
            tx,
            network,
            price: total,
            token,
          });

          await postReceipt(total, token);

          window.location.href = `${window.location.origin}?success=true&tx=${tx}`;
        } else {
          console.log(
            "Something went wrong. Did you send from the correct network?"
          );
          setMessage(
            "Something went wrong. Did you send from the correct network?"
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const payWithNativeWithReferral = async (token) => {
    setWaiting(true);
    setMessage("");

    try {
      const referral = await axios.post(
        `${endPoint}/api/user/get-ref`,
        {
          apiKey,
          refCode,
        }
      );

      const referralAddress = referral.data.walletAddress;
      const refPercent = referral.data.percent;

      console.log(referralAddress);

      try {
        const response = await axios.post(
          `${endPoint}/api/user/price`,
          {
            network,
          }
        );

        const router = await axios.post(
          `${endPoint}/api/user/options`,
          {
            network,
            token: routerAddress,
          }
        );

        const abi = JSON.parse(router.data);

        const routerContract = await new provider.eth.Contract(
          abi,
          routerAddress
        );

        const price = user.products[productId];

        const rate = Number(response.data.ethusd);

        const conversion = price / rate;

        let qty = 0;
        if (quantity === 0) {
          qty = 1;
        } else {
          qty = quantity;
        }

        const total = conversion * qty;

        let amount = String(total * 10 ** 18);

        const event = routerContract.events.NativeTransfer();

        // Build the transaction object
        const transactionObject = {
          from: walletAddress,
          to: routerAddress,
          value: amount,
          gas: 150000,
          data: routerContract.methods
            .payWithNative(user.walletAddress, referralAddress, refPercent)
            .encodeABI(),
        };

        let tx;

        // Send the transaction
        await provider.eth
          .sendTransaction(transactionObject)
          .on("transactionHash", (hash) => {
            tx = hash;
            console.log("Transaction Hash:", hash);
            setMessage("Awaiting confirmation...");
          })
          .on("confirmation", async (receipt) => {
            console.log("Receipt:", receipt);
            setWaiting(false);
          })

          .on("error", (error) => {
            console.error("Error:", error);
          });

        event.on("data", async function (event) {
          console.log(event.returnValues.received);

          if (event.returnValues.received) {
            setMessage("Transaction successful!");

            await axios.post(`${endPoint}/api/user/send-email`, {
              email: user.email,
              tx,
              network,
              price: total,
              token,
            });

            await postReceipt(total, token);

            window.location.href = `${window.location.origin}?success=true&tx=${tx}`;
          } else {
            console.log(
              "Something went wrong. Did you send from the correct network?"
            );
            setMessage(
              "Something went wrong. Did you send from the correct network?"
            );
          }
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      setMessage("Invalid referral code.");
      payWithNative(token);
    }
  };

  const handlePayment = (key) => {
    if (
      user.options[network][key] == "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      if (refCode) {
        payWithNativeWithReferral(key);
      } else {
        payWithNative(key);
      }
    } else {
      if (refCode) {
        payWithTokenWithReferral(key);
      } else {
        payWithToken(key);
      }
    }
  };

  const postReceipt = async (total, token) => {
    try {
      const response = await axios.post(
        `${endPoint}/api/user/receipt`,
        {
          price: total,
          apiKey,
          type: token,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Default styles for the modal and buttons
  const defaultStyle = {
    modalContainer: {
      display: "none",
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
      width: "90%",
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
    <div ref={modalRef} style={defaultStyle.modalContainer}>
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
        {payOptions ? (
          <>
            {!network ? (
              <>
                {Array(
                  Object.keys(user.options).map((key) => {
                    return (
                      <button
                        key={key}
                        style={defaultStyle.button}
                        onClick={() => {
                          getNetwork(key);
                        }}
                      >
                        {key}
                      </button>
                    );
                  })
                )}
              </>
            ) : (
              <>
                {Array(
                  Object.keys(user.options[network]).map((key) => {
                    return (
                      <button
                        key={key}
                        style={defaultStyle.button}
                        onClick={() => {
                          handlePayment(key);
                        }}
                      >
                        {key}
                      </button>
                    );
                  })
                )}
                <input
                  type="number"
                  style={defaultStyle.inputField}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  value={quantity == 0 ? "" : quantity}
                  placeholder="     Quantity"
                />
                {message && <p>{message}</p>}
                {waiting && <WaveLoading color="#fff" />}
              </>
            )}
          </>
        ) : (
          <>
            {user && (
              <button style={defaultStyle.button} onClick={connectWallet}>
                Connect Wallet
              </button>
            )}

            {waiting && <WaveLoading color="#fff" />}
          </>
        )}
      </div>
    </div>
  );
};

CryptoPayModal.propTypes = {
  requireWalletConnection: PropTypes.bool,
  apiKey: PropTypes.string,
  style: PropTypes.object,
};

export default CryptoPayModal;

export const openModal = () => {
  if (modalInstance) {
    modalInstance.openModal();
  }
};
