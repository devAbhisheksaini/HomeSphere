import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { signInStart, signInEnd, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
export default function SingUp() {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [data, setData] = useState([]);
  // const [check]
  // const [error, setError] = useState("");
  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    dispatch(signInStart());
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.log(`password does not match with confirmpassword`);
      dispatch(signInFailure(`Password not match with confirmpassword`));
      return;
    }
    try {
      // console.log(`ayas`);
      const res = await axios.post(`/api/v1/auth/signup`, { ...formData });
      setData(res);
      dispatch(signInEnd());
      navigate("/sign-in");
    } catch (e) {
      dispatch(signInFailure(e.response.data.message));
      console.log(e);
    }
    // console.log(formData);
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-3  rounded-lg"
            id="username"
            autoComplete="off"
            onChange={handlechange}
          />
          <input
            autoComplete="off"
            type="email"
            placeholder="Ex@example.com"
            className="border p-3  rounded-lg"
            id="email"
            onChange={handlechange}
            style={{
              textTransform: "lowercase",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3  rounded-lg"
            id="password"
            onChange={handlechange}
          />
          <input
            type="password"
            placeholder="confirm Password"
            className="border p-3  rounded-lg"
            id="confirmPassword"
            onChange={handlechange}
          />

          <button
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? <>loading.....</> : <>SignUp</>}
          </button>
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have a account?</p>
        <NavLink to="/sign-in">
          <span className="text-blue-500">Signin</span>
        </NavLink>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
