import React from 'react';
import { useState, useEffect } from 'react';
import useToken from '../../useToken';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BuyerDashboard() {
  const { token, setToken } = useToken();

  const location = useLocation();
  const navigate = useNavigate();

  const { id, btype } = location.state;

  const [file, setFile] = useState(null);
  const [propId, setPropId] = useState(null);
  const [propAddress, setPropAddress] = useState(null);

  useEffect(() => {
    if (btype !== 'buyer') {
      navigate('/login');
    }
  }, [navigate]);

  const getAllproperties = async () => {
    let id = 42;
    // console.log("Hi")
    // console.log("howdy");
    const tokenString=JSON.stringify({token});
    // console.log("TokenString",tokenString);
    const response = await fetch('https://192.168.2.241:8081/getAllProperties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'token':tokenString ,
      },
      body: JSON.stringify({ id }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    setFile(data);
  }


  const filterProperty = async ({ type, price }) => {
    if (price === '') {
      price = 0;
    }
    const tokenString=JSON.stringify({token});

    const response = await fetch('https://192.168.2.241:8081/filterProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token':tokenString,
      },
      body: JSON.stringify({ type, price }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    setFile(data);
  }

  const getBoughtProperties = async () => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/buyerBoughtProperties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token':tokenString,
      },
      body: JSON.stringify({ id }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    setFile(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">
      <button
        onClick={() => navigate('/v')}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >Verify Certificate</button>
      <h2 className="text-2xl font-bold mb-4">BuyerDashboard {id}</h2>
      <button
        onClick={() => getAllproperties()}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Get All Properties
      </button>
      <button
        onClick={() => getBoughtProperties()}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
      >
        Get Bought Properties
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const type = e.target.type.value;
          const price = e.target.price.value;
          filterProperty({ type, price });
        }
        }
      >
        <div className="flex flex-col items-center justify-center">
          <select
            name="type"
            id="type"
            className="border-2 border-gray-500 rounded-md p-2 m-2"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
          </select>
          <input
            type="number"
            name="price"
            id="price"
            className="border-2 border-gray-500 rounded-md p-2 m-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Filter Property
          </button>
        </div>
      </form>


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
                  {item.status === 'available' && (
                    <button
                      className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
                      onClick={() => {
                        setPropId(item.property_id);
                        setPropAddress(item.address);
                        navigate('/b/buy', { state: { item, buyerId: id } });
                      }}
                    >
                      Buy Property
                    </button>
                  )}
                </div>
              ))}
            </div>

          </>
        )}
      </div>
    </div>

  );
}