import React, { useState, useEffect } from "react";
import { Box, Heading, Grid, Text } from "@chakra-ui/react";
import StudentCourseCard from "./StudentCourseCard";
import { getAllCourses } from "../services/courseServices";
import { getEnrollmentsByUser } from "../services/enrollmentServices";

const Recommendations = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Fetch all courses and user enrollments in parallel
                const [coursesResponse, enrollmentsResponse] = await Promise.all([
                    getAllCourses(),
                    getEnrollmentsByUser()
                ]);

                if (coursesResponse.success && enrollmentsResponse.success) {
                    // Get array of enrolled course IDs
                    const enrolledCourseIds = enrollmentsResponse.enrollments.map(
                        enrollment => enrollment.course_id
                    );

                    // Filter out enrolled courses
                    const recommendedCourses = coursesResponse.courses.filter(
                        course => !enrolledCourseIds.includes(course.course_id)
                    );

                    setCourses(recommendedCourses);
                } else {
                    setError(coursesResponse.message || enrollmentsResponse.message);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching recommendations.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <></>;
    }

    return (
        <Box mx="auto" maxW="80%" mt={8} mb={8}>
            <Heading as="h1" size="xl" mb={6} fontFamily="Georgia, serif">
                Recommended Courses
            </Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <StudentCourseCard key={course.course_id} course={course} />
                    ))
                ) : (
                    <Text>No recommendations available.</Text>
                )}
            </Grid>
        </Box>
    );
};

export default Recommendations;