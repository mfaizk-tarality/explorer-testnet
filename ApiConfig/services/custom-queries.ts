import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { api } from ".";

export const getDbTokenInfo = ({ contractAddress }) => {
  return useQuery({
    queryKey: ["token", contractAddress],
    queryFn: async () => {
      const res = await api({
        url: "/creator/getApprovedCreator",
        params: { contractAddress: contractAddress },
        method: "GET",
      });
      return res.data?.result?.[0];
    },
  });
};
