import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
  }
  return res;
}

export default function EKyc({ setToken }) {
  const [eKYCusername, seteKYCUserName] = useState();
  const [eKYCpassword, seteKYCPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    const canLoginRes = await canLogin(eKYCusername, eKYCpassword);
    // console.log(canLoginRes);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-4">Please Enter EKyc Creds</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            type="eKYCpassword"
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
  )
}

