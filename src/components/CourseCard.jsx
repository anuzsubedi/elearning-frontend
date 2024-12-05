import React, { useState, useEffect } from "react";
import { Box, Image, Heading, Text, IconButton, Skeleton, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Button, HStack } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { getImage } from "../services/imageService"; // Import the image service


const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            // Only fetch image if image_id exists
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

        // Clean up the URL object to prevent memory leaks
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [course.image_id]);

    const handleEdit = () => {
        navigate(`/edit-course/${course.course_id}`);
    };

    const handleDelete = () => {
        // Handle delete logic
    }

    const handleListChapters = () => {
        navigate(`/course/${course.course_id}/editchapters`);
    }

    return (
        <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.005)" }}
            position="relative"
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
                <Text color="gray.500" fontSize="sm" mb={4}>
                    {new Date(course.created_at).toLocaleDateString()}
                </Text>
            </Box>

            <Popover trigger="hover">
                <PopoverTrigger>
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="brand.primary"
                        size="sm"
                        position="absolute"
                        top="10px"
                        right="10px"
                        aria-label="Edit Course"
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Actions</PopoverHeader>
                    <PopoverBody>
                        <HStack spacing={4}>
                            <Button
                                leftIcon={<EditIcon />}
                                bg="brand.primary"
                                color="white"
                                size="sm"
                                onClick={handleEdit}
                                _hover={{ bg: "brand.secondary" }}
                            >
                                Edit
                            </Button>
                            <Button
                                leftIcon={<DeleteIcon />}
                                bg="brand.error"
                                color="white"
                                size="sm"
                                onClick={handleDelete}
                                _hover={{ bg: "red.600" }}
                            >
                                Delete
                            </Button>
                            <Button
                                leftIcon={<ViewIcon />}
                                bg="brand.primary"
                                color="white"
                                size="sm"
                                onClick={handleListChapters}
                                _hover={{ bg: "brand.secondary" }}
                            >
                                Chapters
                            </Button>
                        </HStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default CourseCard;