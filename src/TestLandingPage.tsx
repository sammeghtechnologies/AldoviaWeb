import MainCanvas from "./MainCanvas";

const TestLandingPage = () => {
  return (
    <main className="relative w-full bg-black">
      
      {/* The Permanent 3D Layer */}
      <MainCanvas />

      {/* THE SCROLL CONTENT 
          This invisible div creates the height needed for the scrollbar.
          We will use this height to drive all animations.
      */}
      <div className="relative z-20 w-full" style={{ height: "20000px" }}>
        {/* UI Elements (Logo, Text, Menus) can be placed here 
            so they scroll over the 3D background.
        */}
      </div>
    </main>
  );
};

export default TestLandingPage;