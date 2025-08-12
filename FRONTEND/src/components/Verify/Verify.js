import React, { useState } from 'react';
import axios from 'axios';

function CertVer() {
  const [certificateData, setCertificateData] = useState(null);
  const [validationResult, setValidationResult] = useState('');

  const handleVerifyCertificate = async () => {
    if (!certificateData) {
      alert('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('certificate_data', certificateData);
      // console.log("Going to Flask")
      const response = await axios.post('https://192.168.2.241:5000/v', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValidationResult(response.data.message);
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setValidationResult('Error verifying certificate');
    }
  };
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5 MB');
      return;
    }
    else {
      setCertificateData(file);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Certificate Verification</h1>
      <div className="flex flex-col items-center justify-center gap-2 p-4 border border-black rounded shadow-md">
        <label className="text-lg font-bold">Certificate Data:</label>
        <label htmlFor="inputtxt" className="text-lg">
          Upload cert file:
        </label>
        <input
          type="file"
          id="inputtxt"
          onChange={handleInputChange}
          accept=".txt"
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
      <button
        onClick={handleVerifyCertificate}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Verify Certificate
      </button>
      <div className="mt-4">
        <h2 className="text-lg font-bold">Validation Result:</h2>
        <p className="text-green-600">{validationResult}</p>
      </div>
    </div>

  );
}

export default CertVer;
