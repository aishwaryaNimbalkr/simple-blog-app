import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdVisibility } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import './userDashboard.css';

const userDashboard = () => {
    const { id } = useParams();
    const [userBlogs, setUserBlogs] = useState([]);
    const [allBlogs, setAllBlogs] = useState([]);
   const[showAllBlogs,setShowAllBlogs]=useState(true)
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const navigate = useNavigate();
  
    // Fetch User Blogs
    const fetchUserBlogs = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/blog/myBlogs/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setUserBlogs(response.data.blogs);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user blogs.');
        }
    };

    // Fetch All Blogs
    const fetchAllBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/blog/blogs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setAllBlogs(response.data.blogs);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch all blogs.');
        }
    };

    useEffect(() => {
      
        fetchUserBlogs();
        fetchAllBlogs();
    }, []);

    // Delete a blog
    const handleDelete = async (blogId) => {
        // Show confirmation alert before proceeding
        const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
    
        // If user clicks "Cancel", stop execution
        if (!isConfirmed) {
          return;
        }
    
        try {
          await axios.delete(`http://localhost:4000/api/blog/deleteBlog/${blogId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          });fetchUserBlogs();
          // Optionally, handle success (e.g., remove the deleted blog from UI)
        } catch (err) {
          console.error('Error deleting blog:', err);
          setError('Failed to delete blog.');
        }
      };


      const handleLike = async (blogId) => {
        try {
          await axios.put(
            `http://localhost:4000/api/blog/like/${blogId}`,
            {},
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            }
          );
    
          // Optimistically update like count
          setAllBlogs((prevBlogs) =>
            prevBlogs.map((blog) =>
              blog._id === blogId
                ? {
                  ...blog, likes: blog.likes.includes(localStorage.getItem("userId"))
                    ? blog.likes.filter((like) => like !== localStorage.getItem("userId"))
                    : [...blog.likes, localStorage.getItem("userId")]
                }
                : blog
            )
          );
        } catch (err) {
          console.error("Error toggling like:", err);
        }
      };
    
    
    
      
   
      const handleVisibility = (blog) => {
        navigate(`/blog/${blog._id}`);
      };
//updated with jquery but not working due to react
      //   // Search function with jQuery
      //   const handleSearch = () => {
      //     const query = $('#search-bar').val().toLowerCase();
  
      //     // Filter My Blogs
      //     $(".my-blogs .blog-card").each(function () {
      //         const title = $(this).find('.blog-title').text().toLowerCase();
      //         const content = $(this).find('.blog-content').text().toLowerCase();
      //         if (title.includes(query) || content.includes(query)) {
      //             $(this).show();
      //         } else {
      //             $(this).hide();
      //         }
      //     });
  
      //     // Filter All Blogs
      //     $(".all-blogs .blog-card").each(function () {
      //         const title = $(this).find('.blog-title').text().toLowerCase();
      //         const content = $(this).find('.blog-content').text().toLowerCase();
      //         if (title.includes(query) || content.includes(query)) {
      //             $(this).show();
      //         } else {
      //             $(this).hide();
      //         }
      //     });
      // };
  // Filter blogs based on search query
  const filteredUserBlogs = userBlogs.filter(
    (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
);

const filteredAllBlogs = allBlogs.filter(
    (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
);



    return (
        <div className="user-dashboard-container text-center mt-2">
      <div className='d-flex justify-content-center mx-5'>
        <h2>Welcome to your Dashboard</h2>
       
      </div>

      <hr />
      <div className="toggle-buttons-container">
      <div className="create-blog-link">
    <Link to="/create-blog">
      <button className="btn btn-outline-light create-btn p-1 mb-3">
        Create New Blog
      </button>
    </Link>
  </div>
  <div className="toggle-buttons ">
    <button 
      onClick={() => setShowAllBlogs(true)} 
      className="btn btn-primary toggle-btn p-1 mb-3"
    >
      My Blogs
    </button>
    <button 
      onClick={() => setShowAllBlogs(false)} 
      className="btn btn-secondary toggle-btn p-1 mb-3"
    >
      All Blogs
    </button>
  </div>
  
</div>

  {/* Search Bar */}
  <div className="search-container">
                <input

                    type="text"
                    id="search-bar"
                    placeholder="Search blogs by title or content"
                    value={searchQuery} // Set value to state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                />
            </div>

      <div>
        {/* My Blogs Section */}
        {showAllBlogs && (
         <div>
         <div className="all-blogs-container my-blog">
           {filteredUserBlogs.length > 0 ? (
             filteredUserBlogs.map((blog) => (
               <div key={blog._id} className="blog-card">
                <div className="col-12 d-flex justify-content-center mb-3">
             <img
               src={`http://localhost:4000/${blog.images[0]}`}
               alt={`Blog image`}
               className="img-fluid"
               style={{ width: '100%', height: 'auto' }}
             />
           </div>
                 <h3 className="blog-title">{blog.title}</h3>
                 <p className="blog-content">{blog.content.substring(0, 150) + '...'}</p>
                 <div className="blog-actions">
                   <CiEdit
                     size="30"
                     className='m-2'
                     color="blue"
                     style={{ cursor: "pointer" }}
                     onClick={() => navigate(`/edit-blog/${blog._id}`)}
                   />
                   <MdDeleteOutline
                     size="30"
                     className='m-2'
                     color="red"
                     style={{ cursor: "pointer" }}
                     onClick={() => handleDelete(blog._id)}
                   />
                 </div>
               </div>
             ))
           ) : (
             <p>No blogs available.</p>
           )}
         </div>
       </div>
       
        )}

        {/* All Blogs Section */}
        {!showAllBlogs && (
      <div>
      <div className="all-blogs-container all-blog">
        {filteredAllBlogs.length > 0 ? (
          filteredAllBlogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div className="col-12 d-flex justify-content-center mb-3">
             <img
               src={`http://localhost:4000/${blog.images[0]}`}
               alt={`Blog image`}
               className="img-fluid"
               style={{ width: '100%', height: '200px' }}
             />
           </div>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-content">
                {blog.content.substring(0, 150) + "..."}
              </p>
              <div className="blog-actions">
                <MdVisibility
                  size="25"
                  className="action-icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleVisibility(blog)}
                />
    
                {blog.likes.includes(localStorage.getItem("userId")) ? (
                  <FaHeart
                    size="20"
                    color="red"
                    className="action-icon"
                    onClick={() => handleLike(blog._id)}
                  />
                ) : (
                  <FaRegHeart
                    size="20"
                    color="red"
                    className="action-icon"
                    onClick={() => handleLike(blog._id)}
                  />
                )}
                <sub className="like-count">{blog.likes.length}</sub>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs available.</p>
        )}
      </div>
    </div>
    
        )}
      </div>

    </div>
    );
};

export default userDashboard;
