import AuthProvider from './AuthProvider';
import Home from './Home';
import Login from './Login';
import {Route, Routes} from 'react-router-dom';
import Signup from './Signup';

function App()
{
  return (
    <div className="App">
      <Routes>
        Routes go here
        example:
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login"  element={<Login />}></Route>
        <Route path="/signup"  element={<Signup />}></Route>
        <Route path="/"  element={<AuthProvider />}></Route>
      </Routes>
    </div>
  );
}

export default App
