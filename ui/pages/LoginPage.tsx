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
  IconButton,
  useToast,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { apiRouterCall } from "ApiConfig/services";
import { useRouter } from "next/router";
import { useAppContext } from "lib/contexts/app";
import OtpModal from "./OtpModal";

const LoginPage = ({ setCheckType }) => {
  const { getProfileHandler } = useAppContext();

  const toast = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    autologin: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const savedUserData = localStorage.getItem("rememberedUser");
    if (savedUserData) {
      const { username, password } = JSON.parse(savedUserData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        username,
        password,
        autologin: true,
      }));
      handleAutoLogin(username, password);
    }
  }, [localStorage.getItem("rememberedUser")]);

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

    if (!/^[a-zA-Z0-9]{3,15}$/.test(formData.username)) {
      newErrors.username =
        "Username must be alphanumeric and 3-15 characters long.";
      valid = false;
    } else {
      newErrors.username = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAutoLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await apiRouterCall({
        method: "POST",
        endPoint: "loginUser",
        data: { userName: username, password },
      });
      if (res.data.responseCode === 200) {
        sessionStorage.setItem("explorerToken", res.data.result.token);
        getProfileHandler();
        router.push("/accountsdetail");
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Account Login.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validate()) {
        setIsLoading(true);
        // Handle form submission
        const res = await apiRouterCall({
          method: "POST",
          endPoint: "loginUser",
          data: {
            userName: formData.username,
            password: formData.password,
          },
        });
        if (res.data.responseCode === 200) {
          sessionStorage.setItem("explorerToken", res.data.result.token);
          getProfileHandler();
          router.push("/accountsdetail");
          toast({
            title: "Login.",
            description: res.data.responseMessage,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          if (formData.autologin) {
            localStorage.setItem(
              "rememberedUser",
              JSON.stringify({
                username: formData.username,
                password: formData.password,
              })
            );
          } else {
            localStorage.removeItem("rememberedUser");
          }

          setIsLoading(false);
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Account Login.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      style={{ display: "flex", justifyContent: "center" }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      {isForgot ? (
        <ForgotPasswordPage
          setIsForgot={(item) => setIsForgot(item)}
          setCheckType={(item) => setCheckType(item)}
        />
      ) : (
        <Box className="p-8 rounded-lg shadow-lg" maxW="md" w="full">
          <Heading as="h4" size="xl" textAlign="center">
            Sign In
          </Heading>
          <Box textAlign="center" mb="1" mt="1">
            Don't have an account?
            <Link
              onClick={() => {
                if (!isLoading) {
                  setCheckType(false);
                }
              }}
              color="blue.500"
            >
              &nbsp;Sign Up
            </Link>
          </Box>
          <form onSubmit={handleSubmit}>
            <FormControl id="username" mb={4} isInvalid={!!errors.username}>
              <FormLabel size="sm">Username</FormLabel>
              <Input
                maxLength={30}
                isDisabled={isLoading}
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                h="35px"
              />
              {errors.username && (
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="password" mb={4} isInvalid={!!errors.password}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormLabel size="sm">Password</FormLabel>
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsForgot(true)}
                >
                  Forgot Your Password?
                </Link>
              </Box>
              <InputGroup h="35px" size="sm">
                <Input
                  maxLength={30}
                  type={showPassword ? "text" : "password"} // Toggle input type based on state
                  name="password"
                  isDisabled={isLoading}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

            <FormControl id="autologin" mb={4}>
              <Checkbox
                name="autologin"
                isChecked={formData.autologin}
                onChange={handleChange}
              >
                Remember & Auto Login
              </Checkbox>
            </FormControl>
            <Button
              isDisabled={isLoading || formData.password === ""}
              type="submit"
              colorScheme="blue"
              w="full"
              mb={4}
            >
              {isLoading ? "Waiting..." : "Login"}
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default LoginPage;
