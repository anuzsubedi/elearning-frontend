import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";
import CourseCard from "../components/CourseCard";
import { getInstructorCourses } from "../services/courseServices";
import bookImage from "../assets/book.png";

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
        <Box>
            <Header />
            <Banner
                header="Start Teaching Today!"
                description="Impart your knowledge and inspire the next generation. Share your expertise, create impactful lessons, and shape future innovators!"
                image={bookImage}
            />
            <Box py={6} px={4}>
                <Heading as="h2" size="lg" mb={4}>
                    Your Courses
                </Heading>
                <Button colorScheme="orange" onClick={handleCreateCourse} mb={6}>
                    Add New Course
                </Button>

                {loading && <Text>Loading...</Text>}

                {error && (
                    <VStack spacing={4} color="red.500">
                        <Text>Error: {error}</Text>
                        <Button onClick={() => setError(null)}>Try Again</Button>
                    </VStack>
                )}

                {!loading && !error && courses.length === 0 && (
                    <Text>No courses found. Create your first course!</Text>
                )}

                {courses.length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                        {courses.map((course) => (
                            <CourseCard
                                key={course.course_id}
                                course={course}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </Box>
    );
};

export default TeacherHome;