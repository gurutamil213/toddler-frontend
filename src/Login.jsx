import { useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState({
    uname: "",
    pwd: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const { uname, pwd } = state;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsVisible(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (uname === "bala" && pwd === "guru") {
      sessionStorage.setItem("isLoggedIn", "true");

      navigate("/Edit");
      toast.success("Edit Page Opened");
    } else {
      toast.error("Incorrect Identifiers");
    }
  };

  const handleBack = () => {
    navigate("/");
    toast.success("Dashboard Page Opened");
  };

  return (
    <form onSubmit={handleSubmit} className="login_outer">
      <div className="inner">
        <div className="left"></div>

        <div className="right">
          <h1>Log In</h1>

          <label htmlFor="u_name">User Name</label>

          <input
            type="text"
            name="uname"
            value={uname}
            onChange={handleChange}
            id="u_name"
            placeholder="Enter User Name"
          />

          <label htmlFor="pwd">Password</label>

          <input
            type={isVisible ? "text" : "password"}
            name="pwd"
            value={pwd}
            onChange={handleChange}
            id="pwd"
            autoComplete="current-password"
            placeholder="Enter Password"
          />

          <div id="cb">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={handleCheckboxChange}
              id="s_pwd"
            />

            <label htmlFor="s_pwd" id="ls_pwd">
              Show Password
            </label>
          </div>

          <div className="btns">
            <button type="submit" id="login">
              Login
            </button>

            <button
              type="button"
              id="back"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;