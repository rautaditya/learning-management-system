import { Routes } from "react-router-dom";
import { StudentRoutes } from "./routes/StudentRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { SuperadminRoutes } from "./routes/SuperadminRoutes";
import { CommonRoutes } from "./routes/CommonRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {StudentRoutes()}
        {AdminRoutes()}
        {SuperadminRoutes()}
        {CommonRoutes()}
      </Routes>
    </>
  );
}

export default App;
