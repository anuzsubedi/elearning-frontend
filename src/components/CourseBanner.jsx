import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Button, Image, useToast } from "@chakra-ui/react";
import ShapeImage from "../assets/Shape.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { enrollUser, getEnrollmentsByUser } from "../services/enrollmentServices";

const CourseBanner = ({ courseData }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (user) {
                const { success, enrollments } = await getEnrollmentsByUser();
                if (success) {
                    const enrolled = enrollments.some(enrollment => enrollment.course_id === courseData.course_id);
                    setIsEnrolled(enrolled);
                }
            }
        };

        checkEnrollment();
    }, [user, courseData.course_id]);

    const handleCallback = async () => {
        if (!user) {
            toast({
                title: "Authentication required.",
                description: "You must be logged in to enroll.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (isEnrolled) {
            navigate(`/course/${courseData.course_id}/learning`);
            return;
        }

        if (user.user_type === "Instructor") {
            navigate(`/edit-course/${courseData.course_id}`);
            return;
        }

        const enrollmentData = {
            user_id: user.id,
            course_id: courseData.course_id,
            amount_paid: courseData.course_price,
        };

        const { success, message } = await enrollUser(enrollmentData);

        if (success) {
            toast({
                title: "Enrollment successful.",
                description: "You have been enrolled in the course.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/");
        } else {
            toast({
                title: "Enrollment failed.",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            bg="#fd856c"
            border="2px solid"
            borderColor="black"
            borderRadius="8px"
            p={6}
            mb={6}
            mx="auto"
            maxW="85%"
        >
            <Flex justify="space-between" align="center">
                <Box flex="1" mr={6} ml={20}>
                    <Text fontSize="4xl" fontWeight="bold" color="white" fontFamily="Georgia" mb={2}>
                        {courseData.course_name}
                    </Text>
                    <Text fontSize="lg" color="white" mb={4}>
                        {courseData.course_description}
                    </Text>
                    <Text fontSize="lg" color="white">
                        <Text as="span" fontWeight="bold">Instructor:</Text> {courseData.instructor_name}
                    </Text>
                    <Text fontSize="lg" color="white" mt={2} fontWeight="bold">
                        ${courseData.course_price} | {courseData.course_type === "Full Access" ? "Life Time Access" : courseData.course_type}
                    </Text>
                    <Button
                        colorScheme="orange"
                        variant="solid"
                        mt={4}
                        border="2px solid black"
                        size="lg"
                        borderRadius="16px"
                        fontSize="2xl"
                        py={8}
                        px={12}
                        onClick={handleCallback}
                    >
                        {isEnrolled ? "Go to Course" : user?.user_type === "Instructor" ? "Manage Course" : "Enroll Now"}
                    </Button>
                </Box>
                <Box flex="0 0 30%">
                    <Image src={ShapeImage} alt="Shape" borderRadius="8px" opacity={0.5} />
                </Box>
            </Flex>
        </Box>
    );
};

export default CourseBanner;