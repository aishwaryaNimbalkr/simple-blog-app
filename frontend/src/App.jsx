
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Components/HomePage'
import Login from './Components/Login'
import UserDasboard from './Components/userDashboard'
import EditBlog from './Components/EditBlog';
import BlogDetail from './Components/BlogDetail';
import CreateBlog from './Components/CreateBlog';

function App() {


  return (
    <BrowserRouter>
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/userDashboard/:id' element={<UserDasboard/>}/>
        <Route path="/edit-blog/:id" element={<EditBlog/>} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/create-blog" element={<CreateBlog />} />
      </Routes>
    </>
    </BrowserRouter>
  )
}

export default App
