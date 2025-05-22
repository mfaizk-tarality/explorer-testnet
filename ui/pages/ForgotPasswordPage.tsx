import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import OtpModal from "./OtpModal";
import { apiRouterCall } from "ApiConfig/services";
import ChangePassword from "./ChangePassword";

const ForgotPasswordPage = ({ setCheckType, setIsForgot }) => {
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkForgot, setCheckForgot] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    let valid = true;
    let newErrors = { ...errors };

    // Username validation (alphanumeric, 3-15 characters)
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      valid = false;
    } else {
      newErrors.email = "";
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        setIsLoading(true);
        const res = await apiRouterCall({
          method: "PUT",
          endPoint: "forgotPassword",
          data: formData,
        });
        if (res.data.responseCode === 200) {
          setOpen(true);

          toast({
            title: "Forgot Password.",
            description: res.data.responseMessage,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading(false);
        }
      } catch (error: any) {
        setIsLoading(false);
        toast({
          title: "Forgot Password.",
          description: error.response.data.responseMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      {checkForgot ? (
        <ChangePassword
          setCheckType={setCheckType}
          email={formData.email}
          setIsForgot={(item) => setIsForgot(item)}
        />
      ) : (
        <Box
          style={{ display: "flex", justifyContent: "center" }}
          className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
        >
          <Box className="p-8 rounded-lg shadow-lg" maxW="md" w="full">
            <Heading as="h6" size="md" textAlign="center">
              Password Recovery
            </Heading>
            <Box style={{ fontSize: "13px" }} textAlign="center" mb="1" mt="1">
              Enter the email address you used when you joined and we'll send
              you an OTP to reset your password.
            </Box>
            <form
              onSubmit={handleSubmit}
              style={{ textAlign: "center", margin: "20px 0px" }}
            >
              <FormControl id="email" mb={4} isInvalid={!!errors.email}>
                <FormLabel size="sm">Email address</FormLabel>
                <Input
                  isDisabled={isLoading}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  h="35px"
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                    setIsForgot(false);
                    setCheckType(true);
                  }
                }}
              >
                Back to Sign In
              </Link>
            </form>

            {open && (
              <OtpModal
                open={open}
                setOpen={(item) => setOpen(item)}
                endPoint="verifyOtp"
                setCheckType={(item) => setCheckType(item)}
                email={formData.email}
                checkForgot={checkForgot}
                setCheckForgot={(item) => setCheckForgot(item)}
                type="forgot"
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ForgotPasswordPage;
