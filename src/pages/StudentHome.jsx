import React, { useState, useEffect } from "react";
import { Box, Text, Center, SimpleGrid } from "@chakra-ui/react";

import Header from "../components/Header";
import Banner from "../components/Banner";
import StudentCourseCard from "../components/StudentCourseCard"; // Import the StudentCourseCard component
import { getAllCourses } from "../services/courseServices"; // Import the getAllCourses service
import bookImage from "../assets/book.png";
import YourCourses from "../components/YourCourses";
import Footer from "../components/Footer";
import Recommendations from "../components/Recommendations";

const StudentHome = () => {
    return (
        <Box>
            <Header />
            <Banner
                header="Welcome, Student!"
                description="Explore courses, view assignments, and much more!"
                image={bookImage}
            />
            <YourCourses />
            <Recommendations />
            <Footer />
        </Box>
    );
};

export default StudentHome;