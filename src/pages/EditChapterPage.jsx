import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Button,
    Input,
    Textarea,
    Heading,
    IconButton,
    Text,
    Divider,
    useToast,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, CloseIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    createChapter,
    getChaptersByCourse,
    updateChapter,
    deleteChapter,
} from "../services/chapterServices";
import { useParams, useNavigate } from "react-router-dom";

const AddChaptersPage = () => {
    const { course_id } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // Loading state
    const [reordered, setReordered] = useState(false);
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
    const [chapterForm, setChapterForm] = useState({
        chapter_title: "",
        chapter_description: "",
        type: "text",
        chapter_content: "",
    });
    const [errors, setErrors] = useState({});
    const toast = useToast();

    // Fetch chapters on mount
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const result = await getChaptersByCourse(course_id);
                if (result.success) {
                    setChapters(result.chapters || []); // Fallback to empty array
                } else {
                    toast({
                        title: "Error",
                        description: result.message,
                        status: "error",
                        duration: 3000,
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch chapters.",
                    status: "error",
                    duration: 3000,
                });
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchChapters();
    }, [course_id, toast]);

    const validateForm = () => {
        const newErrors = {};
        if (!chapterForm.chapter_title.trim())
            newErrors.chapter_title = "Title is required.";
        if (!chapterForm.chapter_description.trim())
            newErrors.chapter_description = "Description is required.";
        if (!chapterForm.chapter_content.trim())
            newErrors.chapter_content =
                chapterForm.type === "video"
                    ? "Video URL is required."
                    : "Chapter content is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChapterForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleContentChange = (value) => {
        setChapterForm((prev) => ({
            ...prev,
            chapter_content: value,
        }));
        setErrors((prev) => ({ ...prev, chapter_content: "" }));
    };

    const handleSaveChapter = async () => {
        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                status: "error",
                duration: 3000,
            });
            return;
        }

        try {
            const order_number = chapters.length + 1;
            const backendChapterData = {
                ...chapterForm,
                course_id,
                order_number,
            };

            if (selectedChapterIndex !== null) {
                // Update chapter
                const chapterId = chapters[selectedChapterIndex].chapter_id;
                const result = await updateChapter(chapterId, backendChapterData);
                if (result.success) {
                    const updatedChapters = [...chapters];
                    updatedChapters[selectedChapterIndex] = backendChapterData;
                    setChapters(updatedChapters);
                    toast({
                        title: "Chapter Updated",
                        description: "Your changes have been saved.",
                        status: "success",
                        duration: 3000,
                    });
                } else {
                    throw new Error(result.message);
                }
            } else {
                // Create chapter
                const result = await createChapter(backendChapterData);
                if (result.success) {
                    const newChapter = { ...backendChapterData, chapter_id: result.chapter_id };
                    setChapters([...chapters, newChapter]);
                    toast({
                        title: "Chapter Added",
                        description: "The chapter has been added successfully.",
                        status: "success",
                        duration: 3000,
                    });
                } else {
                    throw new Error(result.message);
                }
            }

            setChapterForm({
                chapter_title: "",
                chapter_description: "",
                type: "text",
                chapter_content: "",
            });
            setSelectedChapterIndex(null);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                status: "error",
                duration: 4000,
            });
        }
    };

    const handleEditChapter = (index) => {
        setSelectedChapterIndex(index);
        setChapterForm(chapters[index]);
    };

    const handleDeleteChapter = async (index) => {
        const chapterId = chapters[index].chapter_id;

        try {
            const result = await deleteChapter(chapterId);
            if (result.success) {
                setChapters(chapters.filter((_, i) => i !== index));
                if (index === selectedChapterIndex) {
                    setSelectedChapterIndex(null);
                    setChapterForm({
                        chapter_title: "",
                        chapter_description: "",
                        type: "text",
                        chapter_content: "",
                    });
                }
                toast({
                    title: "Chapter Deleted",
                    description: "The chapter has been removed.",
                    status: "success",
                    duration: 3000,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                status: "error",
                duration: 4000,
            });
        }
    };

    const moveChapter = (index, direction) => {
        const newChapters = [...chapters];
        const [movedChapter] = newChapters.splice(index, 1);
        newChapters.splice(index + direction, 0, movedChapter);

        const reorderedChapters = newChapters.map((chapter, idx) => ({
            ...chapter,
            order_number: idx + 1,
        }));

        setChapters(reorderedChapters);
        setReordered(true);
    };

    const handleUpdateOrder = async () => {
        try {
            await Promise.all(
                chapters.map((chapter) =>
                    updateChapter(chapter.chapter_id, {
                        ...chapter,
                        course_id,
                    })
                )
            );
            toast({
                title: "Order Updated",
                description: "The chapter order has been saved successfully.",
                status: "success",
                duration: 3000,
            });
            setReordered(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update chapter order.",
                status: "error",
                duration: 3000,
            });
        }
    };

    if (loading) {
        return <Text>Loading chapters...</Text>;
    }

    return (
        <Box maxW="1200px" mx="auto" p={6} bg="gray.50" borderRadius="lg" boxShadow="md">
            <Heading as="h1" size="lg" mb={6}>
                Add and Manage Chapters
            </Heading>
            <HStack justifyContent="space-between" mb={6}>
                <Button colorScheme="blue" onClick={() => navigate(`/courses/${course_id}`)}>
                    Go Back to Course
                </Button>
                <Button colorScheme="blue" onClick={() => navigate("/")}>
                    Go to Home
                </Button>
            </HStack>
            <HStack align="start" spacing={8}>
                <VStack
                    spacing={4}
                    w="30%"
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                    align="stretch"
                >
                    <Heading size="md" mb={2}>
                        Chapters
                    </Heading>
                    {chapters.length > 0 ? (
                        chapters.map((chapter, index) => (
                            <HStack
                                key={chapter.chapter_id || index}
                                p={2}
                                borderRadius="md"
                                bg={index === selectedChapterIndex ? "blue.100" : "gray.50"}
                                _hover={{ bg: "gray.100" }}
                                justifyContent="space-between"
                            >
                                <Text flex={1} isTruncated>
                                    {chapter.chapter_title}
                                </Text>
                                <HStack>
                                    <IconButton
                                        icon={<ArrowUpIcon />}
                                        size="sm"
                                        isDisabled={index === 0}
                                        onClick={() => moveChapter(index, -1)}
                                        aria-label="Move up"
                                    />
                                    <IconButton
                                        icon={<ArrowDownIcon />}
                                        size="sm"
                                        isDisabled={index === chapters.length - 1}
                                        onClick={() => moveChapter(index, 1)}
                                        aria-label="Move down"
                                    />
                                    <IconButton
                                        icon={<EditIcon />}
                                        size="sm"
                                        onClick={() => handleEditChapter(index)}
                                        aria-label="Edit chapter"
                                    />
                                    <IconButton
                                        icon={<CloseIcon />}
                                        size="sm"
                                        onClick={() => handleDeleteChapter(index)}
                                        colorScheme="red"
                                        aria-label="Delete chapter"
                                    />
                                </HStack>
                            </HStack>
                        ))
                    ) : (
                        <Text>No chapters available.</Text>
                    )}
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        onClick={() => {
                            setSelectedChapterIndex(null);
                            setChapterForm({
                                chapter_title: "",
                                chapter_description: "",
                                type: "text",
                                chapter_content: "",
                            });
                        }}
                    >
                        Add New Chapter
                    </Button>
                    {reordered && (
                        <Button colorScheme="green" onClick={handleUpdateOrder}>
                            Update Order
                        </Button>
                    )}
                </VStack>
                <Box flex={1} bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <Heading size="md" mb={4}>
                        {selectedChapterIndex !== null ? "Edit Chapter" : "Add Chapter"}
                    </Heading>
                    <Divider mb={4} />
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired isInvalid={!!errors.chapter_title}>
                            <FormLabel>Chapter Title</FormLabel>
                            <Input
                                name="chapter_title"
                                value={chapterForm.chapter_title}
                                onChange={handleInputChange}
                                placeholder="Enter chapter title"
                            />
                            <FormErrorMessage>{errors.chapter_title}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.chapter_description}>
                            <FormLabel>Chapter Description</FormLabel>
                            <Textarea
                                name="chapter_description"
                                value={chapterForm.chapter_description}
                                onChange={handleInputChange}
                                placeholder="Enter chapter description"
                            />
                            <FormErrorMessage>{errors.chapter_description}</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Type</FormLabel>
                            <Select
                                name="type"
                                value={chapterForm.type}
                                onChange={handleInputChange}
                            >
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                            </Select>
                        </FormControl>
                        {chapterForm.type === "text" ? (
                            <FormControl isRequired isInvalid={!!errors.chapter_content}>
                                <FormLabel>Content</FormLabel>
                                <ReactQuill
                                    theme="snow"
                                    value={chapterForm.chapter_content || ""}
                                    onChange={handleContentChange}
                                />
                                <FormErrorMessage>{errors.chapter_content}</FormErrorMessage>
                            </FormControl>
                        ) : (
                            <FormControl isRequired isInvalid={!!errors.chapter_content}>
                                <FormLabel>Video URL</FormLabel>
                                <Input
                                    name="chapter_content"
                                    value={chapterForm.chapter_content}
                                    onChange={handleInputChange}
                                    placeholder="Enter video URL"
                                />
                                <FormErrorMessage>{errors.chapter_content}</FormErrorMessage>
                            </FormControl>
                        )}
                        <Button
                            colorScheme="blue"
                            onClick={handleSaveChapter}
                            isFullWidth
                        >
                            {selectedChapterIndex !== null ? "Save Changes" : "Add Chapter"}
                        </Button>
                    </VStack>
                </Box>
            </HStack>
        </Box>
    );
};

export default AddChaptersPage;
