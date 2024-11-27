import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const TeacherHome = () => (
    <Box textAlign="center" py={10} px={6}>
        <Header />
        <Heading as="h1" size="xl">
            Welcome, Teacher!
        </Heading>
        <Text mt={4}>Manage courses, view student progress, and much more!</Text>
    </Box>
);

export default TeacherHome;
