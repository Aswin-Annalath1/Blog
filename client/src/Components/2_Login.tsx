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
    const response = await fetch('http://localhost:4000/users/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('wrong credentials');
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
             onChange={(ev: ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)}/>
      <button>Login</button>
    </form>
  );
}