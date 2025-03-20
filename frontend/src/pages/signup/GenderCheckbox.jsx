import { FaMars, FaVenus } from 'react-icons/fa';

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className='flex gap-4'>
			<label 
				className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
					selectedGender === "male" 
						? "bg-blue-500 text-white" 
						: "bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600"
				}`}
				onClick={() => onCheckboxChange("male")}
			>
				<FaMars className="text-xl" />
				<span className="font-medium">Male</span>
				<input
					type='checkbox'
					className='hidden'
					checked={selectedGender === "male"}
					onChange={() => onCheckboxChange("male")}
				/>
			</label>
			
			<label 
				className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
					selectedGender === "female" 
						? "bg-pink-500 text-white" 
						: "bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-gray-600"
				}`}
				onClick={() => onCheckboxChange("female")}
			>
				<FaVenus className="text-xl" />
				<span className="font-medium">Female</span>
				<input
					type='checkbox'
					className='hidden'
					checked={selectedGender === "female"}
					onChange={() => onCheckboxChange("female")}
				/>
			</label>
		</div>
	);
};
export default GenderCheckbox;


