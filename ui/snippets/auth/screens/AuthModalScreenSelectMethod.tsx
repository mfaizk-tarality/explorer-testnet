import { Button, VStack } from "@chakra-ui/react";
import React from "react";

import type { Screen } from "../types";

import * as mixpanel from "lib/mixpanel";
import { useRouter } from "next/router";

interface Props {
  onSelectMethod: (screen: Screen) => void;
}

const AuthModalScreenSelectMethod = ({ onSelectMethod }: Props) => {
  const router = useRouter();
  const handleEmailClick = React.useCallback(() => {
    // mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
    //   Action: "Email",
    //   Source: "Options selector",
    // });
    // onSelectMethod({ type: "email" });
    // router.push("/api-docs");
  }, [onSelectMethod]);

  const handleConnectWalletClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
      Action: "Wallet",
      Source: "Options selector",
    });
    onSelectMethod({ type: "connect_wallet", loginToRewards: true });
  }, [onSelectMethod]);

  return (
    <VStack spacing={3} mt={4} align="stretch">
      {/* <Button variant="outline" onClick={ handleConnectWalletClick }>Continue with Web3 wallet</Button> */}
      <Button variant="outline" onClick={handleEmailClick}>
        Continue with email
      </Button>
    </VStack>
  );
};

export default React.memo(AuthModalScreenSelectMethod);
