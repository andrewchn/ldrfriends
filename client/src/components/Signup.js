import { useState } from "react";
import axios from "axios";

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/signup", form);
      onSignup(res.data.username);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error signing up");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}
