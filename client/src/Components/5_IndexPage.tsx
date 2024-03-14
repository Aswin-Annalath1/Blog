import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
          <div className="post" key={post._id}>
            <div className="image">
              <Link to={`/post/${post._id}`}>
                <img src={`https://blog-ov6m.onrender.com/${post.cover}`} alt="" />
              </Link>
            </div>
            <div className="texts">
              <Link to={`/post/${post._id}`}>
                <h2>{post.title}</h2>
              </Link>
              <p className="info">
                <a className="author">{post.author?.username}</a>
                <time>{format(new Date(post.createdAt), 'dd-MM-yyyy')}</time>
                <a className="info1">
                  <a onClick={() => handleLike(post._id)}>❤️</a>
                  <span>{post.likesCount}</span>
                </a>
              </p>
              <p className="summary">{post.summary}</p>
            </div>
          </div>
        ))}
    </>
  );
}
