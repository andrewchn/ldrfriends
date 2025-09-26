import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";

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
        <Main username={user} />
      )}
    </div>
  );
}
