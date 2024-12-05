import React, { useState, useEffect } from "react";
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
    FormErrorMessage,
    useColorMode,
    Image,
    Grid,
    GridItem,
    Divider,
    Text,
    Tag,
    TagLabel,
    TagCloseButton,
    Tooltip,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, ArrowBackIcon, CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { createCourse } from "../services/courseServices";
import { uploadImage } from "../services/imageService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { s } from "framer-motion/client";

const MotionBox = motion(Box);

const CourseCreationForm = () => {
    const { setColorMode } = useColorMode();
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        course_name: "",
        course_description: "",
        difficulty: "Beginner",
        difficulty_description: "",
        course_type: "Full Access",
        course_price: "",
    });

    const [errors, setErrors] = useState({});
    const [CLOs, setCLOs] = useState([""]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    useEffect(() => {
        setColorMode('light');
    }, [setColorMode]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.course_name.trim()) newErrors.course_name = "Course name is required";
        if (!formData.course_description.trim()) newErrors.course_description = "Description is required";
        if (!formData.difficulty_description.trim()) newErrors.difficulty_description = "Difficulty description is required";
        if (formData.difficulty_description.length > 50) newErrors.difficulty_description = "Difficulty description must be less than 50 characters";
        if (!formData.course_price) newErrors.course_price = "Price is required";
        if (!imageFile) newErrors.image = "Course image is required";
        if (CLOs.some(clo => !clo.trim())) newErrors.clos = "All learning outcomes must be filled";
        if (formData.course_price <= 0) newErrors.course_price = "Price must be greater than 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a JPG, PNG, or WEBP image",
                    status: "error",
                    duration: 3000,
                });
                return;
            }

            if (file.size > 5242880) { // 5MB limit
                toast({
                    title: "File too large",
                    description: "Image size should be less than 5MB",
                    status: "error",
                    duration: 3000,
                });
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast({
                title: "No image file provided",
                description: "Please select an image file to upload",
                status: "error",
                duration: 3000,
            });
            return;
        }

        setIsUploading(true);

        try {
            const uploadResult = await uploadImage(imageFile);

            if (!uploadResult.image_id) {
                throw new Error("Image upload failed");
            }

            setImageId(uploadResult.image_id);
            setIsUploading(false);
            setIsImageUploaded(true);
            toast({
                title: "Image uploaded successfully!",
                status: "success",
                duration: 3000,
            });
        } catch (err) {
            setIsUploading(false);
            toast({
                title: "Error",
                description: err.message || "Image upload failed",
                status: "error",
                duration: 3000,
            });
        }
    };

    const handleCLOChange = (index, value) => {
        const updatedCLOs = [...CLOs];
        updatedCLOs[index] = value;
        setCLOs(updatedCLOs);
        if (errors.clos) {
            setErrors(prev => ({ ...prev, clos: null }));
        }
    };

    const addCLOField = () => CLOs.length < 5 && setCLOs([...CLOs, ""]);
    const removeCLOField = (index) => setCLOs(CLOs.filter((_, i) => i !== index));

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUploading) {
            toast({
                title: "Image is still uploading",
                description: "Please wait until the image upload is complete",
                status: "error",
                duration: 3000,
            });
            return;
        }

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please check all required fields",
                status: "error",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Create course with uploaded image
            const courseData = {
                ...formData,
                CLOs: JSON.stringify(CLOs),
                tags: JSON.stringify(tags),
                image_id: imageId,
            };

            const result = await createCourse(courseData);


            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Your course has been created",
                    status: "success",
                    duration: 3000,
                });
                console.log(result.course_id);
                navigate(`/course/${result.course_id}/editchapters`);
            } else {
                throw new Error(result.message || "Failed to create course");
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "An unexpected error occurred",
                status: "error",
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg="gray.50"
            position="relative"
        >
            <Box
                position="fixed"
                top="0"
                left="0"
                right="0"
                bg="white"
                borderBottom="1px"
                borderColor="gray.100"
                zIndex="sticky"
                px={8}
                py={4}
            >
                <HStack spacing={4} maxW="1200px" mx="auto">
                    <IconButton
                        icon={<ArrowBackIcon />}
                        variant="ghost"
                        onClick={() => navigate("/teacher-home")}
                        _hover={{ bg: 'gray.100' }}
                        aria-label="Go back"
                    />
                    <Heading size="lg" color="gray.800">
                        Create a New Course
                    </Heading>
                </HStack>
            </Box>

            <Box
                maxW="1200px"
                mx="auto"
                pt="24"
                px={8}
                pb={20}
            >
                <form onSubmit={handleSubmit}>
                    <Grid templateColumns="repeat(12, 1fr)" gap={8}>
                        {/* Left Column */}
                        <GridItem colSpan={{ base: 12, md: 8 }}>
                            <VStack spacing={8} align="stretch">
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Heading size="md" mb={6}>Course Details</Heading>
                                    <VStack spacing={6}>
                                        <FormControl isRequired isInvalid={errors.course_name}>
                                            <FormLabel fontSize="sm">Course Name</FormLabel>
                                            <Input
                                                name="course_name"
                                                value={formData.course_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter a descriptive name"
                                                size="lg"
                                                bg="white"
                                                borderWidth="2px"
                                                _hover={{ borderColor: 'gray.300' }}
                                                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                                            />
                                            <FormErrorMessage>{errors.course_name}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={errors.course_description}>
                                            <FormLabel fontSize="sm">Course Description</FormLabel>
                                            <Textarea
                                                name="course_description"
                                                value={formData.course_description}
                                                onChange={handleInputChange}
                                                placeholder="What will students learn in this course?"
                                                size="lg"
                                                bg="white"
                                                borderWidth="2px"
                                                minH="150px"
                                                _hover={{ borderColor: 'gray.300' }}
                                                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                                            />
                                            <FormErrorMessage>{errors.course_description}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={errors.difficulty_description}>
                                            <FormLabel fontSize="sm">Difficulty Description</FormLabel>
                                            <Input
                                                name="difficulty_description"
                                                value={formData.difficulty_description}
                                                onChange={handleInputChange}
                                                placeholder="No Prior Experience Required"
                                                size="lg"
                                                bg="white"
                                                borderWidth="2px"
                                                maxLength={50}
                                                _hover={{ borderColor: 'gray.300' }}
                                                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                                            />
                                            <FormErrorMessage>{errors.difficulty_description}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm">
                                                Tags
                                                <Tooltip label="Tags help in categorizing and searching for courses" fontSize="md">
                                                    <InfoOutlineIcon ml={2} />
                                                </Tooltip>
                                            </FormLabel>
                                            <HStack>
                                                <Input
                                                    value={tagInput}
                                                    onChange={handleTagInputChange}
                                                    placeholder="Add a tag"
                                                    size="lg"
                                                    bg="white"
                                                    borderWidth="2px"
                                                    _hover={{ borderColor: 'gray.300' }}
                                                    _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                                                />
                                                <Button onClick={addTag} colorScheme="blue" size="lg">
                                                    Add Tag
                                                </Button>
                                            </HStack>
                                            <HStack mt={2} wrap="wrap">
                                                {tags.map((tag, index) => (
                                                    <Tag
                                                        key={index}
                                                        size="lg"
                                                        borderRadius="full"
                                                        variant="solid"
                                                        colorScheme="blue"
                                                        m={1}
                                                    >
                                                        <TagLabel>{tag}</TagLabel>
                                                        <TagCloseButton onClick={() => removeTag(tag)} />
                                                    </Tag>
                                                ))}
                                            </HStack>
                                        </FormControl>
                                    </VStack>
                                </MotionBox>

                                <Divider my={8} />

                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Heading size="md" mb={6}>Learning Outcomes</Heading>
                                    <VStack spacing={4}>
                                        {CLOs.map((clo, index) => (
                                            <HStack key={index} width="full" spacing={2}>
                                                <FormControl isRequired isInvalid={errors.clos}>
                                                    <Input
                                                        value={clo}
                                                        onChange={(e) => handleCLOChange(index, e.target.value)}
                                                        placeholder={`Outcome ${index + 1}: Students will be able to...`}
                                                        bg="white"
                                                        borderWidth="2px"
                                                        size="lg"
                                                    />
                                                </FormControl>
                                                {index > 0 && (
                                                    <IconButton
                                                        icon={<CloseIcon />}
                                                        onClick={() => removeCLOField(index)}
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        size="lg"
                                                    />
                                                )}
                                            </HStack>
                                        ))}
                                        {CLOs.length < 5 && (
                                            <Button
                                                leftIcon={<AddIcon />}
                                                onClick={addCLOField}
                                                variant="ghost"
                                                colorScheme="blue"
                                                alignSelf="start"
                                            >
                                                Add Learning Outcome
                                            </Button>
                                        )}
                                    </VStack>
                                </MotionBox>
                            </VStack>
                        </GridItem>

                        {/* Right Column */}
                        <GridItem colSpan={{ base: 12, md: 4 }}>
                            <MotionBox
                                position="sticky"
                                top="100px"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <VStack
                                    spacing={6}
                                    bg="white"
                                    p={6}
                                    borderRadius="lg"
                                    borderWidth="2px"
                                    borderColor="gray.100"
                                >
                                    <FormControl isRequired isInvalid={errors.image}>
                                        <FormLabel fontSize="sm">Course Image</FormLabel>
                                        <Box
                                            borderWidth={2}
                                            borderStyle="dashed"
                                            borderRadius="md"
                                            p={4}
                                            textAlign="center"
                                            cursor="pointer"
                                            _hover={{ bg: 'gray.50' }}
                                            onClick={() => document.getElementById('imageInput').click()}
                                        >
                                            <Input
                                                id="imageInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                hidden
                                            />
                                            {imagePreview ? (
                                                <Image
                                                    src={imagePreview}
                                                    maxH="150px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                            ) : (
                                                <Text color="gray.500">Click to upload course image</Text>
                                            )}
                                        </Box>
                                        <FormErrorMessage>{errors.image}</FormErrorMessage>
                                    </FormControl>

                                    {isUploading && (
                                        <Text color="blue.500">Uploading...</Text>
                                    )}

                                    {!isUploading && isImageUploaded && (
                                        <HStack>
                                            <CheckIcon color="green.500" />
                                            <Text color="green.500">Image uploaded</Text>
                                        </HStack>
                                    )}

                                    {!isImageUploaded && (
                                        <Button
                                            onClick={handleImageUpload}
                                            colorScheme="blue"
                                            size="lg"
                                            width="full"
                                        >
                                            Upload Image
                                        </Button>
                                    )}

                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm">Difficulty Level</FormLabel>
                                        <Select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            size="lg"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={errors.course_price}>
                                        <FormLabel fontSize="sm">Course Price ($)</FormLabel>
                                        <Input
                                            type="number"
                                            name="course_price"
                                            value={formData.course_price}
                                            onChange={handleInputChange}
                                            placeholder="29.99"
                                            size="lg"
                                        />
                                        <FormErrorMessage>{errors.course_price}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel fontSize="sm">Course Type</FormLabel>
                                        <Select
                                            name="course_type"
                                            value={formData.course_type}
                                            onChange={handleInputChange}
                                            size="lg"
                                        >
                                            <option value="Full Access">Full Accesss</option>
                                            <option value="Subscription">Subscription</option>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        size="lg"
                                        width="full"
                                        isLoading={isSubmitting}
                                        loadingText="Creating..."
                                    >
                                        Create Course
                                    </Button>
                                </VStack>
                            </MotionBox>
                        </GridItem>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default CourseCreationForm;