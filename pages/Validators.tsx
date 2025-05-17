import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// import ValidatorTable from 'ui/validator/ValidatorTable';
import ValidatorABI from "../ABI/validator.json";
import useContractData from "ui/customHook/useContractData";
import useApiQuery from "lib/api/useApiQuery";
import { ADDRESS_COUNTERS, ADDRESS_INFO } from "stubs/address";
const ValidatorTable = dynamic(() => import("ui/validators/ValidatorTable"), {
  ssr: false,
});

export default function Validators() {
  const { validatorData, isLoading, error } = useContractData();
  return (
    <div>
      <ValidatorTable data={validatorData} isLoading={isLoading} />
    </div>
  );
}
