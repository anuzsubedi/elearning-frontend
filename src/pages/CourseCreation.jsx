import React, { useState } from "react";
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Button,
    VStack,
    HStack,
    IconButton,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { createCourse } from "../services/courseServices";
import { uploadImage } from "../services/imageService"; // Import image upload service
import { useNavigate } from "react-router-dom";

const CourseCreationForm = () => {
    const [formData, setFormData] = useState({
        course_name: "",
        course_description: "",
        difficulty: "Beginner",
        difficulty_description: "",
        course_type: "Full Access",
        course_price: "",
    });
    const [CLOs, setCLOs] = useState([""]); // Start with one CLO field
    const [imageFile, setImageFile] = useState(null); // Store the selected image file
    const [imageId, setImageId] = useState(null); // Store the uploaded image ID
    const [isUploading, setIsUploading] = useState(false); // Track image upload status
    const toast = useToast();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/teacher-home");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCLOChange = (index, value) => {
        const updatedCLOs = [...CLOs];
        updatedCLOs[index] = value;
        setCLOs(updatedCLOs);
    };

    const addCLOField = () => {
        if (CLOs.length < 5) {
            setCLOs([...CLOs, ""]);
        }
    };

    const removeCLOField = (index) => {
        const updatedCLOs = CLOs.filter((_, i) => i !== index);
        setCLOs(updatedCLOs);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadCourseImage = async () => {
        if (!imageFile) {
            toast({
                title: "Error",
                description: "Please select an image before submitting.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return false;
        }

        setIsUploading(true);

        try {
            const result = await uploadImage(imageFile);
            setImageId(result.image_id); // Set the uploaded image ID
            toast({
                title: "Image uploaded successfully!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setIsUploading(false);
            return true;
        } catch (err) {
            toast({
                title: "Error",
                description: "Image upload failed. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsUploading(false);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate CLOs
        if (CLOs.some((clo) => clo.trim() === "")) {
            toast({
                title: "Error",
                description: "Please ensure all CLO fields are filled.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Ensure image is uploaded before submission
        const isImageUploaded = await uploadCourseImage();
        if (!isImageUploaded) return;

        try {
            const result = await createCourse({ ...formData, CLOs, image_id: imageId });
            if (result.success) {
                toast({
                    title: "Course created successfully!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/teacher-home");
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box bg="gray.50" minHeight="100vh" display="flex" alignItems="center" justifyContent="center" py={10}>
            <Box maxW="700px" w="full" p={8} borderRadius="lg" bg="white" boxShadow="lg">
                <HStack mb={6} spacing={4} align="center">
                    <IconButton
                        icon={<ArrowBackIcon />}
                        variant="solid"
                        colorScheme="orange"
                        onClick={handleBack}
                        aria-label="Go back to teacher home"
                    />
                    <Heading as="h1" size="xl" textAlign="center" color="orange.500" flex={1}>
                        Create a New Course
                    </Heading>
                </HStack>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Course Name</FormLabel>
                            <Input
                                type="text"
                                name="course_name"
                                value={formData.course_name}
                                onChange={handleInputChange}
                                placeholder="Enter course name"
                                maxLength={100}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Course Description</FormLabel>
                            <Textarea
                                name="course_description"
                                value={formData.course_description}
                                onChange={handleInputChange}
                                placeholder="Enter course description"
                                maxLength={500}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Upload Image</FormLabel>
                            <Input type="file" accept="image/*" onChange={handleImageChange} />
                            {isUploading && <Spinner size="sm" color="orange.500" mt={2} />}
                        </FormControl>

                        <HStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Difficulty Level</FormLabel>
                                <Select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Course Type</FormLabel>
                                <Select name="course_type" value={formData.course_type} onChange={handleInputChange}>
                                    <option value="Full Access">Full Access</option>
                                    <option value="Limited Access">Limited Access</option>
                                </Select>
                            </FormControl>
                        </HStack>

                        <FormControl isRequired>
                            <FormLabel>Difficulty Description</FormLabel>
                            <Textarea
                                name="difficulty_description"
                                value={formData.difficulty_description}
                                onChange={handleInputChange}
                                placeholder="Describe the difficulty level"
                                maxLength={200}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Course Price ($)</FormLabel>
                            <Input
                                type="number"
                                name="course_price"
                                value={formData.course_price}
                                onChange={handleInputChange}
                                placeholder="Price"
                                min="0"
                                step="0.01"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Course Learning Outcomes (CLOs)</FormLabel>
                            {CLOs.map((clo, index) => (
                                <HStack key={index} mb={2}>
                                    <Input
                                        value={clo}
                                        onChange={(e) => handleCLOChange(index, e.target.value)}
                                        placeholder={`Learning Outcome ${index + 1}`}
                                        maxLength={100}
                                    />
                                    {index > 0 && (
                                        <IconButton
                                            icon={<CloseIcon />}
                                            size="sm"
                                            aria-label="Remove CLO"
                                            onClick={() => removeCLOField(index)}
                                            colorScheme="red"
                                            variant="outline"
                                        />
                                    )}
                                </HStack>
                            ))}
                            {CLOs.length < 5 && (
                                <Button size="sm" leftIcon={<AddIcon />} onClick={addCLOField} mt={2} colorScheme="orange" variant="outline">
                                    Add Learning Outcome
                                </Button>
                            )}
                        </FormControl>

                        <Button type="submit" colorScheme="orange" size="lg" w="100%" mt={4} isDisabled={isUploading}>
                            Create Course
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
};

export default CourseCreationForm;
