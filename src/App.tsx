import AuthProvider from './AuthProvider';
import Home from './Home';
import Login from './Login';
import {Route, Routes} from 'react-router-dom';

function App()
{
  return (
    <div className="App">
      <Routes>
        Routes go here
        example:
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login"  element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App
