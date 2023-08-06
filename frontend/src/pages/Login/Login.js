import { useEffect, useState, useRef } from "react";
import LoginCSS from "./Login.module.css";
import { useLoginMutation } from "../../features/auth/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const passwordRef = useRef();
  const emailRef = useRef();

  const [errorMsg, setErrorMsg] = useState();

  const [login, { isSuccess, isError, error }] = useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (!passwordRef.current.value || !emailRef.current.value) {
      setErrorMsg(error.message || "Email or password is missing");
    } else {
      login({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      setErrorMsg(null);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className={LoginCSS.loginForm}>
      <h2>Log in to EduPage</h2>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" ref={emailRef} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" ref={passwordRef} />
      </div>
      <button className={LoginCSS.loginButton} type="submit">
        Login
      </button>
      {isError && (
        <div className={LoginCSS.errorText}>
          {error?.data?.message || error?.error}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </div>
      )}
    </form>
  );
};

export default Login;
