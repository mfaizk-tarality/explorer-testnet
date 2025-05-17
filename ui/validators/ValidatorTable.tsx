"use client";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import { default as Thead } from "ui/shared/TheadSticky";
const ValidatorTableItem = dynamic(() => import("./ValidatorTableItem"), {
  ssr: false,
});

interface Props {
  data: Array<any>;
  isLoading?: boolean;
}

const ValidatorTable = ({ data, isLoading }: Props) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box overflowX="auto">
      <Table variant="simple" minWidth="1040px" size="md" fontWeight={500}>
        <Thead>
          <Tr>
            <Th width="125px">Active Validators</Th>
            <Th width="120px" display={isMobile ? "table-cell" : "table-cell"}>
              Staked Amount
            </Th>{" "}
            <Th width="120px">Current Balance</Th>
            <Th width="120px" display={isMobile ? "table-cell" : "table-cell"}>
              Block Validates
            </Th>{" "}
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence initial={false}>
            {data?.map((item, index) => (
              <ValidatorTableItem
                key={index}
                data={item}
                isLoading={isLoading}
              />
            ))}
          </AnimatePresence>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ValidatorTable;
