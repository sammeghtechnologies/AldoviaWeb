import { Suspense, lazy } from "react";
import AssetLoader from "./AssetLoader";
import FeatherLoader from "./components/FeatherLoader";
import { useLoader } from "./context/LoaderProvider";

const TestLandingPage = lazy(() => import("./TestLandingPage"));

const App = () => {
  const { ready, assets } = useLoader();

  // Log State of App
  console.log("Ready ", ready);
  console.log("assets ", assets);

  return (
    <>
      {/* <FeatherCursor/> */}
      {!ready && <AssetLoader />}
      {!ready && <FeatherLoader/>}
      {ready && (
        <Suspense fallback={null}>
          <TestLandingPage />
        </Suspense>
      )}
    </>
  );
};

export default App;
