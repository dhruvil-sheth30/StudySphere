import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto hidden md:block'>
			{!loading ? (
				<div className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-2 rounded" onClick={logout}>
					<BiLogOut className='w-6 h-6 text-white' />
					<span className="text-white text-sm">Logout</span>
				</div>
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;
