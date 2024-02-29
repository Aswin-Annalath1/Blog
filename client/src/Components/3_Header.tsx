import  { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./Utils/UserContext";

interface UserInfo {
  username: string;
  id: string;
  // Add other properties as needed
}

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const userInfo: UserInfo = await response.json();
          setUserInfo(userInfo);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle errors as needed
      }
    };
    fetchData();
  }, []);

  function logout() {
    fetch('http://localhost:4000/users/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    navigate('/login');
  }

  const username = userInfo?.username;
  return (
    <header>
      <a className="logo">MyBlog</a>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
