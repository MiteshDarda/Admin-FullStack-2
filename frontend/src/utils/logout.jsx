const Logout = (navigate) => {
  localStorage.clear();
  navigate("/login");
};

export default Logout;
