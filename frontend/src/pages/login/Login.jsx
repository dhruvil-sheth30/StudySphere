import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto mt-16'>
			<div className='w-full p-8 rounded-lg shadow-lg bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg'>
				<h1 className='text-4xl font-bold text-center text-gray-100 mb-8'>
					Welcome Back to <span className='text-blue-500'>StudySphere</span>
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="relative">
						<label className='block text-gray-300 text-sm font-medium mb-2'>
							Username
						</label>
						<div className="flex items-center">
							<span className="absolute left-3 text-gray-400">
								<FaUser />
							</span>
							<input
								type='text'
								placeholder='Enter username'
								className='w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
					</div>

					<div className="relative">
						<label className='block text-gray-300 text-sm font-medium mb-2'>
							Password
						</label>
						<div className="flex items-center">
							<span className="absolute left-3 text-gray-400">
								<FaLock />
							</span>
							<input
								type='password'
								placeholder='Enter Password'
								className='w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
					
					<div className="flex items-center justify-between">
						<Link to='/signup' className='text-blue-400 hover:underline text-sm'>
							Don't have an account?
						</Link>
						<Link to='/' className='text-gray-400 hover:underline text-sm'>
							Back to home
						</Link>
					</div>

					<button 
						className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center' 
						disabled={loading}
					>
						{loading ? <span className='loading loading-spinner'></span> : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
};
export default Login;


