import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import './BlogDetail.css'

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the blog details on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get(`http://localhost:4000/api/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token to the backend
          },
        });
        setBlog(response.data.blog);
      } catch (err) {
        setError('Failed to fetch blog details');
      }
    };

    fetchBlog();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center mt-5">
      <div className="blog-detail-container border border-4 border-dark shadow rounded w-75 mx-auto p-2" style={{ backgroundColor: "aliceblue" }}>
        <div className="blog-header">
          <h2 className="fw-bold fs-4">{blog.title}</h2>
          <p className="text-muted">By {blog.author.userName}</p>
        </div>

        <div className="blog-content mt-3">
          <p>{blog.content}</p>
        </div>
{console.log(blog.images)}
        {/* Render Images if available */}
        {blog.images && blog.images.length > 0 && (
       <div className="blog-images mt-4">
       <div className="row justify-content-center">
         {blog.images.length === 1 ? (
           <div className="col-12 d-flex justify-content-center mb-3">
             <img
               src={`http://localhost:4000/${blog.images[0]}`}
               alt={`Blog image`}
               className="img-fluid"
               style={{ width: '100%', height: 'auto' }}
             />
           </div>
         ) : (
           blog.images.map((image, index) => (
             <div key={index} className="col-12 col-md-6 mb-3">
               <div className="image-container">
                 <img
                   src={`http://localhost:4000/${image}`}
                   alt={`Blog image ${index + 1}`}
                   className="img-fluid"
                   style={{ width: '100%', height: 'auto' }}
                 />
               </div>
             </div>
           ))
         )}
       </div>
     </div>
     
      
        )}

        <div className="blog-likes mt-3">
          <strong>
            <FaRegHeart color="red" size="20" />
          </strong>{' '}
          {blog.likes.length}
        </div>

        
      </div>
    </div>
  );
};

export default BlogDetail;
