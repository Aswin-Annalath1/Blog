//Page level component where a reusable UI component passed with Props.

import { useEffect, useState } from "react";
import Post from "../Post";

interface Post {
  _id: string;
  cover: string;
  title: string;
  author?: { username: string };
  createdAt: string;
  summary: string;
  likesCount: number;
  
}

export default function IndexPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('https://blog-ov6m.onrender.com/blog/post').then((response) => {
      response.json().then((posts: Post[]) => {
        setPosts(posts);
      });
    });
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://blog-ov6m.onrender.com/blog/like/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        credentials: 'include',
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likesCount: post.likesCount + 1 } : post
          )
        );
      } else {
        alert("Already Liked");
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => (
          <Post key={post._id} {...post} handleLike={handleLike}/> //key help to point unique element in component array & handleclick passed as props for like functionality 
        ))}
    </>
  );
}
