import { RouterProvider } from "react-router-dom";
import router from "../../router_utils/Router";
import Background from "../background_process/Background";

const App = () => {
  return (
    <>
      <Background />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
