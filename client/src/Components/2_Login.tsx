import {useContext, useState, ChangeEvent, FormEvent} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "./Utils/UserContext";

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev: FormEvent) {
    ev.preventDefault();  //asynchronous handling of form submissions and avoid unwanted page reloads.
    const response = await fetch('https://blog-ov6m.onrender.com/users/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.token; // Extract token from response
      localStorage.setItem("token", token); // Save the token in localStorage
      setUserInfo(data); // Set user info state
      setRedirect(true); // Redirect the user
    } else {
      alert('Wrong credentials');
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={(ev: ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value)} required/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)} required/>
      <button>Login</button>
    </form>
  );
}