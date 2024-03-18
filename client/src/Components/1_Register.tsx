import React, { useState, FormEvent } from "react";
import {Navigate} from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function register(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const response = await fetch('https://blog-ov6m.onrender.com/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      alert('Registration successful');
      return <Navigate to={'/'} />
    } else {
      alert('Registration failed');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      required/>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      required/>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
