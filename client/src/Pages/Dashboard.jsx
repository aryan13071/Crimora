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
import Track from "./Track";
import Analyse from "./Analyse";
import Contribute from "./Contribute";
import Report from "./Report";
import MapPage from "./Map"
import SignUp from "./SignUp";
import LogIn from "./LogIn"
function Dashboard(){

    return (
        <>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track" element ={<Track/>} />
            <Route path="/analyse" element ={<Analyse/>} />
            <Route path="/contribute" element ={<Contribute/>} />
            <Route path="/report" element ={<Report/>} />
            <Route path="/map" element ={<MapPage/>} />
            <Route path="/signUp" element={<SignUp/>}/>
            <Route path="/logIn" element={<LogIn/>}/>
        </Routes>
        
        </>
    );

}

export default Dashboard ;