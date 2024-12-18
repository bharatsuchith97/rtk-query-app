import React, { useState } from 'react';
import { useGetPostsQuery,usePostPostMutation } from './features/apiSlice';

const App: React.FC = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery();
  const [postPost] = usePostPostMutation();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && body) {
      try {
        await postPost({ title, body, userId:1 }).unwrap();
        setTitle('');
        setBody('');
        alert('Post added successfully!');
      } catch (err) {
        console.error('Failed to add post:', err);
        alert('Error adding post!');
      }
    }
  };

  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error occurred</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts?.map((post: { id: number; title: string }) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default App;
