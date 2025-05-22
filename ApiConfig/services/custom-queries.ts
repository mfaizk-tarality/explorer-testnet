import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Apiconfigs from "../ApiConfig";

export const getDbTokenInfo = ({ contractAddress }) => {
  return useQuery({
    queryKey: ["token", contractAddress],
    queryFn: async () => {
      const res = await axios({
        url: Apiconfigs.getApprovedCreator,
        params: { contractAddress: contractAddress },
        method: "GET",
      });
      return res.data?.result?.[0];
    },
  });
};
