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

const Header = () => {
    const { user, logoutUser } = useAuth();

    return (
        <Flex

            px={6}
            py={4}
            // boxShadow="md"

            top={0}
            left={0}
            right={0}
            // zIndex="10"
            maxW="80%" // Limit the width of the header to 80%
            mx="auto" // Center the header container horizontally
            mb={4}
            align="center"
            outline="1px solid #E2E8F0"
        >
            <Text fontSize="lg" fontWeight="bold" color="brand.primary">
                Next<span style={{ color: "#FC7753" }}>Academy</span>
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
                            <MenuItem onClick={logoutUser}>Logout</MenuItem>
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
