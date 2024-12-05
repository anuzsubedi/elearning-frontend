import React, { useState, useEffect } from "react";
import {
    Box,
    Image,
    Heading,
    Text,
    IconButton,
    Skeleton,
    VStack,
    Flex,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast
} from "@chakra-ui/react";
import {
    EditIcon,
    DeleteIcon,
    ViewIcon
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { getImage } from "../services/imageService";
import { deleteCourse } from "../services/courseServices";

const CourseCard = ({ course, onCourseDeleted }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (!course.image_id) {
                setImageLoading(false);
                return;
            }

            try {
                const result = await getImage(course.image_id);
                if (result.success) {
                    setImageUrl(result.imageUrl);
                }
            } catch (error) {
                toast({
                    title: "Image Load Error",
                    description: "Failed to load course image",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            } finally {
                setImageLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [course.image_id, toast]);

    const handleEdit = () => {
        navigate(`/edit-course/${course.course_id}`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteCourse(course.course_id);
            if (result.success) {
                toast({
                    title: "Course Deleted",
                    description: `${course.course_name} has been successfully deleted`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
                onCourseDeleted?.(course.course_id);
                onDeleteModalClose();
            } else {
                toast({
                    title: "Delete Failed",
                    description: result.message || "Unable to delete the course",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            }
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: "An unexpected error occurred",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleListChapters = () => {
        navigate(`/course/${course.course_id}/editChapters`);
    };

    return (
        <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
                transform: "scale(1.02)",
                boxShadow: "lg"
            }}
            position="relative"
            group
        >
            {/* Image Section */}
            {imageLoading ? (
                <Skeleton height="200px" width="100%" />
            ) : imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={course.course_name}
                    w="100%"
                    h="200px"
                    objectFit="cover"
                    transition="transform 0.3s"
                    _groupHover={{ transform: "scale(1.05)" }}
                />
            ) : (
                <Flex
                    h="200px"
                    bg="gray.100"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text color="gray.500">No Image Available</Text>
                </Flex>
            )}

            {/* Content Section */}
            <VStack
                align="stretch"
                spacing={2}
                p={4}
            >
                <Heading
                    as="h3"
                    size="md"
                    noOfLines={2}
                    color="gray.800"
                >
                    {course.course_name}
                </Heading>
                <Text
                    color="gray.500"
                    fontSize="sm"
                >
                    Created on {new Date(course.created_at).toLocaleDateString()}
                </Text>
            </VStack>

            {/* Action Buttons */}
            <Flex
                position="absolute"
                top={2}
                right={2}
                gap={2}
            >
                <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="solid"
                    size="sm"
                    aria-label="Edit Course"
                    onClick={handleEdit}
                    boxShadow="md"
                    _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "lg"
                    }}
                />
                <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="solid"
                    size="sm"
                    aria-label="Delete Course"
                    onClick={onDeleteModalOpen}
                    boxShadow="md"
                    _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "lg"
                    }}
                />
                <IconButton
                    icon={<ViewIcon />}
                    colorScheme="green"
                    variant="solid"
                    size="sm"
                    aria-label="View Chapters"
                    onClick={handleListChapters}
                    boxShadow="md"
                    _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "lg"
                    }}
                />
            </Flex>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Course</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete the course "{course.course_name}"?
                        This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={onDeleteModalClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            isLoading={isDeleting}
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CourseCard;