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
  Switch,
  HStack,
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
    user_type: "",
  });
  const [emailError, setEmailError] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false); // Track user type selection
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

  const handleUserTypeToggle = (checked) => {
    setIsInstructor(checked);
    setFormData({ ...formData, user_type: checked ? "Instructor" : "Student" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (emailError) {
      setGeneralError("Please resolve the email error.");
      return;
    }

    try {
      const result = await signup(formData);
      if (result.success) {
        navigate("/login");
      } else {
        setGeneralError(result.message);
      }
    } catch (err) {
      setGeneralError("An unexpected error occurred. Please try again.");
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
            <HStack justifyContent="space-between" w="100%">
              <FormLabel mb={0}>Sign up as Instructor</FormLabel>
              <Switch
                isChecked={isInstructor}
                onChange={(e) => handleUserTypeToggle(e.target.checked)}
                colorScheme="orange"
              />
            </HStack>
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
