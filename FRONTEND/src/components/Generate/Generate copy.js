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
      const formData = new FormData();
      formData.append('input_text', inputText);
      // console.log("Going to Flask")
      const response = await axios.post('https://192.168.2.241:5000/g', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

        {/* Uncomment this textarea if needed
    <textarea
      placeholder="Input Text"
      value={inputText}
      onChange={handleInputTextChange}
      className="border border-gray-300 p-2 rounded-md"
    ></textarea>
    */}

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
