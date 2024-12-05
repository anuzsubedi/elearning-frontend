import React, { useState, useEffect } from "react";
import {
    Box,
    Skeleton,
    SkeletonText,
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
    Tag,
    TagLabel,
    TagCloseButton,
    Image,
    Text,
    Tooltip,
    Grid,
    GridItem,
    Divider,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon, ArrowBackIcon, CheckIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, editCourse } from "../services/courseServices";
import { getImage } from "../services/imageService";
import { uploadImage } from "../services/imageService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";


// Framer Motion Box for animations
const MotionBox = motion(Box);

const EditCoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { user: currentUser, isTeacher } = useAuth();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        course_name: "",
        course_description: "",
        difficulty: "Beginner",
        difficulty_description: "",
        course_price: "",
        course_type: "Full Access",
    });
    const [CLOs, setCLOs] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [hasImageChanged, setHasImageChanged] = useState(false);

    useEffect(() => {

        const fetchCourseData = async () => {
            try {
                const result = await getCourseById(id);
                if (result.success) {
                    const { course } = result;

                    if (course.user_id !== currentUser.id || !isTeacher()) {
                        toast({
                            title: "Permission Denied",
                            description: "You are not allowed to edit this course.",
                            status: "error",
                            duration: 4000,
                        });
                        navigate("/teacher-home");
                        return;
                    }

                    setFormData({
                        course_name: course.course_name,
                        course_description: course.course_description,
                        difficulty: course.difficulty,
                        difficulty_description: course.difficulty_description,
                        course_price: course.course_price,
                        course_type: course.course_type || "Full Access",
                    });
                    setCLOs(Array.isArray(course.CLOs) ? course.CLOs : JSON.parse(course.CLOs || "[]"));
                    setTags(Array.isArray(course.tags) ? course.tags : JSON.parse(course.tags || "[]"));
                    setImageId(course.image_id);
                    fetchCourseImage(course.image_id);
                    setImagePreview(course.image_url || null);
                    setLoading(false);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to fetch course details.",
                    status: "error",
                    duration: 4000,
                });
                navigate("/teacher-home");
            }
        };

        const fetchCourseImage = async (imageId) => {
            try {
                const result = await getImage(imageId);
                if (result.success) {
                    setImagePreview(result.imageUrl);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to fetch course image.",
                    status: "error",
                    duration: 4000,
                });
            }
        };

        fetchCourseData();




    }, [id, currentUser.id, navigate, toast, isTeacher]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.course_name.trim()) newErrors.course_name = "Course name is required";
        if (!formData.course_description.trim()) newErrors.course_description = "Description is required";
        if (!formData.difficulty_description.trim()) newErrors.difficulty_description = "Difficulty description is required";
        if (formData.difficulty_description.length > 50) newErrors.difficulty_description = "Must be under 50 characters";
        if (!formData.course_price) newErrors.course_price = "Price is required";
        if (formData.course_price <= 0) newErrors.course_price = "Price must be greater than 0";
        if (CLOs.some((clo) => !clo.trim())) newErrors.CLOs = "All learning outcomes must be filled";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a JPG, PNG, or WEBP image.",
                    status: "error",
                    duration: 3000,
                });
                return;
            }
            setImageFile(file);
            setHasImageChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast({
                title: "No image selected",
                description: "Please choose an image to upload.",
                status: "error",
                duration: 3000,
            });
            return;
        }

        setIsUploading(true);
        try {
            const uploadResult = await uploadImage(imageFile);
            if (!uploadResult.image_id) throw new Error("Image upload failed");
            setImageId(uploadResult.image_id);
            setIsUploading(false);
            setHasImageChanged(false);
            toast({
                title: "Image uploaded successfully!",
                status: "success",
                duration: 3000,
            });
        } catch (error) {
            setIsUploading(false);
            toast({
                title: "Upload Error",
                description: error.message || "Failed to upload the image.",
                status: "error",
                duration: 4000,
            });
        }
    };

    const handleCLOChange = (index, value) => {
        const updatedCLOs = [...CLOs];
        updatedCLOs[index] = value;
        setCLOs(updatedCLOs);
    };

    const addCLOField = () => CLOs.length < 5 && setCLOs([...CLOs, ""]);
    const removeCLOField = (index) => setCLOs(CLOs.filter((_, i) => i !== index));

    const handleTagInputChange = (e) => setTagInput(e.target.value);
    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };
    const removeTag = (tagToRemove) => setTags(tags.filter((tag) => tag !== tagToRemove));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors and try again.",
                status: "error",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedData = {
                ...formData,
                CLOs,
                tags,
                image_id: imageId, // Include imageId in the form data
            };
            const result = await editCourse(id, updatedData);
            if (result.success) {
                toast({
                    title: "Success!",
                    description: "Course updated successfully.",
                    status: "success",
                    duration: 3000,
                });
                navigate("/teacher-home");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update the course.",
                status: "error",
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box minH="100vh" bg="brand.background" position="relative">
            <Box position="fixed" top="0" left="0" right="0" bg="white" borderBottom="1px" borderColor="brand.border" zIndex="sticky" px={8} py={4}>
                <HStack spacing={4} maxW="1200px" mx="auto">
                    <IconButton
                        icon={<ArrowBackIcon />}
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        _hover={{ bg: "brand.menuHover" }}
                        aria-label="Go back"
                    />
                    <Heading size="lg" color="brand.text">
                        Edit Course
                    </Heading>
                </HStack>
            </Box>
            <Box maxW="1200px" mx="auto" pt="24" px={8} pb={20}>
                {loading ? (
                    <Grid templateColumns="repeat(12, 1fr)" gap={8}>
                        <GridItem colSpan={{ base: 12, md: 8 }}>
                            <VStack spacing={6} align="stretch">
                                <Skeleton height="40px" width="200px" />
                                <SkeletonText mt="4" noOfLines={4} spacing="4" />
                                <Skeleton height="200px" />
                                <SkeletonText mt="4" noOfLines={3} spacing="4" />
                            </VStack>
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 4 }}>
                            <Skeleton height="400px" borderRadius="lg" />
                        </GridItem>
                    </Grid>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Grid templateColumns="repeat(12, 1fr)" gap={8}>
                            <GridItem colSpan={{ base: 12, md: 8 }}>
                                <VStack spacing={8} align="stretch">
                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Heading size="md" mb={6} color="brand.text">Course Details</Heading>
                                        {/* Add form fields for Course Details */}
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
                                                    _hover={{ borderColor: 'brand.borderHover' }}
                                                    _focus={{ borderColor: 'brand.focus', boxShadow: 'none' }}
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
                                                    _hover={{ borderColor: 'brand.borderHover' }}
                                                    _focus={{ borderColor: 'brand.focus', boxShadow: 'none' }}
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
                                                    _hover={{ borderColor: 'brand.borderHover' }}
                                                    _focus={{ borderColor: 'brand.focus', boxShadow: 'none' }}
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
                                                        _hover={{ borderColor: 'brand.borderHover' }}
                                                        _focus={{ borderColor: 'brand.focus', boxShadow: 'none' }}
                                                    />
                                                    <Button onClick={addTag} bg="brand.primary" color="white" size="lg" _hover={{ bg: 'brand.secondary' }}>
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
                                                            bg="brand.primary"
                                                            color="white"
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
                                </VStack>
                                <Divider my={8} />

                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Heading size="md" mb={6} color="brand.text">Learning Outcomes</Heading>
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
                                                        _hover={{ borderColor: 'brand.borderHover' }}
                                                        _focus={{ borderColor: 'brand.focus', boxShadow: 'none' }}
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
                                                color="brand.primary"
                                                _hover={{ bg: 'brand.menuHover' }}
                                                alignSelf="start"
                                            >
                                                Add Learning Outcome
                                            </Button>
                                        )}
                                    </VStack>
                                </MotionBox>

                            </GridItem>
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
                                        borderColor="brand.border"
                                    >
                                        <FormControl>
                                            <FormLabel fontSize="sm">Course Image</FormLabel>
                                            <Box
                                                borderWidth={2}
                                                borderStyle="dashed"
                                                borderRadius="md"
                                                p={4}
                                                textAlign="center"
                                                cursor="pointer"
                                                _hover={{ bg: 'brand.menuHover' }}
                                                onClick={() => document.getElementById('imageInput').click()}
                                            >
                                                <Input
                                                    id="imageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    hidden
                                                />
                                                <Image
                                                    src={imagePreview}
                                                    maxH="150px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                            </Box>
                                            {isUploading && <Text color="blue.500">Uploading...</Text>}
                                            {imageId && !isUploading && !hasImageChanged && (
                                                <HStack mt={2}>
                                                    <CheckIcon color="green.500" />
                                                    <Text color="green.500">Image uploaded successfully!</Text>
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
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel fontSize="sm">Difficulty Level</FormLabel>
                                            <Select
                                                name="difficulty"
                                                value={formData.difficulty}
                                                onChange={handleInputChange}
                                                size="lg"
                                                bg="white"
                                                borderWidth="2px"
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
                                                bg="white"
                                                borderWidth="2px"
                                            />
                                            <FormErrorMessage>{errors.course_price}</FormErrorMessage>
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            bg="brand.primary"
                                            color="white"
                                            size="lg"
                                            width="full"
                                            isLoading={isSubmitting}
                                            loadingText="Saving..."
                                            _hover={{ bg: 'brand.secondary', transform: 'translateY(-2px)' }}
                                            _active={{ transform: 'translateY(0)' }}
                                            transition="all 0.2s"
                                        >
                                            Save Changes
                                        </Button>
                                    </VStack>
                                </MotionBox>
                            </GridItem>
                        </Grid>
                    </form>
                )}
            </Box>
        </Box>
    );
};

export default EditCoursePage;
