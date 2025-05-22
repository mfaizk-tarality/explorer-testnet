import {
  Flex,
  Divider,
  useColorModeValue,
  Box,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import config from "configs/app";
import { CONTENT_MAX_WIDTH } from "ui/shared/layout/utils";

import DeFiDropdown from "./DeFiDropdown";
import NetworkMenu from "./NetworkMenu";
import Settings from "./settings/Settings";
import TopBarStats from "./TopBarStats";
import { useAppContext } from "lib/contexts/app";
import { useRouter } from "next/router";

const TopBar = () => {
  const bgColor = useColorModeValue("gray.50", "whiteAlpha.100");
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [currentUrl, setCurrentUrl] = useState("");

  const handleLogout = () => {
    setUser({});
    sessionStorage.removeItem("explorerToken");
    localStorage.removeItem("rememberedUser");
    router.push("/");
  };
  useEffect(() => {
    if (process) {
      setCurrentUrl(window.location.href);
    }
  }, []);
  return (
    <Box bgColor={bgColor}>
      <Flex
        py={2}
        px={{ base: 3, lg: 6 }}
        maxW={`${CONTENT_MAX_WIDTH}px`}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <TopBarStats />
        <Flex alignItems="center">
          {config.features.deFiDropdown.isEnabled && (
            <>
              <DeFiDropdown />
              <Divider
                mr={3}
                ml={{ base: 2, sm: 3 }}
                height={4}
                orientation="vertical"
              />
            </>
          )}
          <Settings />
          {config.UI.navigation.layout === "horizontal" &&
            Boolean(config.UI.navigation.featuredNetworks) && (
              <Box display={{ base: "none", lg: "flex" }}>
                <Divider mx={3} height={4} orientation="vertical" />
                <NetworkMenu />
              </Box>
            )}
          {user?.email ? (
            <Menu>
              <MenuButton as={Button} ml={4} rightIcon={<IoIosArrowDown />}>
                Profile
              </MenuButton>
              <MenuList zIndex="modal">
                <MenuItem onClick={() => router.push("/accountsdetail")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              onClick={() => router.push("/accountssignup")}
              style={{
                marginLeft: "16px",
              }}
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
