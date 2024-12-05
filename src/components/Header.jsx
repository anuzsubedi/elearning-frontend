import React, { useState, useCallback } from "react";
import {
    Flex,
    Text,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Box,
    Slide,
    Spinner,
    useDisclosure,
    IconButton,
    useColorModeValue
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/courseServices";
import debounce from 'lodash/debounce';

const Header = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Background and text colors for better visibility
    const inputBg = useColorModeValue('white', 'gray.700');
    const inputTextColor = useColorModeValue('black', 'white');
    const searchResultBg = useColorModeValue('white', 'gray.800');

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    const performSearch = useCallback(
        debounce(async (term) => {
            if (!term.trim()) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await getAllCourses();
                if (response.success) {
                    const filtered = response.courses.filter(course =>
                        course.title.toLowerCase().includes(term.toLowerCase())
                    );
                    setSearchResults(filtered);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            onOpen();
            performSearch(value);
        } else {
            onClose();
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        onClose();
    };

    return (
        <Flex
            maxW="80%"
            as="header"
            px={4}
            py={2}
            m="auto"
            mb={10}
            mt={10}
            color="black"
            alignItems="center"
        >
            <Text fontSize="3xl" fontWeight="bold">
                <Text as="span" color="brand.primary">
                    Next
                </Text>
                Academy
            </Text>

            <Flex as="form" flex="1" maxW="60%" mx="auto" position="relative" zIndex="dropdown">
                <InputGroup borderRadius="full" size="lg">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        borderRadius="full"
                        background={inputBg}
                        color={inputTextColor}
                        zIndex="1"
                        // Ensure text is visible
                        _placeholder={{
                            color: useColorModeValue('gray.500', 'gray.300')
                        }}
                    />
                    <InputRightElement>
                        {isLoading ? (
                            <Spinner size="lg" color="brand.primary" />
                        ) : searchTerm ? (
                            <IconButton
                                size="sm"
                                icon={<CloseIcon />}
                                variant="ghost"
                                onClick={clearSearch}
                            />
                        ) : (
                            <IconButton
                                size="sm"
                                icon={<SearchIcon />}
                                variant="ghost"
                                onClick={() => performSearch(searchTerm)}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
                <Slide in={isOpen && searchResults.length > 0} direction="top" style={{ zIndex: 10 }}>
                    <VStack
                        position="absolute"
                        top="100%"
                        left="0"
                        right="0"
                        mt={2}
                        bg={searchResultBg}
                        boxShadow="lg"
                        borderRadius="md"
                        maxH="300px"
                        overflowY="auto"
                        spacing={0}
                        border="1px solid"
                        borderColor="brand.border"
                        zIndex="popover"
                    >
                        {searchResults.map((course) => (
                            <Box
                                key={course.id}
                                w="100%"
                                p={3}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    bg: 'brand.menuHover',
                                    color: 'brand.primary'
                                }}
                                onClick={() => {
                                    navigate(`/course/${course.id}`);
                                    clearSearch();
                                }}
                            >
                                <Text fontSize="sm" fontWeight="500">
                                    {course.title}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Slide>
            </Flex>

            {user ? (
                <Flex alignItems="center">
                    <Menu>
                        <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                            <Avatar size="md" name={user.fullName} />
                        </MenuButton>
                        <Box ml={3} textAlign="left">
                            <Text fontSize="md" fontWeight="bold">{user.full_name}</Text>
                            <Text fontSize="sm" color="gray.500">{user.user_type === "Instructor" ? "Instructor" : "Student"}</Text>
                        </Box>
                        <MenuList>
                            <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            ) : (
                <Button onClick={() => navigate("/login")} colorScheme="brand.primary">
                    Login
                </Button>
            )}
        </Flex>
    );
};

export default Header;