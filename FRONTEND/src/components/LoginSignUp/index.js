import { useNavigate } from "react-router-dom";

export default function LoginSignUp() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
      <div className="flex flex-col space-y-2 gap-2">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
