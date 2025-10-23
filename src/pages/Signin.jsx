import React, { useEffect, useState } from 'react';
import { useNavigate }                from 'react-router-dom';
import './Signin.css';
import { FaEye, FaEyeSlash }          from 'react-icons/fa'; 
import { API_BASE_URL }               from '../config';

const SignIn = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // 👈 State for toggle
useEffect(()=>{
  if(localStorage.getItem('currentUser')!==null){
    navigate('/adminhome')
  }
  const start = performance.now();
  // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/checkSession`,{
   fetch(`${API_BASE_URL}/checkSession`,{
  // fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/checkSession`,{
    method:"GET",
    credentials:'include'
  }).then(resp => resp.json()).then(data => {
  //console.log("sign in check session",data);
  if (data.status === 'failed') {
    const end = performance.now(); // End time
      console.log(`Fetch for sign in check session took ${end - start} ms`);
    navigate('/signin')
    //setMessage("Invalid username or password");
  } if(data.status==='pass') {
     const userData = {
    username: data.userName,
    phone:data.phoneNumber,
    role: data.role,
    courseType:data.coursetype,
    courseName:data.courseName,
    email: data.userGmail,
  };
  localStorage.setItem('currentUser', JSON.stringify(userData));
    window.dispatchEvent(new Event('userLogin'));
    navigate('/adminhome', { replace: true })

    setMessage("Login successful");
    // localStorage.setItem('currentUser', JSON.stringify({
    //   username: data.userName,
    //   role: 'admin',
    //   email: data.userGmail,
    //   phone: '0000000000'
    // }));
    // setTimeout(() => navigate('/adminhome'), 1000);
  }
}).catch(()=>{
  //console.log("Session check failed:", err)
}
   
  );
},[])
  const handleSubmit = (e) => {
    e.preventDefault();
  const start = performance.now();
    //const users = JSON.parse(localStorage.getItem('users')) || [];
  // fetch(`https://trilokinnovations-api-prod.trilokinnovations.com/test/signIn`,{
  fetch(`${API_BASE_URL}/signIn`,{
  //  fetch(`https://test-padmasiniAdmin-api.trilokinnovations.com/signIn`,{
  method:"POST",
  credentials:'include',
  headers: {
        "Content-Type": "application/json", // 👈 important
      },
  body:JSON.stringify({userName:userName,password:password})})
  .then(resp=>
    resp.json()

  ).then(data=>{
    const end = performance.now(); // End time
      console.log(`Fetch for  login in sign in  took ${end - start} ms`);
    //console.log(data)
    if(data.status==='failed'){
      //console.log(text)
      setMessage("invalid username or password")
    }
    else if(data.status==='pass'){
    const userData = {
    username: data.userName,
    role: data.role,
    email: data.userGmail,
    phone: data.phoneNumber,
    courseType:data.coursetype,
    courseName:data.courseName
  };
   localStorage.setItem('currentUser', JSON.stringify(userData));
   setMessage("Login successful");
setTimeout(() => {
    window.dispatchEvent(new Event('userLogin'));
    //setMessage("Login successful");
   navigate('/adminhome', { replace: true })

  }, 1000);
    
    
    
  }
  })
  .catch(err=>{
    console.error("Login failed", err);
    setMessage("Something went wrong. Please try again.");
  //console.log(err)
  }
)
    // if (userName === 'admin' && password === '1234') {
      
      
    //   return;
    // }

    // const matchedUser = users.find(
    //   (user) => user.username === userName && user.password === password
    // );

    // if (matchedUser) {
    //   localStorage.setItem('currentUser', JSON.stringify(matchedUser));
    //   setMessage('Login successful!');
    //   setTimeout(() => navigate('/adminhome'), 1000);
    // } else {
    //   setMessage('Invalid username or password.');
    // }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && (
        <p className={`signin-message ${message === 'Login successful!' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SignIn;
