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
        </Flex >
    );
};

export default Header;
