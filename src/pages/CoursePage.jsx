import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChakraProvider, Box, Text, Flex, Button, Grid, GridItem, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Header from "../components/Header";
import { getCourseById } from "../services/courseServices";
import { useAuth } from "../context/AuthContext";
import theme from "../theme/theme";
import CourseBanner from "../components/CourseBanner";

const CoursePage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { success, course, message } = await getCourseById(courseId);
                if (success) {
                    setCourse({
                        ...course,
                        CLOs: JSON.parse(course.CLOs), // Parse CLOs JSON string
                        tags: JSON.parse(course.tags), // Parse tags JSON string
                    });
                } else {
                    setError(message);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching the course.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) {
        return <div>Loading...</div>; // Replace with spinner if needed
    }

    if (error) {
        return <div>Error: {error}</div>; // Handle error UI
    }

    return (
        <ChakraProvider theme={theme}>
            <Header />
            <CourseBanner courseData={course} user={user} />
            <Box mx="auto" maxW="80%" mb={4}>
                <Text fontSize="3xl" fontWeight="bold" mb={4} fontFamily="Georgia, serif">
                    What you will Learn
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    {course.CLOs.map((clo, index) => (
                        <GridItem key={index}>
                            <Flex align="center">
                                <Icon as={CheckIcon} color="black" />
                                <Text fontSize="lg" ml={2}>{clo}</Text>
                            </Flex>
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        </ChakraProvider>
    );
};

export default CoursePage;