import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Heading,
    Text,
    Button,
    SimpleGrid,
    VStack,
    Spinner,
    Center,
    Flex,
    chakra
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { getInstructorCourses } from "../services/courseServices";
import { AddIcon } from "@chakra-ui/icons";

// Create a Chakra-compatible motion component
const MotionButton = chakra(motion.button);

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await getInstructorCourses();
                if (result.success) {
                    setCourses(result.courses);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching courses.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCreateCourse = () => {
        navigate("/create-course");
    };

    // Animated button component
    const AnimatedAddButton = () => {
        return (
            <MotionButton
                variant="outline"
                colorScheme="orange"
                onClick={handleCreateCourse}
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                width="auto"
                minWidth="40px"
                height="40px"
                borderRadius="full"
                position="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    width: isHovered ? "160px" : "40px"
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                boxShadow="sm"
                _hover={{
                    bg: "orange.50"
                }}
            >
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                >
                    <AddIcon
                        mr={isHovered ? 2 : 0}
                        transition="margin 0.3s ease"
                    />
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Text whiteSpace="nowrap">
                                Add Course
                            </Text>
                        </motion.div>
                    )}
                </Flex>
            </MotionButton>
        );
    };

    return (
        <Center p={4}>
            <Flex
                direction="column"
                width="full"
                maxWidth="80%"
                p={6}
            >
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={6}
                >
                    <Heading
                        as="h2"
                        size="lg"
                    >
                        Your Courses
                    </Heading>

                    <AnimatedAddButton />
                </Flex>

                {loading && (
                    <Center height="200px">
                        <Spinner
                            size="lg"
                            color="orange.500"
                            thickness="4px"
                        />
                    </Center>
                )}

                {error && (
                    <VStack
                        spacing={4}
                        color="red.500"
                        textAlign="center"
                    >
                        <Text>Error: {error}</Text>
                        <Button
                            onClick={() => window.location.reload()}
                            colorScheme="red"
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </VStack>
                )}

                {!loading && !error && courses.length === 0 && (
                    <Center height="200px">
                        <Text
                            color="gray.500"
                            textAlign="center"
                        >
                            No courses found. Create your first course!
                        </Text>
                    </Center>
                )}

                {!loading && courses.length > 0 && (
                    <SimpleGrid
                        columns={[1, 2, 3]}
                        spacing={6}
                    >
                        {courses.map((course) => (
                            <CourseCard
                                key={course.course_id}
                                course={course}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Flex>
        </Center>
    );
};

export default TeacherCourses;