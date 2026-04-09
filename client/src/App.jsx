import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { setUserData } from "./redux/userSlice";

export const serverUrl = "http://localhost:3000";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/users/current-user", {
          withCredentials: true,
        });
        console.log(result.data.user);
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.log("error getting user");
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App;
