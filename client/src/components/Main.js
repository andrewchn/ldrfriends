import React, { useEffect, useState } from "react";
import axios from "axios";
import Camera from "./Camera";

function Main({ username, onLogout }) {
  const [groupCode, setGroupCode] = useState(null);
  const [joinCode, setJoinCode] = useState(""); // new textbox for join
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000"; // backend URL

  // Fetch user's current group on mount
  useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const res = await axios.get(`${API_URL}/getusergroup`, {
          params: { username },
        });
        setGroupCode(res.data.groupCode);
      } catch (err) {
        console.error("Error fetching user group:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroup();
  }, [username]);

  const handleCreateGroup = async () => {
    try {
      const res = await axios.post(`${API_URL}/creategroup`, { username });
      setGroupCode(res.data.groupCode);
      setMessage(`Group created: ${res.data.groupCode}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating group");
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode) return setMessage("Enter a group code to join");

    try {
      const res = await axios.post(`${API_URL}/joingroup`, {
        username,
        groupCode: joinCode,
      });
      setGroupCode(res.data.groupCode);
      setMessage(res.data.message || `Joined group ${joinCode}`);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error joining group");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(`${API_URL}/leavegroup`, { username, groupCode });
      setGroupCode(null);
      setMessage("You left the group");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error leaving group");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Group Manager</h2>
      <p>
        <strong>User:</strong> {username}
      </p>

      {groupCode ? (
        <div>
          <p>
            You are in group: <strong>{groupCode}</strong>
          </p>
          <button onClick={handleLeaveGroup}>Leave Group</button>
        </div>
      ) : (
        <div>
          <button onClick={handleCreateGroup} style={{ marginRight: "10px" }}>
            Create Group
          </button>

          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Enter group code to join"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={handleJoinGroup}>Join Group</button>
          </div>
        </div>
      )}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      <Camera/>

      <button onClick={onLogout} style={{ marginTop: "30px", color: "red" }}>
        Logout
      </button>
    </div>
  );
}

export default Main;
