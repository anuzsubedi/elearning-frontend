import React, { useState, useEffect } from "react";
import { Box, Image, Heading, Text, Progress, Skeleton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getImage } from "../services/imageService";

const EnrolledCourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (course.image_id) {
                try {
                    const result = await getImage(course.image_id);
                    if (result.success) {
                        setImageUrl(result.imageUrl);
                    } else {
                        setImageError(true);
                    }
                } catch (error) {
                    setImageError(true);
                } finally {
                    setImageLoading(false);
                }
            } else {
                setImageLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [course.image_id]);

    const handleView = () => {
        // Navigate to course details page
        navigate(`/course/${course.course_id}`);
    };

    return (
        <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.005)" }}
            position="relative"
            onClick={handleView}
            cursor="pointer"
        >
            {imageLoading ? (
                <Skeleton height="150px" width="100%" />
            ) : imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={course.course_name}
                    w="100%"
                    h="150px"
                    objectFit="cover"
                />
            ) : (
                <Box
                    h="150px"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text color="gray.500">No Image Available</Text>
                </Box>
            )}

            <Box p={4}>
                <Heading as="h3" size="md" mb={2}>
                    {course.course_name}
                </Heading>
                <Text color="gray.500" fontSize="sm" mb={2}>
                    Instructor: {course.instructor_name}
                </Text>
                <Text color="gray.500" fontSize="sm" mb={2}>
                    Enrolled on: {new Date(course.created_at).toLocaleDateString()}
                </Text>
                <Text color="gray.500" fontSize="sm" mb={4}>
                    Progress: 10% completed
                </Text>
                <Progress value={10} size="sm" colorScheme="red" />
            </Box>
        </Box>
    );
};

export default EnrolledCourseCard;