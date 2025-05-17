import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import getNetworkTitle from "lib/networks/getNetworkTitle";
import Page from "pages";
import { Button } from "@chakra-ui/react";
import PageTitle from "ui/shared/Page/PageTitle";

const ValidatorPage = dynamic(() => import("./Validators"), {
  ssr: false,
});
const VisualizeePage: NextPage = () => {
  const title = `Validators - ${getNetworkTitle()}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title="Validators" />
      <Button
        onClick={() => {
          window.open("https://docs.tan.live");
        }}
        style={{ marginBottom: "10px" }}
      >
        Become a Validator
      </Button>
      <ValidatorPage />
    </>
  );
};

export default VisualizeePage;
