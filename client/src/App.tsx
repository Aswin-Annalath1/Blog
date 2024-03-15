import './App.css';
import { UserContextProvider } from './Components/Utils/UserContext';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './Components/5_IndexPage';
import LoginPage from './Components/2_Login';
import RegisterPage from './Components/1_Register';
import CreatePost from './Components/4_CreatePost';
import PostPage from './Components/6_PostPage';
import EditPost from './Components/7_EditPost';

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;

