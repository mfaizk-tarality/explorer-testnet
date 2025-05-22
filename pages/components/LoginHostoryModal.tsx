import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
  Box,
  Text,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import { apiRouterCall } from 'ApiConfig/services';

// Utility function to format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60)); // difference in minutes

  if (diff < 60) return `${diff} minutes ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
};

const LoginHistoryModal: React.FC<any> = ({ openHistory, setOpenHistor }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userLoginHistory, setUserLoginHistory] = useState([]);

  // Function to get login history data
  const getLoginHistory = async () => {
    try {
      setIsLoading(true);
      const res = await apiRouterCall({
        method: "GET",
        endPoint: "lastLoginList",
      });
      if (res.data.responseCode === 200) {
        setUserLoginHistory(res.data.result);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching login history data:", error);
    }
  };

  useEffect(() => {
    if (openHistory) {
      // To prevent calling the API twice
      if (isLoading) {
        if(userLoginHistory.length===0){

          getLoginHistory();
        }
      }
    }
  }, [openHistory,isLoading,userLoginHistory]);

  return (
    <Modal isOpen={openHistory} onClose={() => setOpenHistor(false)} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Login History
          <Text fontSize="14px">Showing last 5 login history</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <div className="overflow-y-auto max-h-96">
              <Skeleton height="80px" />
              <Skeleton height="80px" mt="4" />
              <Skeleton height="80px" mt="4" />
            </div>
          ) : userLoginHistory && userLoginHistory.length > 0 ? (
            <Box>
              {userLoginHistory.map((login) => (
                <Box key={login?._id} p="4" mb="4" borderWidth="1px" borderRadius="md" shadow="md">
                  <Flex align="center">
                    <FaClock style={{ marginRight: 8 }} />
                    <Text fontSize="md" fontWeight="semibold">
                      {formatRelativeTime(new Date(login?.lastLoginTime))}
                    </Text>
                  </Flex>
                  <Divider mt="2" />
                  <Text mt="2" fontSize="sm" color="gray.600">
                    Date: {new Date(login?.lastLoginTime).toLocaleString()}
                  </Text>
                </Box>
              ))}
            </Box>
          ) : (
            <Text>No login history found.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => setOpenHistor(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginHistoryModal;
