import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../InnerComponents/Editor";

interface PostInfo {
  title: string;
  summary: string;
  content: string;
}

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`https://blog-ov6m.onrender.com/blog/post/${id}`)
      .then(response => {
        response.json().then((postInfo: PostInfo) => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, [id]);


  async function updatePost(ev: React.FormEvent) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id || '');
    if (files?.[0]) {
      data.set('file', files[0]);
    }
    const response = await fetch('https://blog-ov6m.onrender.com/blog/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input type="file" onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  );
}
