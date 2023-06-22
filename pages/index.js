import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { ethers } from "ethers";
import paymentGateway from "../src/artifacts/contracts/PaymentGateway.sol/PaymentGateway.json";
import { useAccount } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0xf381Aa45048268DF6ac5851f920352B20b3064A3";

function index() {
  const { address } = useAccount();
  const walletAddress = address;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const getContract = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        throw new Error("Metamask is not installed, please install!");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const network = await provider.getNetwork();
      const { chainId } = network;

      console.log("switch case for this case is: " + chainId);

      if (chainId === 80001) {
        const contract = new ethers.Contract(
          contractAddress,
          paymentGateway.abi,
          signer
        );
        return contract;
      } else {
        throw new Error("Please connect to the BTTC Network!");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const depositBtn = async () => {
    try {
      setLoading(true);

      const contract = await getContract();
      const valueInEth = 0.1;
      const valueInWei = ethers.utils.parseEther(valueInEth.toString());

      const tx = await contract.deposit({
        value: valueInWei,
      });

      await tx.wait();

      console.log(tx);
      const transactionReceiptLink = `https://mumbai.polygonscan.com/tx/${tx.hash}`;

      const data = JSON.stringify({
        to: email,
        subject: "Your Transaction is successfully completed on this date",
        transactionAmount: "0.1",
        transactionReceiptLink: transactionReceiptLink,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://paymentgatewaymatic.vercel.app/api/sendemail",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios.request(config);

      toast.success("Payment successful!"); // Display success toast
    } catch (error) {
      console.log(error);
      toast.error("Payment failed!"); // Display error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className="flex justify-center items-center h-screen w-screen">
     
        {" "}
        <div className="w-70 pr-6 mr-4">
          {" "}
          {/* Added "mr-4" class for right margin */}
          <h2 className="text-3xl font-semibold text-gray-100 mb-4 text-black">
            Welcome!
          </h2>
          <ConnectKitButton />
          <p className="text-gray-500 mb-6">Connect wallet to pay.</p>
        </div>
        <div className="w-30">
          <div className="bg-gray-900 p-10 rounded-3xl shadow-xl">
            <h3 className="font-semibold text-2xl text-gray-100 mb-6">
              Pay Now!
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <select
                  className="text-sm text-gray-200 px-4 py-3 rounded-lg w-full bg-gray-900 border border-gray-700 focus:outline-none focus:border-purple-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select network
                  </option>
                  <option value="polygon">Polygon</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className="text-sm text-gray-200 px-4 py-3 rounded-lg w-full bg-gray-900 border border-gray-700 focus:outline-none focus:border-purple-400"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select tokens
                  </option>
                  <option value="matic">MATIC</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-400 text-white"
                  type="email"
                  placeholder="Email"
                  value={email} // Bind email state to the input value
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />
              </div>
              <button
                className="w-full px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold focus:outline-none"
                onClick={depositBtn}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default index;
