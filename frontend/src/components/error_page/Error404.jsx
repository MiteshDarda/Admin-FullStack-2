import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div>
      <div>404 Not Found</div>
      <Link to="/login">Go Back To Signin</Link>
    </div>
  );
}
