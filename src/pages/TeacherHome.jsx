import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, SimpleGrid, VStack, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";
import CourseCard from "../components/CourseCard";
import { getInstructorCourses } from "../services/courseServices";
import bookImage from "../assets/book.png";
import TeacherCourses from "../components/TeacherCourses";

const TeacherHome = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                console.log("Fetching courses...");
                const result = await getInstructorCourses();

                console.log("Full API Result:", result);

                if (result.success) {
                    console.log("Courses received:", result.courses);
                    setCourses(result.courses);
                } else {
                    console.error("API returned error:", result.message);
                    setError(result.message);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred while fetching courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCreateCourse = () => {
        navigate("/create-course");
    };

    return (
        <Box
        >
            <Header />
            <Banner
                header="Start Teaching Today!"
                description="Impart your knowledge and inspire the next generation. Share your expertise, create impactful lessons, and shape future innovators!"
                image={bookImage}
            />
            <TeacherCourses />
        </Box>
    );
};

export default TeacherHome;