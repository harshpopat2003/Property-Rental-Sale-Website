import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Aadhar() {

  const location = useLocation();
  const navigate = useNavigate();
  const { username, password, name, dateOfBirth, btype, email } = location.state;


  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);

  const handleFileChange = (event) => {
    // setFile(event.target.files[0]);
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5 MB');
      return;
    }
    setFile(file);
  };

  const handleSubmit = async (event) => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    // console.log(username, password, name, dateOfBirth, btype);
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    

    try {
      const response = await axios.post('https://192.168.2.241:5000/process_image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const apiName = response.data.name;
      const apiDob = response.data.dob;
      // console.log(apiName, apiDob);
      // console.log(name, dateOfBirth);
      if (apiName === name && apiDob === String(dateOfBirth)) {
        setResult('Valid');
      } else {
        setResult('inValid');
      }
      setErrorFlag(false)
    } catch (error) {
      setErrorFlag(true)
      console.error('Error processing image:', error);
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">

      <h1 className="text-2xl font-bold mb-4">Aadhaar Card Verification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Submit for Verification
        </button>
      </form>
      <div>
        {result && !errorFlag && (
          <div className="mt-4 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">Your Aadhaar is: {result}</h2>
            {
              result == "Valid"
                ?
                <button
                  onClick={() => { navigate('/ContractCreation', { state: { username, password, name, dateOfBirth, btype , email} }) }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                  Proceed
                </button>
                :
                <button
                  onClick={() => { window.location.href = "/signup" }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                  Go Back
                </button>
            }
          </div>
        )}
        {errorFlag && (
          <div className="mt-4">
            <h2 className="text-lg text-red-600">UNABLE TO GET THE AADHAR</h2>
          </div>
        )}
      </div>
    </div>

  );
}

export default Aadhar;
