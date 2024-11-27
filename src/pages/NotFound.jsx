import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const NotFound = () => (
    <Box textAlign="center" py={10} px={6}>
        <Heading as="h1" size="xl">
            Page Not Found
        </Heading>
        <Text mt={4}>The page you are looking for does not exist.</Text>
    </Box>
);

export default NotFound;
