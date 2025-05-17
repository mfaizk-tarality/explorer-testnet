import { useEffect, useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import ValidatorABI from "../../ABI/validator.json";
import { Address } from "viem";

const validatorContract = {
  address: "0x0000000000000000000000000000000000001001" as Address,
  abi: ValidatorABI,
} as const;

const useContractData = () => {
  const [validatorData, setValidatorData] = useState<
    { address: string; amount: string }[]
  >([]);

  const {
    data: validatorAddresses,
    isLoading: isLoadingValidators,
    error,
  } = useReadContract({
    ...validatorContract,
    functionName: "validators",
  });

  const validatorReads = (validatorAddresses ?? [])
    ?.map((addr) => [
      {
        ...validatorContract,
        functionName: "isValidator",
        args: [addr],
      },
      {
        ...validatorContract,
        functionName: "accountStake",
        args: [addr],
      },
    ])
    .flat();

  const { data: validatorDetailsData, isLoading: isLoadingDetails } =
    useReadContracts({
      contracts: validatorReads,
      allowFailure: true,
    });

  useEffect(() => {
    if (!validatorDetailsData || !validatorAddresses) return;

    const result: { address: string; amount: string }[] = [];

    for (let i = 0; i < validatorAddresses?.length; i++) {
      const isValidatorResult = validatorDetailsData[i * 2];
      const stakeResult = validatorDetailsData[i * 2 + 1];

      if (
        isValidatorResult.status === "success" &&
        isValidatorResult.result === true &&
        stakeResult.status === "success"
      ) {
        const amountInEther = (
          BigInt(stakeResult.result as string) /
          10n ** 18n
        ).toString();
        result.push({
          address: validatorAddresses[i] as string,
          amount: amountInEther,
        });
      }
    }

    setValidatorData(result);
  }, [validatorDetailsData, validatorAddresses]);

  return {
    validatorData,
    isLoading: isLoadingValidators || isLoadingDetails,
    error,
  };
};

export default useContractData;
