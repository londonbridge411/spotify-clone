import { Link } from "react-router-dom";

function Home()
{
    //onClick={router.push('/login')}
    return <div>
        <Link to = "/login">Login</Link>
        <button>Signup</button>
    </div>;
}


export default Home