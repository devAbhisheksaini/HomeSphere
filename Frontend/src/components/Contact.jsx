import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Contact({ list }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        // console.log("uns", list.userRef);
        const res = await axios.get(`/api/v1/update/${list.userRef}`);
        // console.log(`res`, res.data.user);

        setLandlord(res.data.user);
      } catch (error) {
        console.log(error, "Error");
      }
    };
    fetchLandlord();
  }, [list.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">{list.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${list.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
