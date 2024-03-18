//The Structure of ReUsable UI Component.

import { format } from "date-fns";
import { Link } from "react-router-dom";

interface PostProps {
  _id: string;
  cover: string;
  title: string;
  summary: string;
  createdAt: string;
  author?: { username: string };
  likesCount: number;
  handleLike: (postId: string) => void;
}

export default function Post({ _id, cover, title, summary, createdAt, author, likesCount, handleLike }: PostProps) {
  const handleClick = () => {
    handleLike(_id);
  };

  return (
    <div className="post" key={_id}>
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`https://blog-ov6m.onrender.com/${cover}`} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author?.username}</a>
          <time>{format(new Date(createdAt), 'dd-MM-yyyy')}</time>
          <a className="info1">
            <a onClick={handleClick}>❤️</a>
            <span>{likesCount}</span>
          </a>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
