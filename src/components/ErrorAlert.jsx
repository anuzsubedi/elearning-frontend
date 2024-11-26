import React from "react";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <Alert status="error" mt={4} borderRadius="md">
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
