import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Link,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function ChangePassword({ setCheckType, email, setIsForgot }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e: React.FormEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password: any) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { newPassword, confirmPassword } = formData;
      const newErrors = {};
      if (!validatePassword(newPassword))
        newErrors.newPassword =
          "Password must be at least 8 characters long and include a number and a special character.";
      if (newPassword !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
      if (Object.keys(newErrors).length === 0) {
        setIsLoading(true);

        const res = await apiRouterCall({
          method: "POST",
          endPoint: "resetPassword",
          data: {
            email: email,
            password: confirmPassword,
          },
        });
        if (res.data.responseCode === 200) {
          toast({
            title: "Change Password.",
            description: res.data.responseMessage,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsForgot(false);
          setCheckType(true);
          setIsLoading(false);
        }
      } else {
        setErrors(newErrors);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Change Password.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      style={{ width: "100%" }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <Box className="p-8 rounded-lg shadow-lg" maxW="md" w="full">
        <Heading as="h6" size="md" textAlign="center">
          Change Password
        </Heading>

        <form
          onSubmit={handleSubmit}
          style={{ textAlign: "center", margin: "20px 0px" }}
        >
          <FormControl id="newPassword" mb={4} isInvalid={!!errors.newPassword}>
            <FormLabel size="sm">New Password</FormLabel>
            <Box position="relative">
              <Input
                isDisabled={isLoading}
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                h="35px"
              />
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                icon={showPassword ? <HiEyeOff /> : <HiEye />}
                onClick={() => setShowPassword(!showPassword)}
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                variant="link"
                p="0"
                m="0"
              />
            </Box>

            {errors.newPassword && (
              <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="confirmPassword"
            mb={4}
            isInvalid={!!errors.confirmPassword}
          >
            <FormLabel size="sm">Confirm New Password</FormLabel>
            <Box position="relative">
              <Input
                isDisabled={isLoading}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                h="35px"
              />
              <IconButton
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                variant="link"
                p="0"
                m="0"
              />
            </Box>

            {errors.confirmPassword && (
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            isDisabled={isLoading}
            type="submit"
            colorScheme="teal"
            w="full"
            mb={4}
          >
            {isLoading ? "Wait..." : "Reset Password"}
          </Button>
          <Link
            onClick={() => {
              if (!isLoading) {
                setCheckType(false);
                setIsForgot(false);
              }
            }}
          >
            Back to sign in
          </Link>
        </form>
      </Box>
    </Box>
  );
}
