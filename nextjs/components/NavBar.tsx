import { LogInButton } from "./Navbar/ConnectButton";

const NavBar = () => {
  return (
    <div className="navbar">
      <a className="navbar-start">ClipChat</a>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <LogInButton></LogInButton>
      </div>
    </div>
  );
};

export default NavBar;
