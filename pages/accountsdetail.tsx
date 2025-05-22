import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import getNetworkTitle from "lib/networks/getNetworkTitle";
import { Box, Flex, Grid, useColorModeValue } from "@chakra-ui/react";
import Sidebar from "./components/SideBar";
import PersonalInfo from "./components/PersonalInfo";

const Signup = dynamic(() => import("ui/pages/SignupPage"), { ssr: false });

const AccountPage: NextPage = () => {
  const title = `Accounts - ${getNetworkTitle()}`;
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
          <PersonalInfo />
        </Box>
      </Grid>
    </>
  );
};

export default AccountPage;

export { getServerSideProps } from "lib/next/getServerSideProps";
