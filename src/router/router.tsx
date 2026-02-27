import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import RoomsPage from "../components/pages/rooms/RoomsPage";

const ProjectRoot = lazy(() => import("../ProjectRoot"));
const Error404 = lazy(() => import("../404"));
const HeroPage = lazy(() => import("../components/pages/home/HeroPage"));
const VenuesHeroPage = lazy(() => import("../components/pages/venues/HeroPage"));
const ActivitiesHeroPage = lazy(() => import("../components/pages/activities/HeroPage"));
const DiningHeroPage = lazy(() => import("../components/pages/dining/HeroPage"));
const ExperienceHeroPage = lazy(() => import("../components/pages/experience/HeroPage"));

const RouteFallback = <div className="min-h-screen w-full bg-black" />;

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={RouteFallback}>
        <Routes>
          {/* The main path "/" now loads your actual App */}
          <Route path="/" element={<ProjectRoot />} />

        {/* You can keep these if you want alternate links to the same app, 
            or delete them if they were just for testing */}
          <Route path="/bubble" element={<ProjectRoot />} />
          <Route path="/home" element={<HeroPage />} />
          <Route path="/rooms" element={<RoomsPage/>} />
          <Route path="/venues" element={<VenuesHeroPage />} />
          <Route path="/activities" element={<ActivitiesHeroPage />} />
          <Route path="/dining" element={<DiningHeroPage />} />
          <Route path="/experience" element={<ExperienceHeroPage />} />
          <Route path="/experince" element={<ExperienceHeroPage />} />

        {/* 404 Page for unknown routes */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const AppRouter = () => {
  return <AppRoutes />;
};

export default AppRouter;
