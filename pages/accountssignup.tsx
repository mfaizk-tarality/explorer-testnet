import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import getNetworkTitle from "lib/networks/getNetworkTitle";

const Signup = dynamic(() => import("ui/pages/SignupPage"), { ssr: false });

const SignupPage: NextPage = () => {
  const title = `Register - ${getNetworkTitle()}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Signup />
    </>
  );
};

export default SignupPage;

export { getServerSideProps } from "lib/next/getServerSideProps";
