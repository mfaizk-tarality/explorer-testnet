"use client";

import {
  Box,
  VStack,
  Link,
  useDisclosure,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRouterCall } from "ApiConfig/services";
import { useAppContext } from "lib/contexts/app";
import { FaUser, FaCog, FaList, FaTags } from "react-icons/fa";
import { TbNotes } from "react-icons/tb";

const Sidebar = () => {
  const { isOpen, onClose } = useDisclosure();
  const { user, setUser } = useAppContext();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);
  const textColor = useColorModeValue("gray.600", "white");
  const { pathname } = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, onClose]);

  const sidebarItems = [
    { icon: FaUser, label: "Account Overview", path: "/accountsdetail" },
    { icon: FaCog, label: "Account Settings", path: "/accountssetting" },
    // { icon: FaList, label: 'Watch List', path: '/accountswatchlist' },
    // { icon: FaTags, label: 'Private Name Tags', path: '/privatetags' },
    // { icon: TbNotes, label: 'Txn Private Notes', path: '/txnnotes' },
    {
      icon: TbNotes,
      label: "Verify Token",
      path: "/accountscreatetoken",
    },
  ];

  const SidebarContent = () => (
    <VStack p="4" spacing="4" align="start" color={textColor}>
      <Box w="full" textAlign="left">
        <Text fontWeight="bold">{user?.userName || ""}</Text>
        <Text fontSize="sm">{user?.email || ""}</Text>
        <Divider mt="2" mb="4" />
      </Box>
      {sidebarItems.map((item, index) => (
        <Link
          key={index}
          onClick={() => router.push(item.path)}
          p="2"
          w="full"
          borderRadius="md"
          bg={pathname === item.path ? "#dee2e6" : "transparent"}
          color={pathname === item.path ? "black" : textColor}
          _hover={{ color: pathname === item.path ? "#000" : textColor }}
          display="flex"
          alignItems="center"
        >
          <item.icon style={{ marginRight: "8px" }} />
          {item.label}
        </Link>
      ))}
    </VStack>
  );

  const getProfileHandler = async () => {
    try {
      setProfileLoading(true);
      const res = await apiRouterCall({
        method: "GET",
        endPoint: "getProfile",
      });
      if (res.data.responseCode === 200) {
        setUser(res.data.result);
      }
      setProfileLoading(false);
    } catch (error) {
      setProfileLoading(false);
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //     if (isClient) {
  //         const token = sessionStorage.getItem("explorerToken");
  //         if (token) {
  //             getProfileHandler();
  //         } else {
  //             router.push("/");
  //         }
  //     }
  // }, [isClient, router]);

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      style={{ borderRadius: "10px", height: "100vh" }}
      className="w-64 h-full"
      display={{ base: "none", lg: "block" }}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
