import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Button,
    Text,
    Heading,
    IconButton,
    Divider,
    useToast,
    Skeleton,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getChaptersByCourse } from "../services/chapterServices";
import { getCourseById } from "../services/courseServices";
import Header from "../components/Header";

const LearningPage = () => {
    const { course_id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [chapters, setChapters] = useState([]);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseAndChapters = async () => {
            try {
                const courseResult = await getCourseById(course_id);
                if (courseResult.success) {
                    setCourseName(courseResult.course.course_name);
                } else {
                    toast({
                        title: "Error",
                        description: courseResult.message,
                        status: "error",
                        duration: 3000,
                    });
                }

                const chaptersResult = await getChaptersByCourse(course_id);
                if (chaptersResult.success) {
                    setChapters(chaptersResult.chapters);
                } else {
                    toast({
                        title: "Error",
                        description: chaptersResult.message,
                        status: "error",
                        duration: 3000,
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch course and chapters.",
                    status: "error",
                    duration: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndChapters();
    }, [course_id, toast]);

    const handleNextChapter = () => {
        if (currentChapterIndex < chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
    };

    const handlePreviousChapter = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(currentChapterIndex - 1);
        }
    };

    const handleSelectChapter = (index) => {
        setCurrentChapterIndex(index);
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getEmbedUrl = (url) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    if (loading) {
        return <Skeleton height="100vh" />;
    }

    return (
        <>
            <Header />
            <Box maxW="1200px" mx="auto" p={6} bg="gray.50" borderRadius="lg" boxShadow="md">
                <HStack justifyContent="space-between" mb={6}>
                    <HStack>
                        <IconButton
                            icon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        />
                        <IconButton
                            icon={<ArrowUpIcon />}
                            onClick={() => navigate("/")}
                            aria-label="Go to home"
                        />
                    </HStack>
                    <Heading as="h1" size="lg">
                        {courseName}
                    </Heading>
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
                                    bg={index === currentChapterIndex ? "blue.100" : "gray.50"}
                                    _hover={{ bg: "gray.100" }}
                                    justifyContent="space-between"
                                    onClick={() => handleSelectChapter(index)}
                                    cursor="pointer"
                                >
                                    <Text flex={1} isTruncated>
                                        {chapter.chapter_title}
                                    </Text>
                                </HStack>
                            ))
                        ) : (
                            <Text>No chapters available.</Text>
                        )}
                    </VStack>
                    <Box flex={1} bg="white" p={6} borderRadius="lg" boxShadow="sm">
                        <Heading size="md" mb={4}>
                            {chapters[currentChapterIndex]?.chapter_title}
                        </Heading>
                        <Divider mb={4} />
                        {isValidUrl(chapters[currentChapterIndex]?.chapter_description) ? (
                            <Box>
                                <iframe
                                    width="100%"
                                    height="400px"
                                    src={getEmbedUrl(chapters[currentChapterIndex]?.chapter_description)}
                                    title={chapters[currentChapterIndex]?.chapter_title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </Box>
                        ) : (
                            <Text mb={4} dangerouslySetInnerHTML={{ __html: chapters[currentChapterIndex]?.chapter_description }} />
                        )}
                        {chapters[currentChapterIndex]?.type === "text" ? (
                            <Box dangerouslySetInnerHTML={{ __html: chapters[currentChapterIndex]?.chapter_content }}
                                sx={{
                                    '& h1': { fontSize: '2xl', fontWeight: 'bold', marginBottom: '1rem' },
                                    '& h2': { fontSize: 'xl', fontWeight: 'semibold', marginBottom: '0.75rem' },
                                    '& h3': { fontSize: 'lg', fontWeight: 'medium', marginBottom: '0.5rem' },
                                    '& p': { marginBottom: '1rem', fontSize: 'md' },
                                    '& strong': { fontWeight: 'bold' },
                                    '& em': { fontStyle: 'italic' },
                                    '& u': { textDecoration: 'underline' },
                                    '& ul': { paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'disc' },
                                    '& ul li': { marginBottom: '0.5rem' },
                                    '& ol': { paddingLeft: '1.5rem', marginBottom: '1rem', listStyleType: 'decimal' },
                                    '& ol li': { marginBottom: '0.5rem' },
                                    '& blockquote': {
                                        paddingLeft: '1rem',
                                        borderLeft: '4px solid',
                                        borderColor: 'gray.300',
                                        fontStyle: 'italic',
                                        marginBottom: '1rem',
                                    },
                                    '& a': { color: 'blue.500', textDecoration: 'underline' },
                                }} />
                        ) : (
                            <Box>
                                <iframe
                                    width="100%"
                                    height="400px"
                                    src={getEmbedUrl(chapters[currentChapterIndex]?.chapter_content)}
                                    title={chapters[currentChapterIndex]?.chapter_title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </Box>
                        )}
                        <HStack justifyContent="space-between" mt={6}>
                            <Button
                                leftIcon={<ArrowBackIcon />}
                                onClick={handlePreviousChapter}
                                isDisabled={currentChapterIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                rightIcon={<ArrowForwardIcon />}
                                onClick={handleNextChapter}
                                isDisabled={currentChapterIndex === chapters.length - 1}
                            >
                                Next
                            </Button>
                        </HStack>
                    </Box>
                </HStack>
            </Box>
        </>
    );
};

export default LearningPage;