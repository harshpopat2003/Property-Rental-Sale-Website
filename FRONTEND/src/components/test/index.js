import React, { useState } from 'react';
import axios from 'axios';

export default function Testing() {

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', fileName);
      setFile(null);
      try {
        await axios.post('https://192.168.2.241:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('File uploaded successfully');
      } catch (error) {
        alert('Error uploading file');
      }
    } else {
      alert('Please select a file');
    }
  };

  const handleDownload = () => {
    if (fileName) {
      window.open(`https://192.168.2.241:5000/download?name=${fileName}`, '_blank');
    } else {
      alert('Please enter a file name');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://192.168.2.241:5000/delete?name=${fileName}`);
      alert('File deleted successfully');
    } catch (error) {
      alert('Error deleting file');
    }
  };

  return (
    <div>
      <h1>PDF Upload, Download, and Delete</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleUpload}>Upload PDF</button>
      <button onClick={handleDownload}>Download PDF</button>
      <button onClick={handleDelete}>Delete PDF</button>
    </div>
  );
}

