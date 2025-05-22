import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  FormErrorMessage,
  Select,
  GridItem,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { NextPage } from "next";

import { apiRouterCall } from "ApiConfig/services";
import PasswordInput from "pages/components/PasswordInput";
import { useRouter } from "next/router";
import { useAppContext } from "lib/contexts/app";
import OtpModal from "./OtpModal";

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { user, getProfileHandler, setUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [verifyEmailOtp, setVeriyEmailOtp] = useState(false);
  const [subscription, setSubscription] = useState(false); // Default is "subscribe"
  const [reason, setReason] = useState("");
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [unsubscribeReasons, setUnsubscribeReasons] = useState([]);
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleUpdateEmail = async () => {
    // Implement email update logic here
    try {
      setIsLoading2(true);
      const res = await apiRouterCall({
        method: "PUT",
        endPoint: "updateEmail",
        data: {
          email: email || user?.email,
        },
      });
      if (res.data.responseCode === 200) {
        toast({
          title: "Email Updated.",
          description: res.data.responseMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setVeriyEmailOtp(true);
        setIsLoading2(false);
      }
    } catch (error: any) {
      toast({
        title: "Email Update Error.",
        description: error.response.data.responseMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading2(false);
    }
  };

  const handleUpdatePassword = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long and include a number and a special character.";
    }
    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required.";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      setIsLoading(true);
      const res = await apiRouterCall({
        method: "POST",
        endPoint: "changePassword",
        data: {
          password: oldPassword,
          newPassword: confirmPassword,
        },
      });
      if (res.data.responseCode === 200) {
        sessionStorage.removeItem("explorerToken");
        localStorage.removeItem("rememberedUser");
        setUser({});
        router.push("/");
        toast({
          title: "Password Updated.",
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
        title: "Password Update Error.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (isConfirmDelete) {
        setIsLoading1(true);

        // Implement account deletion logic here
        const res = await apiRouterCall({
          method: "DELETE",
          endPoint: "deleteAccount",
        });
        if (res.data.responseCode === 200) {
          sessionStorage.removeItem("explorerToken");
          localStorage.removeItem("rememberedUser");
          setUser({});
          router.push("/");
          toast({
            title: "Account Deleted.",
            description: res.data.responseMessage,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading1(false);
        }
      } else {
        toast({
          title: "Confirmation Required.",
          description: "Please confirm you want to delete your account.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      setIsLoading1(false);
      toast({
        title: "Delete Error",
        description: error?.response?.data?.responseMessage,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReasonChange = (reason) => {
    setUnsubscribeReasons((prevReasons) =>
      prevReasons.includes(reason)
        ? prevReasons.filter((r) => r !== reason)
        : [...prevReasons, reason]
    );
  };
  const unsubscribeHandler = async () => {
    try {
      const res = await apiRouterCall({
        method: "PUT",
        endPoint: "unSubscribed",
        data: {
          reason: unsubscribeReasons[0],
        },
      });
      if (res.data) {
        getProfileHandler();
        setSubscription(false);
        toast({
          title: "Unsubscribe.",
          description: res.data.responseMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {}
  };

  return (
    <Container maxW="container.lg">
      <Stack>
        {/* Update Email Section */}
        <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
          <Text fontSize="lg" mb={4}>
            Update Email
          </Text>
          <FormControl id="email" mb={4}>
            <FormLabel>Email Address</FormLabel>
            <Input
              isDisabled={isLoading || isLoading1 || isLoading2}
              h="35px"
              type="email"
              value={email || user?.email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={56}
            />
          </FormControl>
          <FormControl>
            <Checkbox
              isChecked={subscription || user?.isSubscribed}
              onChange={() => setSubscription(subscription ? false : true)}
              isDisabled={isLoading}
            >
              Subscribe News Letter
            </Checkbox>
          </FormControl>
          <Button
            style={{ margin: "10px 0px" }}
            isDisabled={isLoading || isLoading1 || isLoading2}
            colorScheme="blue"
            onClick={handleUpdateEmail}
          >
            {isLoading2 ? "Updating..." : "Update Email"}
          </Button>
        </Box>

        {user?.isSubscribed && (
          <Box mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Text fontSize="lg" mb={4}>
              Newsletter Subscription
            </Text>
            <FormControl id="subscription" mb={4}>
              <FormLabel>Subscription Status</FormLabel>

              <Checkbox
                isChecked={subscription === "unsubscribe"}
                onChange={() => setSubscription("unsubscribe")}
                isDisabled={isLoading}
              >
                Unsubscribe
              </Checkbox>
            </FormControl>

            {subscription === "unsubscribe" && (
              <Accordion allowToggle mb={4}>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Reasons for Unsubscribing
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Grid templateColumns="repeat(6, 1fr)" gap={4}>
                      <GridItem>
                        <Checkbox
                          style={{ whiteSpace: "pre" }}
                          value="too many emails"
                          onChange={() => handleReasonChange("too many emails")}
                          isDisabled={isLoading}
                          isChecked={unsubscribeReasons.includes(
                            "too many emails"
                          )}
                        >
                          Too many emails
                        </Checkbox>
                      </GridItem>
                      <GridItem>
                        <Checkbox
                          style={{ whiteSpace: "pre" }}
                          value="not interested"
                          onChange={() => handleReasonChange("not interested")}
                          isDisabled={isLoading}
                          isChecked={unsubscribeReasons.includes(
                            "not interested"
                          )}
                        >
                          Not interested
                        </Checkbox>
                      </GridItem>
                      <GridItem>
                        <Checkbox
                          style={{ whiteSpace: "pre" }}
                          value="content not relevant"
                          onChange={() =>
                            handleReasonChange("content not relevant")
                          }
                          isDisabled={isLoading}
                          isChecked={unsubscribeReasons.includes(
                            "content not relevant"
                          )}
                        >
                          Content not relevant
                        </Checkbox>
                      </GridItem>
                      <GridItem>
                        <Checkbox
                          style={{ whiteSpace: "pre" }}
                          value="other"
                          onChange={() => handleReasonChange("other")}
                          isDisabled={isLoading}
                          isChecked={unsubscribeReasons.includes("other")}
                        >
                          Other
                        </Checkbox>
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}

            <Button
              isDisabled={isLoading}
              colorScheme="blue"
              onClick={() => unsubscribeHandler()}
            >
              {isLoading
                ? "Processing..."
                : subscription === "subscribe"
                ? "Subscribe"
                : "Unsubscribe"}
            </Button>
          </Box>
        )}

        <Divider />

        {/* Update Password Section */}
        <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
          <Text fontSize="lg" mb={4}>
            Update Password
          </Text>
          <PasswordInput
            isDisabled={isLoading || isLoading1 || isLoading2}
            error={errors.oldPassword}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            id="old-password"
            placeholder="Enter Old Password"
          />
          <PasswordInput
            isDisabled={isLoading || isLoading1 || isLoading2}
            error={errors.newPassword}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            id="new-password"
            placeholder="Enter New Password"
          />
          <PasswordInput
            isDisabled={isLoading || isLoading1 || isLoading2}
            error={errors.confirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirm-password"
            placeholder="Re-confirm New Password"
          />
          <Button
            isDisabled={isLoading || isLoading1 || isLoading2}
            colorScheme="blue"
            onClick={handleUpdatePassword}
          >
            {isLoading ? "Updating" : "Update Password"}
          </Button>
        </Box>

        <Divider />

        {/* Delete Account Section */}
        <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
          <Text fontSize="lg" mb={4} color="red.600">
            Delete Account
          </Text>
          <Text mb={4}>
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </Text>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox
              isChecked={isConfirmDelete}
              onChange={(e) => setIsConfirmDelete(e.target.checked)}
            >
              Confirm that I want to delete my account
            </Checkbox>
            <Button
              isDisabled={
                isLoading || isLoading1 || !isConfirmDelete || isLoading2
              }
              mt={4}
              colorScheme="red"
              onClick={() => handleDeleteAccount()}
            >
              {isLoading1 ? "Deleting..." : "Delete Account"}
            </Button>
          </Box>
        </Box>
      </Stack>
      {verifyEmailOtp && (
        <OtpModal
          endPoint="verifyEmail"
          open={verifyEmailOtp}
          setOpen={(item) => setVeriyEmailOtp(item)}
          setCheckType={() => {}}
          email={email}
          setCheckForgot={() => {}}
          type="accountsetting"
          subscription={subscription}
        />
      )}
    </Container>
  );
};

export default SettingsPage;
