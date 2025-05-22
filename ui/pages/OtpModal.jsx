import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  PinInput,
  PinInputField,
  useDisclosure,
  useToast,
  FormLabel,
} from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";
import { useAppContext } from "lib/contexts/app";

const OtpModal = ({
  setOpen,
  open,
  endPoint,
  setCheckType,
  email,
  setCheckForgot,
  type,
  subscription,
}) => {
  const { user, getProfileHandler } = useAppContext();
  const [otp, setOtp] = useState("");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let countdown;
    if (open && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(countdown);
  }, [open, timer]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async () => {
    if (otp.length === 6) {
      setIsLoading(true);
      try {
        // Handle OTP verification logic here
        const res = await apiRouterCall({
          method: type === "accountsetting" ? "POST" : "PUT",
          endPoint: endPoint,
          data: {
            email: email,
            otp: otp,
            isNewsLetter: subscription || false,
          },
        });
        if (res.data.responseCode === 200) {
          getProfileHandler();
          toast({
            title: "OTP Verified.",
            description: "Your OTP has been successfully verified.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsLoading(false);
          if (type !== "accountsetting") {
            if (type === "forgot") {
              setCheckForgot(true);
            }
            if (type !== "forgot") {
              setCheckType(true);
            }
          }

          setOpen(false);
        }
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "OTP Verification",
          description: error?.response?.data?.responseMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      setIsLoading(false);
      toast({
        title: "Invalid OTP.",
        description: "Please enter a valid 6-digit OTP.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await apiRouterCall({
        method: "PUT",
        endPoint: "resendOtp",
        data: { email: email },
      });
      if (res.data.responseCode === 200) {
        toast({
          title: "OTP Resent.",
          description: "A new OTP has been sent to your email.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setTimer(120); // Reset timer to 3 minutes
        setCanResend(false);
      }
    } catch (error) {
      toast({
        title: "Resend OTP Failed",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Modal
      size="sm"
      isOpen={open}
      onClose={() => {
        if (!isLoading) setOpen(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader style={{ fontSize: "16px" }}>
          OTP sent to {email}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel size="sm">OTP</FormLabel>
          <HStack justify="center">
            <PinInput
              otp
              value={otp}
              onChange={handleOtpChange}
              size="lg"
              placeholder=""
            >
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
        </ModalBody>
        <ModalFooter
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            isDisabled={otp.length !== 6 || isLoading}
            colorScheme="blue"
            onClick={handleSubmit}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <Button
            mt={4}
            variant="link"
            onClick={handleResendOtp}
            isDisabled={!canResend}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${formatTime(timer)}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OtpModal;
