import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Center, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";
import StudentCourseCard from "../components/StudentCourseCard"; // Import the StudentCourseCard component
import { getAllCourses } from "../services/courseServices"; // Import the getAllCourses service
import bookImage from "../assets/book.png";
import YourCourses from "../components/YourCourses";

const StudentHome = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await getAllCourses(); // Fetch all courses

                if (result.success) {
                    setCourses(result.courses);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Box>
            <Header />
            <Banner
                header="Welcome, Student!"
                description="Explore courses, view assignments, and much more!"
                image={bookImage}
            />
            <YourCourses />
            <Center py={10} px={6}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text color="red.500">{error}</Text>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                        {courses.map(course => (
                            <StudentCourseCard key={course.course_id} course={course} />
                        ))}
                    </SimpleGrid>
                )}
            </Center>
        </Box>
    );
};

export default StudentHome;