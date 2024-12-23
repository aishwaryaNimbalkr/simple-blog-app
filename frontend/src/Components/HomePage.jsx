import { Link } from 'react-router-dom'
import image from './blog.png'
import './HomePage.css'
const HomePage=()=>{
    return(
        <>
        <div className='nav'> 
           <></>
            <button><Link to="/login" style={{color:"white"}}>Login</Link></button>
            </div>
        <div className='homepage'>
        <h1>Blogger</h1>
        <h2>Publish your passions, your way</h2>
        
           <p><Link to="/login" style={{color:"green"}} >Start to write your first blog...</Link></p>
           <img src={image} alt="imgage1" />
        
           
        </div>
        </>
    )
}
export default HomePage