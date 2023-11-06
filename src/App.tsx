import Home from './Home';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import supabase from './config/supabaseClient';

function App()
{
  return (
    <Router>
      <div className="App">
        Nav bar
        <div className='content'>
          <Routes>
            Routes go here
            example:
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
