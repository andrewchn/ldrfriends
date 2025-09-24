import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      {!user ? (
        <>
          {showSignup ? (
            <>
              <Signup onSignup={(u) => setUser(u)} />
              <p>
                Already have an account?{" "}
                <button onClick={() => setShowSignup(false)}>Login</button>
              </p>
            </>
          ) : (
            <>
              <Login onLogin={(u) => setUser(u)} />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setShowSignup(true)}>Sign Up</button>
              </p>
            </>
          )}
        </>
      ) : (
        <div>
          <h2>Welcome, {user.username}</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      )}
    </div>
  );
}
