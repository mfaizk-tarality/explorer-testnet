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
  IconButton,
  Tooltip,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import LoginPage from "./LoginPage";
import { apiRouterCall } from "ApiConfig/services";
import OtpModal from "./OtpModal";
import { FaInfoCircle } from "react-icons/fa";
import TermsAndConditionsModal from "pages/components/TermsAndConditionsModal";

const SignupPage = () => {
  const [checkType, setCheckType] = useState(true);
  const [otpModal, setOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveNewsletter: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Username validation (alphanumeric, 5-30 characters)
    if (!/^[a-zA-Z0-9]{5,30}$/.test(formData.username)) {
      newErrors.username =
        "Username must be alphanumeric and 5-30 characters long.";
      valid = false;
    } else {
      newErrors.username = "";
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Confirm email validation
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Email address does not match.";
      valid = false;
    } else {
      newErrors.confirmEmail = "";
    }

    // Password validation (min 8 characters, at least one letter, one number, and one special character)
    if (
      !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Password does not match, please check again.";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    // Agree to terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions.";
      valid = false;
    } else {
      newErrors.agreeTerms = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validate()) {
        setIsLoading(true);
        // Handle form submission
        const res = await apiRouterCall({
          method: "POST",
          endPoint: "signupUser",
          data: {
            email: formData.email,
            userName: formData.username,
            password: formData.password,
            isNewsLetter: formData.receiveNewsletter,
          },
        });
        if (res.data.responseCode === 200) {
          if (res?.data?.result?.isEmailExist) {
            const resendResponse = await apiRouterCall({
              method: "PUT",
              endPoint: "resendOtp",
              data: { email: formData?.email },
            });
            if (resendResponse?.data?.responseCode === 200) {
              toast({
                title: "OTP Resent.",
                description: "A new OTP has been sent to your email.",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            }
          } else {
            toast({
              title: "Account Creation.",
              description: res.data.responseMessage,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }

          setOtpModal(true);
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Account Creation.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {termModal && (
        <>
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <TermsAndConditionsModal
              onClose={() => setTermModal(false)}
              isOpen={termModal}
            />
          </div>
        </>
      )}

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
        className="bg-gray-100 dark:bg-gray-900"
      >
        <Box
          borderRadius="12px"
          border="1px solid"
          p="3"
          className="p-8 rounded-lg shadow-lg"
          maxW="md"
          w="full"
        >
          {checkType ? (
            <LoginPage setCheckType={(item) => setCheckType(item)} />
          ) : (
            <>
              <Heading as="h4" size="xl" textAlign="center">
                Signup
              </Heading>
              <Box textAlign="center" mb="1" mt="1">
                Already have an account?
                <Link
                  onClick={() => {
                    if (!isLoading) {
                      setCheckType(true);
                    }
                  }}
                  color="blue.500"
                >
                  &nbsp;Sign In here
                </Link>
              </Box>
              <form onSubmit={handleSubmit}>
                <FormControl id="username" mb={4} isInvalid={!!errors.username}>
                  <FormLabel
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "5px",
                    }}
                  >
                    Username&nbsp;
                    <Tooltip
                      maxWidth="sm"
                      label="Username has to be from 5 to 30 characters in length, only alphanumeric characters allowed"
                      fontSize="sm"
                      placement="top"
                    >
                      <span className="ml-2">
                        <FaInfoCircle />
                      </span>
                    </Tooltip>
                  </FormLabel>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    maxLength={30}
                    required
                    h="35px"
                  />
                  {errors.username && (
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl id="email" mb={4} isInvalid={!!errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    isDisabled={isLoading}
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={56}
                    required
                    h="35px"
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="confirmEmail"
                  mb={4}
                  isInvalid={!!errors.confirmEmail}
                >
                  <FormLabel>Confirm Email Address</FormLabel>
                  <Input
                    isDisabled={isLoading}
                    type="email"
                    name="confirmEmail"
                    placeholder="Confirm your email"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    maxLength={56}
                    required
                    h="35px"
                  />
                  {errors.confirmEmail && (
                    <FormErrorMessage>{errors.confirmEmail}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl id="password" mb={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>

                  <InputGroup h="35px" size="sm">
                    <Input
                      isDisabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      maxLength={30}
                    />
                    <InputRightAddon>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        icon={showPassword ? <HiEyeOff /> : <HiEye />}
                        onClick={() => setShowPassword(!showPassword)}
                        h="35px"
                        variant="link"
                        p="0"
                        m="0"
                      />
                    </InputRightAddon>
                  </InputGroup>
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="confirmPassword"
                  mb={4}
                  isInvalid={!!errors.confirmPassword}
                >
                  <FormLabel>Confirm Password</FormLabel>

                  <InputGroup h="35px" size="sm">
                    <Input
                      isDisabled={isLoading}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      maxLength={30}
                    />
                    <InputRightAddon>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        h="35px"
                        variant="link"
                        p="0"
                        m="0"
                      />
                    </InputRightAddon>
                  </InputGroup>

                  {errors.confirmPassword && (
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="agreeTerms"
                  mb={4}
                  isInvalid={!!errors.agreeTerms}
                >
                  <Checkbox
                    isDisabled={isLoading}
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  >
                    I agree to the{" "}
                    <Link
                      onClick={() => setTermModal(true)}
                      href="#"
                      color="blue.500"
                    >
                      Terms and Conditions
                    </Link>
                  </Checkbox>
                  {errors.agreeTerms && (
                    <FormErrorMessage>{errors.agreeTerms}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl id="receiveNewsletter" mb={4}>
                  <Checkbox
                    isDisabled={isLoading}
                    name="receiveNewsletter"
                    checked={formData.receiveNewsletter}
                    onChange={handleChange}
                  >
                    Receive Newsletter
                  </Checkbox>
                </FormControl>
                <Button
                  isLoading={isLoading}
                  loadingText="Submitting"
                  colorScheme="blue"
                  type="submit"
                  width="full"
                >
                  Create an account
                </Button>
              </form>
            </>
          )}
        </Box>
      </Box>
      {otpModal && (
        <OtpModal
          setCheckForgot={() => {}}
          endPoint="verifyOtp"
          setCheckType={setCheckType}
          email={formData.confirmEmail}
          open={otpModal}
          setOpen={() => setOtpModal(false)}
          type="email"
        />
      )}
    </>
  );
};

export default SignupPage;
