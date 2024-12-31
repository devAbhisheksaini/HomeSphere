import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import {
  signInStart,
  signInEnd,
  signInFailure,
  signInSuccess,
  endloading,
} from "../redux/user/userSlice";
import axios from "axios";
// if we make a button on under form or make not to call submit then make a type of a button
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const handleGoogleClick = async () => {
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const res = await axios.post(`/api/v1/auth/google`, {
        username: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      });
      dispatch(signInSuccess(res.data.user));
      navigate("/");

      // console.log(res);
    } catch (err) {
      dispatch(endloading());
      console.log("error with try to login with google ", err);
    }
  };
  return (
    <div>
      <button
        onClick={handleGoogleClick}
        type="button"
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-full"
      >
        COntinue to gooogle
      </button>
    </div>
  );
};

export default OAuth;
