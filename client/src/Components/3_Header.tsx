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
        console.log(token)
        if (!token) {
          navigate('/login'); // Redirect to login page if token doesn't exist
        } else {
          const response = await fetch('https://blog-ov6m.onrender.com/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });
        if (response.ok) {
          const userInfo: UserInfo = await response.json();
          setUserInfo(userInfo);
        } else {
          setUserInfo(null);
        }
      }} catch (error) {
        console.error('Error fetching profile:', error);
        // Handle errors as needed
        navigate('/login'); // Redirect to login page on error
      }
    };
    fetchData();
  }, []);

  function logout() {
    fetch('https://blog-ov6m.onrender.com/users/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      localStorage.removeItem("token"); // Clear token from local storage
      setUserInfo(null);
      navigate('/login');
    }).catch(error => {
      console.error('Error logging out:', error);
      // Handle error as needed
    });
  }
  
  const username = userInfo?.username;
  console.log(username)
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
            <Link to="/create">Compose</Link>
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
        <button className="mode" onClick={toggleDarkMode}>{darkMode ? "🌝" : "🌚"}</button>
      </nav>
    </header>
  );
}
