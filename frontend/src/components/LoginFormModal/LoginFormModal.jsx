// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [buttonOut, setButtonOut] = useState(true);
  const { closeModal } = useModal();
  

  useEffect (() => {
    
    setErrors({});
    setButtonOut(true);
    if(password.length >= 4 && credential.length >= 6){
      setButtonOut(false);
    }
  }, [password, credential])


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          const newErrors = {};
          newErrors.credential = data.message;
          setErrors(newErrors);
        }
        console.log(errors);
      });
  };

 
  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p className = "errors">The provided credentials were invalid</p>
        )}
        <button disabled = {buttonOut?true:false}type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;