import React, { useState, useEffect } from "react";
import { Box, Heading, Grid, Text } from "@chakra-ui/react";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { getCourseByStudentId } from "../services/studentCourseService";
import { useAuth } from "../context/AuthContext";

const YourCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourseByStudentId(user.id);
                if (response.success) {
                    setCourses(Array.isArray(response.course) ? response.course : [response.course]);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching your courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user.id]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <Box mx="auto" maxW="80%" mt={8}>
            <Heading as="h1" size="xl" mb={6} fontFamily="Georgia, serif">
                Your Courses
            </Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <EnrolledCourseCard key={course.course_id} course={course} />
                    ))
                ) : (
                    <Text>No courses found.</Text>
                )}
            </Grid>
        </Box>
    );
};

export default YourCourses;