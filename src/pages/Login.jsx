import React, { useState } from "react";
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    Text,
    Link,
    Checkbox,
} from "@chakra-ui/react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await login(credentials);
            if (result.success) {
                loginUser(result.user, stayLoggedIn); // Save user to context with stayLoggedIn
                navigate(result.user.user_type === "Instructor" ? "/teacher-home" : "/");
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minH="100vh"
            px={4}
        >
            <Box w="100%" maxW="400px" textAlign="center">
                <Heading as="h1" size="lg" mb={6}>
                    Sign in to NextAcademy
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={credentials.email}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                        <FormControl>
                            <Checkbox
                                isChecked={stayLoggedIn}
                                onChange={(e) => setStayLoggedIn(e.target.checked)}
                            >
                                Stay logged in
                            </Checkbox>
                        </FormControl>
                        {error && <Text color="red.500">{error}</Text>}
                        <Button type="submit" w="100%">
                            Sign In
                        </Button>
                    </VStack>
                </form>
                <Text mt={4}>
                    Don’t have an account?{" "}
                    <Link href="/signup" color="brand.primary">
                        Sign up
                    </Link>
                </Text>
            </Box>
        </Box>
    );
};

export default Login;