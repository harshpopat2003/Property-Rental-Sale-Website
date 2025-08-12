import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useToken from '../../useToken';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
function decrypt(encryptedString) {
  let trimmedString = encryptedString.substring(4, encryptedString.length - 7);
  let left = trimmedString.substring(0,trimmedString.length - 3);
  let right = trimmedString.substring(3);
  const baseCharCode = 'A'.charCodeAt(0) - 1;
  let originalNumber = '';
  for (let i = 0; i < left.length; i++) {
    const letter = left[i];
    const letterCode = letter.charCodeAt(0);
    originalNumber += letterCode - baseCharCode-7;
  }
  for (let i = 0; i < right.length; i++) {
      const letter = right[i];
      const letterCode = letter.charCodeAt(0);
      originalNumber += letterCode - baseCharCode-11;
    }
  return originalNumber
}
export default function BuyProperty() {
  const { token, setToken } = useToken();

  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState();
  const [otpValidated, setOtpValidated] = useState(false);
  const { item, buyerId } = location.state;
  const [contract, setContract] = useState();
  const [buyerName, setBuyerName] = useState();
  const [sellerName, setSellerName] = useState();
  const [paymentDetails, setPaymentDetails] = useState(null);


  async function getContract() {
    const response = await fetch('https://192.168.2.241:5000/g'
      , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'token': token
        },
        body: JSON.stringify({
          'nameSeller': sellerName,
          'nameBuyer': buyerName,
          'PropName': item.type,
          'Address': item.address,
          'current_date': new Date().toISOString().slice(0, 10),
          'price': item.price
        })
      });
    const data = await response.json();
    // console.log(data);
    setContract(data.certificateBuyer);
    const response2 = await fetch('https://192.168.2.241:8081/addContract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'token': token
      },
      body: JSON.stringify({
        buyerId,
        sellerId: item.user_id,
        buyerContract: data.certificateBuyer,
        sellerContract: data.certificateSeller
      }),
    })
    const data2 = await response2.json();


  }
  async function sendOtp() {
    alert('OTP Sent');
    let datas = JSON.stringify({
      buyerId,
      sellerId: item.user_id
    });

    const response = await fetch('https://192.168.2.241:8081/buyingotp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'token': token
        },
        body: datas
      });
    const data = await response.json();
    // console.log(data);
    setOtp(decrypt(data.otp));
    setBuyerName(data.buyerName);
    setSellerName(data.sellerName);
  }
  const handleSubmitOtp = async e => {
    // console.log(otp);
    // console.log(e.target.elements.otp.value);
    e.preventDefault();
    if (otp === e.target.elements.otp.value) {
      setOtpValidated(true);
      getContract();
    }
    else {
      alert("Invalid OTP");
    }
  }
  const handlePurchase = async ({ property_id }) => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/purchaseProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenString,
      },
      body: JSON.stringify({ property_id, buyerId }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    if (data.message === 'error') {
      alert("Error");
    }
    else {
      alert("Property Purchased");
      navigate(-1);
    }

  };

  async function getRazorPayOrder() {
    const API_URL = 'https://192.168.2.241:8080/';
    const orderUrl = `${API_URL}order`;
    const response = await Axios.get(orderUrl);
    const { data } = response;
    const options = {
      key: 'rzp_test_vf7Ws52tICBBSE',
      name: "Your App Name",
      description: "Some Description",
      order_id: data.id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `${API_URL}capture/${paymentId}`;
          const captureResponse = await Axios.post(url, {})
          // console.log(captureResponse.data);
          setPaymentDetails(captureResponse.data);
        } catch (err) {
          console.log(err);
          setPaymentDetails(null);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <button
        onClick={() => sendOtp()}
        className="border p-2 rounded-md mt-4"
      >
        Send OTP
      </button>
      <h1 className="text-2xl font-bold mb-4">Buy</h1>
      <div key={item.property_id} className="border p-2 rounded-md">
        {Object.keys(item).map((key) => (
          <p key={key}>
            {key}: {item[key]}
          </p>
        ))}
      </div>
      {otpValidated ?
        (
          <div className="flex flex-col items-center justify-center ">
            {
              paymentDetails ?
                (
                  <button onClick={() => handlePurchase({ property_id: item.property_id })} className="border p-2 rounded-md mt-4"> Proceed </button>
                )
                :
                (
                  <button onClick={() => getRazorPayOrder()} className="border p-2 rounded-md mt-4"> Buy </button>
                )
            }
            <div className="border-2 border-black w-1/2 p-4 rounded-lg">
              <h2 className="text-lg font-bold">Copy your Contract:</h2>
              <pre className="overflow-auto">{contract}</pre>
            </div>
          </div>
        )
        :
        (<form onSubmit={handleSubmitOtp} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="otp" className="text-lg">
              Enter OTP sent to your email
            </label>
            <input
              type="text"
              id="otp"
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="border p-2 rounded-md mt-4"
          >
            Submit
          </button>
        </form>
        )
      }

    </div>
  )
}

