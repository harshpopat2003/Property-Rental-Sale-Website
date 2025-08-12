import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// import bcrypt from 'bcryptjs';
import ReCAPTCHA from "react-google-recaptcha";

async function loginUser(username, password,recaptchaToken) {

  const credentials = { username, password,recaptchaToken };
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
async function addToken(token, username) {
  const credentials = { token,username };
  const response = await fetch('https://192.168.2.241:8081/addToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    console.log('Request was made successfully3.');
  } else {
    console.log('Request was not made successfully3.');
  }

  return response.json();
}
// async function canLogin(username, password) {
//   //const hashedPassword=await bcrypt.hash(password,10);
//   //console.log("Hashed Pw",hashedPassword);
//   const credentials = { username, hashedPassword };
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
async function verifyRecaptcha(recaptchaToken) {
  const credentials = { recaptchaToken };
  // console.log(credentials);
  const response = await fetch('https://192.168.2.241:8080/verifyRecaptcha', {
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
  return response;

}

async function getUserId(username) {
  const credentials = { username };
  const response = await fetch('https://192.168.2.241:8081/getUserid', {
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
    alert("Some error occured");
    return;
  }

  const res = await response.json();
  // console.log(res);
  return res;
}

async function getUsertype(username) {
  const credentials = { username };
  const response = await fetch('https://192.168.2.241:8081/getUsertype', {
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
    alert("Some error occured");
    return;
  }

  const res = await response.json();
  // console.log(res);
  return res;
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();
  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };


  const handleSubmit = async e => {
    e.preventDefault();
    // const status = await getServerStatus();
    // console.log(status);
    // console.log("Hi");
    const canLoginRes = await canLogin(username, password);
    // console.log("bye");
    // console.log(canLoginRes);


    if (!canLoginRes || canLoginRes === false) {
      alert("Invalid Credentials");
      return;
    }
    const resp = await verifyRecaptcha(captchaValue);
    if(resp===false){
      alert("Captcha failed");
      return;
    }

    const token = await loginUser(username, password);
    

    const r=await addToken(token,username);
    setToken(token);
    // console.log(username);
    let id = await getUserId(username);
    // console.log(id);
    id = id[0].user_id;
    // console.log(id);

    let user_type = await getUsertype(username);
    let btype = user_type[0].user_type;
    // console.log(btype);


    if (btype === 'admin')
      navigate('/a', { state: { username, password, id, btype } });
    else if (btype === 'buyer')
      navigate('/b', { state: { id, btype } });
    else
    navigate('/d', { state: { id , btype} });

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="text-lg">
            Username
          </label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUserName(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-lg">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
        <ReCAPTCHA
          //sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          sitekey="6Ld7whEpAAAAADF-jC_FHIb9dKX_O12mRRwBlrH5"
          onChange={onCaptchaChange}
          className="my-4"
        />
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

