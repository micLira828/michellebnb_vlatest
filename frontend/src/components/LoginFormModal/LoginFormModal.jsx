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
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  useEffect(() => {
    const newErrors = {}

    if(credential && credential.length < 4){
      newErrors.credential = "Username or email must be at least 4 characters"
    }

    if(password && password.length < 6){
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors);
  }, [credential, password])

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
         {errors.credential ? <p className = 'errors'>{errors.credential}</p> : null}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password ? <p className = 'errors'>{errors.password}</p>: null}
        <button disabled = {Object.values(errors).length || !password || !credential ? true:false }type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;