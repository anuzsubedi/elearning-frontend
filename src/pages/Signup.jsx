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
} from "@chakra-ui/react";
import { signup } from "../services/authService";
import { checkEmail } from "../services/emailService";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setEmailError(null); // Clear previous email error
      const result = await checkEmail(value);
      if (result.exists) {
        setEmailError("This email is already registered.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      setGeneralError("Please resolve the email error.");
      return;
    }

    const result = await signup(formData);
    if (result.success) {
      navigate("/login");
    } else {
      setGeneralError(result.message);
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
          Sign up to NextAcademy
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {emailError && (
                <Text color="brand.error" fontSize="sm">
                  {emailError}
                </Text>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="6+ characters"
                value={formData.password}
                onChange={handleInputChange}
              />
            </FormControl>
            <ErrorAlert message={generalError} />
            <Button type="submit" w="100%">
              Create Account
            </Button>
          </VStack>
        </form>
        <Text mt={4}>
          Already have an account?{" "}
          <Link href="/login" color="brand.primary">
            Sign in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Signup;
