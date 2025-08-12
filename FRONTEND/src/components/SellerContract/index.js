import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import useToken from '../../useToken';



export default function SellerContract() {

  const { token, setToken } = useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(null);
  const { item } = location.state;

  const getContracts = async ({ property_id }) => {
    try {
      const tokenString=JSON.stringify({token});
      const response = await fetch('https://192.168.2.241:8081/sellProperty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token':tokenString,
        },
        body: JSON.stringify({ property_id }),
      });
      // console.log(response);
      const data = await response.json();
      // console.log(JSON.stringify(data));
      setContracts(data);
    }
    catch (error) {
      alert('Error');
    }

  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-4">Get Contract</h1>
      <button
        onClick={() => getContracts({ property_id: item.user_id })}
        className="border p-2 rounded-md mt-4"
      >
        Get
      </button>
      {contracts && (
        contracts.map((contract) => (
          <div className="border-2 border-black w-1/2 p-4 rounded-lg">
            <h2 className="text-lg font-bold">Copy your Contract:</h2>
            <pre className="overflow-auto">{contract.contract}</pre>
          </div>
        ))
      )
      }
    </div>
  )
}

