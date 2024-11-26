import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { user } = useAuth();

  return (
    <Box textAlign="center" py={20}>
      <Heading size="xl" mb={4}>
        Welcome to NextAcademy
      </Heading>
      {user ? (
        <Text fontSize="lg">
          Hi, <strong>{user.full_name}</strong>! Explore your courses and
          profile.
        </Text>
      ) : (
        <>
          <Text fontSize="lg" mb={4}>
            Learn new skills and advance your career. Sign up today!
          </Text>
          <Button
            colorScheme="orange"
            onClick={() => (window.location.href = "/login")}
          >
            Get Started
          </Button>
        </>
      )}
    </Box>
  );
};

export default Landing;
