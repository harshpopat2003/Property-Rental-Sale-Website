import React from 'react';
import { useState } from 'react';
import useToken from '../../useToken';

import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { token, setToken } = useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const { id, btype } = location.state;

  const [file, setFile] = useState(null);
  const [propId, setPropId] = useState(null);
  const [propAddress, setPropAddress] = useState(null);

  const getUserProperties = async ({ id }) => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/getProperties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenString,
      },
      body: JSON.stringify({ id }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    setFile(data);
  }

  const updateUserProperties = async ({ id, name, value }) => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/updateProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenString,
      },
      body: JSON.stringify({ id, name, value }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    setFile(data);
  }

  const deleteUserProperties = async ({ property_id }) => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/deleteProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenString,
      },
      body: JSON.stringify({ property_id }),
    });

    if (response.ok) {
      console.log('Request was made successfully.');
    }
    else {
      console.log('Request was not made successfully.');
      alert("Some error occured");
      return;
    }

    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    alert("Property Deleted");

    return data;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">
      <button
        onClick={() => navigate('/v')}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >Verify Certificate</button>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={() => getUserProperties({ id })}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Get User Properties
      </button>
      <button
        className='bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300'
        onClick={() => navigate('/d/ap', { state: { id } })}
      >
        Add Property
      </button>
      <div>
        {file && (
          <>
            <div className="mt-4 space-y-2 overflow-y-scroll h-96">
              {file.map((item) => (
                <div key={item.property_id} className="border p-2 rounded-md">
                  {Object.keys(item).map((key) => (
                    <p key={key}>
                      {key}: {item[key]}
                    </p>
                  ))}
                  <button
                    onClick={() => deleteUserProperties({ property_id: item.property_id })}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                  >
                    Delete Property
                  </button>
                  {
                    item.status === 'purchased' ? (
                      <button
                        onClick={() => navigate('/sellerContract', { state: { item } })}
                        className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                      >
                        Sign Contract
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('./update', { state: { property_id: item.property_id, id } })}
                        className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                      >
                        Update Docs
                      </button>
                    )
                  }
                </div>
              ))}
            </div>

            <div className="flex flex-col mt-4">
              <label htmlFor="property_id" className="text-lg">
                Property ID
              </label>
              <input
                type="text"
                id="property_id"
                onChange={(e) => setPropId(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
              <label htmlFor="address" className="text-lg">
                Address
              </label>
              <input
                type="text"
                id="address"
                onChange={(e) => setPropAddress(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={() =>
                  // updateUserProperties({ id: '1', name: 'address', value: '123 Main St' })
                  updateUserProperties({ id: propId, name: 'address', value: propAddress })
                }
                className="bg-purple-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
              >
                Update User Properties
              </button>
            </div>


          </>
        )}
      </div>
    </div>

  );
}