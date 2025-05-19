import BigNumber from "bignumber.js";
import React from "react";

import type { Transaction } from "types/api/transaction";

import config from "configs/app";
import { ZERO } from "lib/consts";
import { currencyUnits } from "lib/units";
import CurrencyValue from "ui/shared/CurrencyValue";
import * as DetailsInfoItem from "ui/shared/DetailsInfoItem";
import IconSvg from "ui/shared/IconSvg";
import TxFee from "ui/shared/tx/TxFee";
import AddressLink from "ui/shared/address/AddressLink";
import CopyToClipboard from "ui/shared/CopyToClipboard";
import { Flex } from "@chakra-ui/react";

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction;
  isLoading?: boolean;
}

const TxDetailsBurntFees = ({ data, isLoading }: Props) => {
  if (
    config.UI.views.tx.hiddenFields?.burnt_fees ||
    (rollupFeature.isEnabled && rollupFeature.type === "optimistic")
  ) {
    return null;
  }

  const value = BigNumber(data.transaction_burnt_fee || 0).plus(
    BigNumber(data.blob_gas_used || 0).multipliedBy(
      BigNumber(data.blob_gas_price || 0)
    )
  );

  if (value.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <>
      <DetailsInfoItem.Label
        hint={`
            Amount of ${
              currencyUnits.ether
            } burned for this transaction. Equals Block Base Fee per Gas * Gas Used
            ${
              data.blob_gas_price && data.blob_gas_used
                ? " + Blob Gas Price * Blob Gas Used"
                : ""
            }
          `}
        isLoading={isLoading}
      >
        Burnt fees
      </DetailsInfoItem.Label>
      <Flex alignItems={"center"} gap={2}>
        <IconSvg
          name="flame"
          boxSize={5}
          color="gray.500"
          isLoading={isLoading}
        />

        <TxFee tx={data} isLoading={isLoading} withUsd />
        <p>to</p>

        <DetailsInfoItem.Value>
          <AddressLink
            type="address"
            ml={2}
            hash="0x0000000000000000000000000000000000000000"
            truncation="constant"
            maxW="100%"
          />
          <CopyToClipboard text="0x0000000000000000000000000000000000000000" />
        </DetailsInfoItem.Value>
      </Flex>
    </>
  );
};

export default React.memo(TxDetailsBurntFees);
