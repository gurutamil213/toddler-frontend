import { useEffect, useState } from "react";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginImage from "./css/img/login/20944201.jpg";
import "./css/image-loading.css";

const Login = () => {
  const [state, setState] = useState({
    uname: "",
    pwd: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { uname, pwd } = state;
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Login page Opened");
  }, []);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setIsImageLoading(false);
    image.onerror = () => setIsImageLoading(false);
    image.src = loginImage;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, []);

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
        <div
          className="left"
          style={{ backgroundImage: `url("${loginImage}")` }}
        >
          {isImageLoading && (
            <div className="left_image_loading" role="status" aria-label="Loading login image">
              <span className="image_loading_ring" aria-hidden="true" />
            </div>
          )}
        </div>

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