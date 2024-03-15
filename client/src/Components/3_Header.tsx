import  { useContext, useEffect, useState } from "react";
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
  const [darkMode, setDarkMode] = useState(false); // State variable to track dark mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('https://blog-ov6m.onrender.com/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
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
    fetch('https://blog-ov6m.onrender.com/users/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    navigate('/login');
  }

  const username = userInfo?.username;
  // Function to toggle dark mode
  function toggleDarkMode() {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle("dark-mode");
  }
  return (
    <header className={darkMode ? "dark-mode" : ""}> {/* Apply dark mode class */}
      <a className="logo">MyBlog</a>
      <nav>
        {username && (
          <>
            <Link to="/create">Add post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {/* Add dark mode button */}
        <button className="mode" onClick={toggleDarkMode}>{darkMode ? "🌞" : "🌚"}</button>
      </nav>
    </header>
  );
}
