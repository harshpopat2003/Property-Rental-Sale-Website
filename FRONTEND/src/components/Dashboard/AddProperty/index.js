import React from 'react';
import { useState } from 'react';
import useToken from '../../../useToken';

import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function AddProperty() {
  const { token, setToken } = useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const { id, btype } = location.state;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(id);
  const [fileUploaded, setFileUploaded] = useState(false);

  //generate random number from 1000 to 9999
  const genRan = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5 MB');
      return;
    }
    setFile(file);
    setFileName(id+"_"+genRan()+"_"+e.target.files[0].name);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', fileName);
      // console.log(fileName);
      setFile(null);
      try {
        await axios.post('https://192.168.2.241:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('File uploaded successfully');
      } catch (error) {
        alert('Error uploading file');
        setFileUploaded(false);
      }
      setFileUploaded(true);
    } else {
      alert('Please select a file');
      setFileUploaded(false);
    }
  };

  const handleAddProperty = async ({ address, type, price }) => {
    const tokenString=JSON.stringify({token});

    const response = await fetch('https://192.168.2.241:8081/addProperty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': tokenString,
      },
      body: JSON.stringify({ user_id: id, address, type, price, fileName }),
    });
    // console.log(response);
    const data = await response.json();
    // console.log(JSON.stringify(data));
    if (data.message === "success") {
      alert("Property added successfully");
      navigate('/d', { state: { id, btype } });
    }
    else {
      alert("Some error occured");
    }

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">

      <h2 className="text-2xl font-bold mb-4">Add Property</h2>
      {
        !fileUploaded ?
          (
            <>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="border-2 border-gray-500 rounded-md p-2 m-2"
              />
              <button
                onClick={() => handleUpload()}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              >
                Upload PDF
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const address = e.target.address.value;
                const type = e.target.type.value;
                const price = e.target.price.value;
                handleAddProperty({ address, type, price });
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="border-2 border-gray-500 rounded-md p-2 m-2"
                />
                <label htmlFor="type">Type</label>
                <select
                  name="type"
                  id="type"
                  className="border-2 border-gray-500 rounded-md p-2 m-2"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                </select>
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  className="border-2 border-gray-500 rounded-md p-2 m-2"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                >
                  Add Property
                </button>
              </div>
            </form>
          )}
    </div>

  );
}