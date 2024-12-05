import React from "react";
import {
    Flex,
    Text,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spacer,
    Box,
    HStack,
    Link,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <Box p={4}>
            <Flex
                px={6}
                py={4}
                top={0}
                left={0}
                right={0}
                maxW="80%"
                mx="auto"
                mb={4}
                align="center"
            >
                <Text fontSize="3xl" fontWeight="bold" color="brand.primary">
                    Next<span style={{ color: "black" }}>Academy</span>
                </Text>
                <Spacer />
                {
                    user ? (
                        <Menu>
                            <MenuButton>
                                <Avatar size="sm" name={user.full_name} />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>My Details</MenuItem>
                                <MenuItem>My Courses</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Button
                            colorScheme="orange"
                            onClick={() => (window.location.href = "/login")}
                        >
                            Login
                        </Button>
                    )
                }
            </Flex>
            <Flex
                px={6}
                py={2}
                top={0}
                left={0}
                right={0}
                maxW="70%"
                mx="auto"
                mb={4}
                align="center"
                justify="space-between"
            >
                <Link href="/" p={2}>Home</Link>
                <Link href="/my-courses" p={2}>My Courses</Link>
                <Link href="/top-rated" p={2}>Top Rated</Link>
                <Link href="/my-profile" p={2}>My Profile</Link>
            </Flex>
        </Box>
    );
};

export default Header;