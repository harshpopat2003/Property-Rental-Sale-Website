// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useContext } from 'react';

// function ContractCreation() {
//   const [certificate, setCertificate] = useState('');

//   const generateCertificate = async (
//     { name, dateOfBirth, btype }
//   ) => {
//     try {
//       let type = btype;
//       let dob = dateOfBirth;
//       const data = {
//         name: name,
//         dob: dob,
//         current_date: new Date().toISOString().slice(0, 10), // Format the date as YYYY-MM-DD
//         type: type,
//       };

//       console.log("Going to Flask");
//       console.log(data);

//       const response = await axios.post('https://192.168.2.241:5000/g', data, {
//         headers: {
//           'Content-Type': 'application/json', // Use JSON content type
//         },
//       });

//       setCertificate(response.data.certificate);
//     } catch (error) {
//       console.error(error);
//     }
//   };



//   const location = useLocation();
//   const navigate = useNavigate();
//   const { username, password, name, dateOfBirth, btype, email } = location.state;
//   const [file, setFile] = useState(null);

//   const insertUser = async ({ username, password, name, dateOfBirth, btype, email }) => {
//     const credentials = { username, password, name, dateOfBirth, btype, email };
//     console.log(credentials);
//     const response = await fetch('https://192.168.2.241:8081/insertUser', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });
//     if (response.ok) {
//       console.log('Request was made successfully.');
//     }
//     else {
//       console.log('Request was not made successfully.');
//       alert("Some error occured");
//       return;
//     }

//     const res = await response.json();
//     console.log("res");
//     console.log(res);

//     console.log(res["rowCount"]);
//     navigate('/login');
//     return res;

//   };


//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
//       <div className="space-y-4 border-2 border-black w-1/2 p-4 rounded-lg flex flex-col items-center justify-center min-h-screen">
//         <h1 className="text-2xl font-bold">Generate Certificate</h1>
//         <button
//           onClick={() => generateCertificate({ name, dateOfBirth, btype })}
//           className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
//         >
//           Generate Certificate
//         </button>

//         {certificate && (
//           <div className="border-2 border-black w-1/2 p-4 rounded-lg">
//             <h2 className="text-lg font-bold">Certificate:</h2>
//             <pre className="overflow-auto">{certificate}</pre>
//           </div>
//         )}
//         <button
//           type="submit"
//           className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
//           onClick={() => insertUser({ username, password, name, dateOfBirth, btype, email })} 
//         >
//           Submit
//         </button>
//         {/* </div>

//       <h1 className="text-2xl font-bold mb-4">Aadhaar Card Verification</h1> */}
//       </div>
//     </div>

//   );
// }

// export default ContractCreation;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';

function ContractCreation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, password, name, dateOfBirth, btype, email } = location.state;

  const insertUser = async ({ username, password, name, dateOfBirth, btype, email }) => {
    const credentials = { username, password, name, dateOfBirth, btype, email };
    // console.log(credentials);
    const response = await fetch('https://192.168.2.241:8081/insertUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      console.log('Request was made successfully.');
    }
    else {
      console.log('Request was not made successfully.');
      alert("Some error occurred");
      return;
    }

    const res = await response.json();
    // console.log("res");
    // console.log(res);

    navigate('/login');
    return res;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="space-y-4 border-2 border-black w-1/2 p-4 rounded-lg flex flex-col items-center justify-center min-h-screen">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={() => insertUser({ username, password, name, dateOfBirth, btype, email })} 
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ContractCreation;
