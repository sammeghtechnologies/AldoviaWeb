import { BrowserRouter as Router, Route, Routes } from "react-router";
// We import ProjectRoot instead of the deleted TestPage
import ProjectRoot from "../ProjectRoot"; 
import Error404 from "../404"; 
import HeroPage from "../components/pages/home/HeroPage";
import VenuesHeroPage from "../components/pages/venues/HeroPage";
import RoomsPage from "../components/pages/rooms/RoomsPage";
import ExperiencesPackagesPage from "../components/pages/experiencespackages/ExperiencesPackagesPage";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* The main path "/" now loads your actual App */}
        <Route path="/" element={<ProjectRoot />} />

        {/* You can keep these if you want alternate links to the same app, 
            or delete them if they were just for testing */}
        <Route path="/bubble" element={<ProjectRoot />} />
        <Route path="/home" element={<HeroPage />} />
        <Route path="/venues" element={<VenuesHeroPage />} />
        <Route path="/rooms" element={<RoomsPage/>}/>
        <Route path="/experiences-packages" element={<ExperiencesPackagesPage/>}/>  

        {/* 404 Page for unknown routes */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
};

const AppRouter = () => {
  return <AppRoutes />;
};

export default AppRouter;
