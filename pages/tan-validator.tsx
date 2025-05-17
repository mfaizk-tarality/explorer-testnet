import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import getNetworkTitle from "lib/networks/getNetworkTitle";
import { Button } from "@chakra-ui/react";
import PageTitle from "ui/shared/Page/PageTitle";
import useContractData from "ui/customHook/useContractData";
import ValidatorTable from "ui/validators/ValidatorTable";

const VisualizeePage: NextPage = () => {
  const title = `Validators - ${getNetworkTitle()}`;
  const { validatorData, isLoading } = useContractData();

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
      <div>
        <ValidatorTable data={validatorData} isLoading={isLoading} />
      </div>
    </>
  );
};

export default VisualizeePage;
