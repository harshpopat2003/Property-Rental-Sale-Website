import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import useToken from '../../useToken';

export default function UpdateDocs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useToken();

  const { id , property_id} = location.state;
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const genRan = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(id+"_"+genRan()+"_"+e.target.files[0].name);
  };
  const handleUpload = async () => {
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
  const handleUpdateDocs = async ({ property_id, fileName }) => {
    const tokenString=JSON.stringify({token});
    const response = await fetch('https://192.168.2.241:8081/updatePropertyFiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token':tokenString,
      },
      body: JSON.stringify({ property_id, fileName }),
    });
    // console.log(response);
    const data = await response.json();
    alert("File Uploaded Successfully");
    navigate(-1);
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Update Docs</h1>
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
      <button
        onClick={() => handleUpdateDocs({ property_id, fileName })}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Go Back
      </button>
    </div>
  );
}
