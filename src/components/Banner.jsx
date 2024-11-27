import React from "react";
import { Box, Heading, Text, Image, Flex } from "@chakra-ui/react";

const Banner = ({ header, description, image }) => {
    return (
        <Box
            bg="#FD856C"
            borderRadius="12px"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            w="80%"
            mx="auto"
            boxShadow="lg"
            outline="2px solid black"
        >
            <Flex direction="column" maxW="60%" textAlign="left">
                <Heading as="h2" size="lg" color="white" mb={4} fontFamily="Georgia, serif">
                    {header}
                </Heading>
                <Text color="white" fontSize="md" fontFamily="Georgia, serif">
                    {description}
                </Text>
            </Flex>
            {image && (
                <Image
                    src={image}
                    alt="Banner Image"
                    boxSize="200px"
                    objectFit="contain"
                />
            )}
        </Box>
    );
};

export default Banner;
