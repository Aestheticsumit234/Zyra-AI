import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import FeaturesPage from "./pages/Feature";
import Home from "./pages/Home";
import InterviewPage from "./pages/InterviewPage";
import Pricing from "./pages/Pricing";
import { setUserData } from "./redux/userSlice";
import MainLayout from "./utils/Layout";

export const serverUrl = "http://localhost:3000";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/users/current-user", {
          withCredentials: true,
        });
        // console.log(result.data.user);
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
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default App;
