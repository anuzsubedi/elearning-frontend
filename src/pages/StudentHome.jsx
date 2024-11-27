import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Header from "../components/Header";

const StudentHome = () => (

    <Box textAlign="center" py={10} px={6}>
        <Header />
        <Heading as="h1" size="xl">
            Welcome, Student!
        </Heading>
        <Text mt={4}>Explore courses, view assignments, and much more!</Text>
    </Box>
);

export default StudentHome;
