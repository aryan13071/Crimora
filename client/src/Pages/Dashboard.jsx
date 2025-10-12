import React from "react";
import Navbar from "../Components/Navbar";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Services from "./Services";
import { Routes , Route} from "react-router-dom";
import Cards from "../Components/Cards"
import Analytics from "../Assets/Analytics.png";
import Contribution from "../Assets/Contribution.png"
import ReportCrime from "../Assets/ReportCrime.png"
import TrackUrPath from "../Assets/TrackUrPath.png"
function Dashboard(){

    return (
        <>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
        
        </>
    );

}

export default Dashboard ;