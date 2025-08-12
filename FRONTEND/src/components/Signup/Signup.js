import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
export default function SignUp({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [email, setEmail] = useState();
  const [btype, setBtype] = useState('buyer');
  const [otp, setOtp] = useState();
  const [eKycVerified, setEKycVerified] = useState(false);
  const [eKYCusername, seteKYCUserName] = useState();
  const [eKYCpassword, seteKYCPassword] = useState();
  
  async function canLogin(eKYCusername, eKYCpassword) {
    const credentials = { username: eKYCusername, password: eKYCpassword };
    const response = await fetch('https://192.168.2.241:8080/kyc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    // console.log(response);
    if (response.ok) {
      console.log('Request was made successfully.');
    } else {
      console.log('Request was not made successfully.');
    }

    const res = await response.json();
    // console.log(res);
    //if res length is 0, then false
    if (res.message === "Login successful") {
      alert("EKYC successful");
      setEKycVerified(true);
    }
    return res;
  }

  const handleSubmitKYC = async e => {
    e.preventDefault();
    const canLoginRes = await canLogin(eKYCusername, eKYCpassword);
    // console.log(canLoginRes);
  }
  
  async function sendOtp() {
    let datas = JSON.stringify({
      email: email,
    });

    const response = await fetch('https://192.168.2.241:5000/otp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: datas
      });
    // console.log(response);
    const data = await response.json();
    setOtp(decrypt(data.otp));
    // console.log(JSON.stringify(data));
  }

  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    // console.log(username, password, name, dateOfBirth, btype);
    sendOtp();
  }

  const handleSubmitOtp = async e => {
    e.preventDefault();
    if (otp === e.target.elements.otp.value) {
      navigate('/aadhar', { state: { username, password, name, dateOfBirth, btype, email } });
    }
    else {
      alert("Invalid OTP");
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      {!eKycVerified ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Please Enter EKyc Creds</h1>
          <form onSubmit={handleSubmitKYC} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="eKYCusername" className="text-lg">
                eKYCUsername
              </label>
              <input
                type="text"
                id="eKYCusername"
                onChange={(e) => seteKYCUserName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="eKYCpassword" className="text-lg">
                eKYCPassword
              </label>
              <input
                type="password"
                id="eKYCpassword"
                onChange={(e) => seteKYCPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-lg">
                Username
              </label>
              <input
                type="text"
                id="username"
                onChange={(e) => setUserName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="text-lg">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="type" className="text-lg">
                Type
              </label>
              <select
                id="type"
                onChange={(e) => {
                  setBtype(e.target.value);
                }}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Submit
              </button>
            </div>
          </form>
          {
            otp && (
              <form onSubmit={handleSubmitOtp} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="otp" className="text-lg">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Submit OTP
                  </button>
                </div>
              </form>
            )

          }
        </div >)
      }
    </div >
  )
}

