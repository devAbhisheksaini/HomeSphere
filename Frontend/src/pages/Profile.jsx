import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  signInEnd,
} from "../redux/user/userSlice";

export default function Profile() {
  const [userUpdatecheck, setUserUpdatecheck] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  // console.log(file);
  const [filepercentage, setFilepercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const usedispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  // console.log(formData.avatar, "upload");
  const [showListingError, setShowListingError] = useState(false);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilepercentage(Math.round(progress));
        // console.log(`Upload is ${progress} done`);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handlechange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      usedispatch(updateUserStart());
      const res = await axios.post(
        `/api/v1/update/updateProfile/${currentUser._id}`,
        { ...formData }
      );
      // dispatch(signInSuccess(res.data.user));
      usedispatch(updateUserSuccess(res.data.updatedUser));
      setUserUpdatecheck(true);
      // console.log(currentUser, "after update");
    } catch (e) {
      console.log(e);
      usedispatch(updateUserFailure(e.message));
    }
  };
  const handledelete = async (e) => {
    e.preventDefault();
    try {
      usedispatch(updateUserStart());
      // console.log("handledelete");
      const res = await axios.delete(
        `/api/v1/update/delete/${currentUser._id}`
      );
      // console.log(`deleted`);
      usedispatch(updateUserSuccess(null));
      navigate("/");
    } catch (e) {
      console.log(e, "Error deleteing profile");
      usedispatch(updateUserFailure(e.message));
    }
  };

  const handleSignout = async () => {
    try {
      await axios.get(`/api/v1/auth/signout`);
      usedispatch(updateUserSuccess(null));
      navigate("/");
    } catch (e) {
      console.log(e, "Error signout profile");
      usedispatch(updateUserFailure(e.message));
    }
  };
  const [listing, setListing] = useState([]);
  const handleShowListing = async () => {
    try {
      setShowListingError(``);
      const res = await axios.get(`/api/v1/update/listings/${currentUser._id}`);
      setListing(res.data.listings);
      // console.log(listing);
    } catch (e) {
      setShowListingError(`${e.message}`);
    }
  };
  const handleDeleteListing = async (list) => {
    try {
      // console.log("list", list);
      const res = await axios.delete(`/api/v1/listing/delete/${list}`);
      // console.log(res);
      handleShowListing();
    } catch (e) {
      console.log(`Error deleting listing ${e}`);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={filepercentage === 100 ? formData.avatar : currentUser.avatar}
          alt="avatar image.."
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image upload</span>
          ) : filepercentage > 0 && filepercentage < 100 ? (
            <span className="text-slate-700">{`Image Uploading${filepercentage}%`}</span>
          ) : filepercentage == 100 ? (
            <span className="text-green-700">Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="UserName"
          defaultValue={currentUser.username}
          id="username"
          onChange={handlechange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {" "}
          {loading ? "loading..." : "Update"}
        </button>
        <NavLink
          to="/create-Listing"
          className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          Create Linsting
        </NavLink>
      </form>
      <div className="flex flex-row justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handledelete}>
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {userUpdatecheck ? "User Update Successfully" : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListing}>
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? showListingError : ""}
      </p>
      {listing.length > 0 && (
        <h1 className="text-center my-7 text-3xl font-semibold">
          Your Listing
        </h1>
      )}
      {listing &&
        listing.length > 0 &&
        listing.map((list) => {
          return (
            <div
              key={list._id}
              className=" p-3 gap-4 flex justify-between items-center border rounded-lg"
            >
              <NavLink to={`/listing/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt=""
                  className="h-16 w-16 object-contain "
                />
              </NavLink>
              <NavLink
                to={`/listing/${list._id}`}
                className="font-semibold text-slate-700 flex-1 hover:underline truncate"
              >
                <p>{list.name}</p>
              </NavLink>
              <div className="flex flex-col items-center">
                <button
                  className="text-red-700 uppercase"
                  onClick={() => handleDeleteListing(list._id)}
                >
                  Delete
                </button>
                <NavLink
                  to={`/update-Listing/${list._id}`}
                  className="text-green-700 uppercase"
                >
                  Edit
                </NavLink>
              </div>
            </div>
          );
        })}
    </div>
  );
}
