

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import './App.css';
import Dashboard from './components/Dashboard/Dashboard'
import Preferences from './components/Preferences/Preferences'
import Aadhar from './components/Aadhar/Aadhar';
import useToken from './useToken';
import CertVer from './components/Verify/Verify';
import GenCert from './components/Generate/Generate';

import LoginSignUp from './components/LoginSignUp';
import Login from './components/Login/Login'
import SignUp from './components/Signup/Signup';
import ContractCreation from './components/ContractCreation/ContractCreation';

import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import BuyerDashboard from './components/BuyerDashboard/BuyerDashboard';

import AddProperty from './components/Dashboard/AddProperty/index.js';
import EKyc from './components/EKyc/EKyc';
import { createContext } from 'react';
import BuyProperty from './components/BuyProperty';
import SellerContract from './components/SellerContract';
import UpdateDocs from './components/UpdateDocument';
import Testing from './components/test';




async function loginUser(username, password) {

  const credentials = { username, password };
  const response = await fetch('https://192.168.2.241:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    console.log('Request was made successfully.');
  } else {
    console.log('Request was not made successfully.');
  }

  return response.json();
}



async function canLogin(username, password) {
  const credentials = { username, password };
  // console.log(credentials);
  const response = await fetch('https://192.168.2.241:8081/canLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    console.log('Request was made successfully.');
    // console.log(response.json())
  } else {
    console.log('Request was not made successfully.');
  }
  return response;

}
async function decryptApi(data) {
  const credentials = { encryptedMessage: data }; // Match the expected property name
  try {
    const response = await fetch('https://192.168.2.241:8080/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const responseData = await response.json();
      // console.log('Decrypted Message:', responseData.decryptedMessage);
      return responseData.decryptedMessage;
    } else {
      console.log('Request was not made successfully.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function App() {
  const MyContext = createContext();
  const { token, setToken } = useToken();
  const { removeToken } = useToken();
  const date = new Date();
  const refDate = new Date("2020-01-01");
  const secpassed = Math.floor((date - refDate) / 1000);
  const currentTime = date.getMinutes() * 60 + date.getSeconds() + date.getHours() * 60 * 60 + secpassed;


  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        const prevTime = await decryptApi(token.encryptedMessage);
        // console.log(currentTime + " : " + prevTime + ":" + (currentTime - prevTime));
        if ((currentTime - prevTime) > 1000000) {
          localStorage.removeItem('token')
          window.location.reload();
          removeToken();
        }
      }
    }
    checkTokenValidity();
  }, [token, currentTime, removeToken]);

  return (
    <BrowserRouter>
      <>
        {!token && (
          <Routes>
            <Route path="/" element={<LoginSignUp />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<SignUp setToken={setToken} />} />
            <Route path="*" element={<LoginSignUp />} />
            <Route path="/aadhar" element={<Aadhar />} />
            <Route path="/ContractCreation" element={<ContractCreation />} />
            <Route path="/Testing" element={<Testing />} />
            <Route path="/ekyc" element={<EKyc />} />
          </Routes>
        )}
        {token && (
          <>
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Routes>
                <Route path="/d" element={<Dashboard />} />
                <Route path="/d/update" element={<UpdateDocs />} />
                <Route path="/d/ap" element={<AddProperty />} />
                <Route path="/p" element={<Preferences />} />
                <Route path="/v" element={<CertVer />} />
                <Route path="/g" element={<GenCert />} />
                <Route path="/a" element={<AdminDashboard />} />
                <Route path="/b" element={<BuyerDashboard />} />
                <Route path="/b/buy" element={<BuyProperty />} />
                <Route path="/sellerContract" element={<SellerContract />} />
                <Route path="/Testing" element={<Testing />} />
              </Routes>
              <div className='flex flex-row justify-end w-full p-4'>
                <button
                  onClick={() => {
                    window.location.reload();
                    removeToken();
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </>
    </BrowserRouter>
  );
}


export default App;

// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold underline">
//       Hello world!
//     </h1>
//   )
// }





// import React from 'react';
// import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

// import './App.css';
// import Dashboard from './components/Dashboard/Dashboard'
// import Preferences from './components/Preferences/Preferences'
// import Aadhar from './components/Aadhar/Aadhar';
// import useToken from './useToken';
// import CertVer from './components/Verify/Verify';
// import GenCert from './components/Generate/Generate';

// import LoginSignUp from './components/LoginSignUp';
// import Login from './components/Login/Login'
// import SignUp from './components/Signup/Signup';
// import ContractCreation from './components/ContractCreation/ContractCreation';

// import AdminDashboard from './components/AdminDashboard/AdminDashboard';
// import BuyerDashboard from './components/BuyerDashboard/BuyerDashboard';

// import AddProperty from './components/Dashboard/AddProperty/index.js';
// import EKyc from './components/EKyc/EKyc';
// import { createContext } from 'react';
// import BuyProperty from './components/BuyProperty';
// import SellerContract from './components/SellerContract';
// import UpdateDocs from './components/UpdateDocument';
// import Testing from './components/test';



// async function loginUser(username, password) {

//   const credentials = { username, password };
//   const response = await fetch('https://192.168.2.241:8080/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(credentials),
//   });

//   if (response.ok) {
//     console.log('Request was made successfully.');
//   } else {
//     console.log('Request was not made successfully.');
//   }

//   return response.json();
// }



// async function canLogin(username, password) {
//   const credentials = { username, password };
//   console.log(credentials);
//   const response = await fetch('https://192.168.2.241:8081/canLogin', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(credentials),
//   });
//   if (response.ok) {
//     console.log('Request was made successfully.');
//     console.log(response.json())
//   } else {
//     console.log('Request was not made successfully.');
//   }
//   return response;

// }


// function App() {
//   const MyContext = createContext();
//   const { token, setToken } = useToken();
//   const { removeToken } = useToken();
//   const date = new Date();
//   const refDate = new Date("2020-01-01");
//   const secpassed = Math.floor((date - refDate) / 1000);
//   const currentTime=date.getMinutes()*60 + date.getSeconds()+date.getHours()*60*60+secpassed;
//   // const handleSubmit = async e => {
//   //   e.preventDefault();
//   //   console.log("Hi");
//   //   const canLoginRes = await canLogin(token.username, token.password);
//   //   console.log("bye");
//   //   console.log(canLoginRes);
//   //   if (!canLoginRes || canLoginRes === false) {
//   //     alert("Invalid Credentials");
//   //     return false;
//   //   }
//   //   return true;
//   // }
// //   if(token ){  ///sett time to 
// //     console.log(token);
// //     const baseCharCode = 'a'.charCodeAt(0) - 1;
// //     let originalNumber = '';
// //     for (let i = 0; i < token.result.length; i++) {
// //       const letter = token.result[i];
// //       const letterCode = letter.charCodeAt(0);
// //       originalNumber += letterCode - baseCharCode-5;
// //     }
// //     const prevTime=parseInt(originalNumber, 10);
// //     console.log(currentTime +" : "+prevTime+":"+(currentTime-prevTime));
// //     if((currentTime-prevTime)>1000000){
// //       localStorage.removeItem('token')
// //       window.location.reload();
// //      removeToken();
// //     }
// // }
//   // const flag=true
//   // if(!token)flag=false;
//   // if(token){
//   //   if(handleSubmit()===false)flag=false;
//   // }
//   // const verifyToken=
//   return (
//       <BrowserRouter>
//         <>
//           {!token && (
//             <Routes>
//               <Route path="/" element={<LoginSignUp />} />
//               <Route path="/login" element={<Login setToken={setToken} />} />
//               <Route path="/signup" element={<SignUp setToken={setToken} />} />
//               <Route path="*" element={<LoginSignUp />} />
//               <Route path="/aadhar" element={<Aadhar />} />
//               <Route path="/ContractCreation" element={<ContractCreation />} />
//               <Route path="/Testing" element={<Testing />} />
//               <Route path="/ekyc" element={<EKyc />} />
//             </Routes>
//           )}
//           {token && (
//             <>
//               <div className="flex flex-col items-center justify-center h-full w-full">
//                 <Routes>
//                   <Route path="/d" element={<Dashboard />} />
//                   <Route path="/d/update" element={<UpdateDocs />} />
//                   <Route path="/d/ap" element={<AddProperty />} />
//                   <Route path="/p" element={<Preferences />} />
//                   <Route path="/v" element={<CertVer />} />
//                   <Route path="/g" element={<GenCert />} />
//                   <Route path="/a" element={<AdminDashboard />} />
//                   <Route path="/b" element={<BuyerDashboard />} />
//                   <Route path="/b/buy" element={<BuyProperty />} />
//                   <Route path="/sellerContract" element={<SellerContract />} />
//                   <Route path="/Testing" element={<Testing />} />
//                 </Routes>
//                 <div className='flex flex-row justify-end w-full p-4'>
//                   <button
//                     onClick={() => {
//                       window.location.reload();
//                       removeToken();
//                     }}
//                   >
//                     Log Out
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </>
//       </BrowserRouter>
//   );
// }


// export default App;

// // export default function App() {
// //   return (
// //     <h1 className="text-3xl font-bold underline">
// //       Hello world!
// //     </h1>
// //   )
// // }