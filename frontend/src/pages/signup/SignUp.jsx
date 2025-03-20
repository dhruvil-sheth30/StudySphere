import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { FaUser, FaLock, FaIdCard } from "react-icons/fa";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto mt-16'>
			<div className='w-full p-8 rounded-lg shadow-lg bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg'>
				<h1 className='text-4xl font-bold text-center text-gray-100 mb-8'>
					Join <span className='text-blue-500'>StudySphere</span> Today
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="relative">
						<label className='block text-gray-300 text-sm font-medium mb-2'>
							Full Name
						</label>
						<div className="flex items-center">
							<span className="absolute left-3 text-gray-400">
								<FaIdCard />
							</span>
							<input
								type='text'
								placeholder='John Doe'
								className='w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={inputs.fullName}
								onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
							/>
						</div>
					</div>

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
								placeholder='johndoe'
								className='w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={inputs.username}
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
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
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
						</div>
					</div>

					<div className="relative">
						<label className='block text-gray-300 text-sm font-medium mb-2'>
							Confirm Password
						</label>
						<div className="flex items-center">
							<span className="absolute left-3 text-gray-400">
								<FaLock />
							</span>
							<input
								type='password'
								placeholder='Confirm Password'
								className='w-full bg-gray-700 bg-opacity-50 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={inputs.confirmPassword}
								onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className='block text-gray-300 text-sm font-medium mb-2'>
							Gender
						</label>
						<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
					</div>

					<div className="flex items-center justify-between mt-4">
						<Link
							to='/login'
							className='text-blue-400 hover:underline text-sm'
						>
							Already have an account?
						</Link>
						<Link to='/' className='text-gray-400 hover:underline text-sm'>
							Back to home
						</Link>
					</div>

					<button 
						className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center mt-4' 
						disabled={loading}
					>
						{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
					</button>
				</form>
			</div>
		</div>
	);
};
export default SignUp;


