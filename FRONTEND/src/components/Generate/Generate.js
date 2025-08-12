import React, { useState } from 'react';
import axios from 'axios';

function GenCert() {
  const [inputText, setInputText] = useState(null);
  const [certificate, setCertificate] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.files[0]);
  };

  const generateCertificate = async () => {
    try {
      const data = {
        name: "Himanshu",
        dob: "1999-12-12",
        current_date: new Date().toISOString().slice(0, 10), // Format the date as YYYY-MM-DD
        type: "Buyer",
      };

      // console.log("Going to Flask");
      // console.log(data);

      const response = await axios.post('https://192.168.2.241:5000/g', data, {
        headers: {
          'Content-Type': 'application/json', // Use JSON content type
        },
      });

      setCertificate(response.data.certificate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 border-2 border-black w-1/2 p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Generate Certificate</h1>
      <label htmlFor="inputtxt" className="text-lg">
        Upload initial cert file:
      </label>
      <input
        type="file"
        id="inputtxt"
        onChange={handleInputChange}
        accept=".txt"
        className="border border-gray-300 p-2 rounded-md"
      />
      <button
        onClick={generateCertificate}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Generate Certificate
      </button>

      {certificate && (
        <div className="border-2 border-black w-1/2 p-4 rounded-lg">
          <h2 className="text-lg font-bold">Certificate:</h2>
          <pre className="overflow-auto">{certificate}</pre>
        </div>
      )}
    </div>
  );
}

export default GenCert;
