import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Singin() {
  const { error, currentUser, loading } = useSelector((state) => state.user);
  // const  = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await axios.post(`/api/v1/auth/signin`, { ...formData });
      setData(res);
      // console.log(res.data);
      dispatch(signInSuccess(res.data.user));

      navigate("/ ");
    } catch (e) {
      console.log(e);
      dispatch(signInFailure(e.response.data.message));
    }
    // console.log("user current ", currentUser);
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <input
            autoComplete="off"
            type="email"
            placeholder="Ex@example.com"
            className="border p-3  rounded-lg"
            id="email"
            style={{
              textTransform: "lowercase",
            }}
            onChange={handlechange}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3  rounded-lg"
            id="password"
            onChange={handlechange}
          />

          <button
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? <>loading.....</> : <>SignIn</>}
          </button>
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have a account?</p>
        <NavLink to="/sign-up">
          <span className="text-blue-500">SignUp</span>
        </NavLink>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
