// pages/overview.tsx

import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue, Divider } from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";


const OverviewPage: NextPage = () => {
  const [count, setCount] = useState("")

  // Function to get login history data
  const getLoginHistory = async () => {
    try {
      const res = await apiRouterCall({
        method: "GET",
        endPoint: "countApproveCreater",
      });
      if (res.data.responseCode === 200) {
        setCount(res.data.result);

      }
    } catch (error) {

      console.error("Error fetching login history data:", error);
    }
  };

  useEffect(() => {
    getLoginHistory();
  }, []);

  const router = useRouter()
  const data = [
    // { title: "Total BNB Balance (Watch List):", value: "0 BNB ($0.00)" },
    // { title: "Email Notification Limit:", value: "0 emails sent out, 100 daily limit" },
    // { title: "Address Watch List:", value: "0 address alert(s), 50 limit" },
    // { title: "Txn Private Notes:", value: "0 transaction private note(s), 10,000 limit" },
    // { title: "Address Tags:", value: "0 address tag(s), 5,000 limit" },
    // { title: "API Key Usage:", value: "0 active API(s), 3 limit" },
    { title: "Verified Addresses:", value: `${count} verified address`, path: true },
  ];

  const tableBg = useColorModeValue("white", "gray.800");
  const tableColor = useColorModeValue("gray.800", "white");
  const tableDivider = useColorModeValue("gray.200", "gray.700");

  return (
    <Box >
      <Divider />
      <TableContainer>
        <Table variant="striped" >

          <Tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td borderBottom={`1px solid ${tableDivider}`}>{item.title}</Td>
                <Td
                  style={item.path && { cursor: "pointer" }}

                  onClick={() => {
                    if (item.path) {
                      router.push("/accountscontract")
                    }
                  }}
                  borderBottom={`1px solid ${tableDivider}`}>{item.value}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OverviewPage;
