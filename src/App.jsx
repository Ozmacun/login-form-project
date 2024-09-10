import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Success from "./components/Success";

function App() {
  return (
    
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/Success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
