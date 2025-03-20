import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Landing from "./pages/landing/Landing";
import Navbar from "./components/common/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
	const { authUser } = useAuthContext();
	
	return (
		<>
			<Navbar />
			<div className='p-4 h-screen flex items-center justify-center'>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Landing />} />
					<Route path='/login' element={authUser ? <Navigate to='/chat' /> : <Login />} />
					<Route path='/signup' element={authUser ? <Navigate to='/chat' /> : <SignUp />} />
					
					{/* Protected routes */}
					<Route 
						path='/chat' 
						element={authUser ? <Home /> : <Navigate to={"/login"} state={{ from: "/chat" }} />} 
					/>
					
					{/* Catch all - redirect to landing page */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
				<Toaster position="top-center" reverseOrder={false} />
			</div>
		</>
	);
}

export default App;
