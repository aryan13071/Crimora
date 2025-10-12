import React from "react";
import Cards from "../Components/Cards";
import Analytics from "../Assets/Analytics.png";
import Contribution from "../Assets/Contribution.png";
import ReportCrime from "../Assets/ReportCrime.png";
import TrackUrPath from "../Assets/TrackUrPath.png";

function Home() {
  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-6 p-6 bg-gray-100 min-h-screen">
        <Cards task="Track Your Path" img={TrackUrPath} />
        <Cards task="Report a Crime" img={ReportCrime} />
        <Cards task="View Analytics" img={Analytics} />
        <Cards task="Your Contribution" img={Contribution} />
      </div>
    </>
  );
}

export default Home;
