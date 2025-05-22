import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import getNetworkTitle from "lib/networks/getNetworkTitle";
import { Box, Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "./components/SideBar";
import SettingsPage from "ui/pages/AccountsSetting";

const AccountPage: NextPage = () => {
  const title = `Accounts - ${getNetworkTitle()}`;
  const bgColor = useColorModeValue("gray.100", "gray.900");
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr  10fr" }}
        className="h-screen"
      >
        <Sidebar />

        <Box style={{ borderRadius: "10px" }} className="flex-1 p-4">
          <SettingsPage />
        </Box>
      </Grid>
    </>
  );
};

export default AccountPage;

export { getServerSideProps } from "lib/next/getServerSideProps";
