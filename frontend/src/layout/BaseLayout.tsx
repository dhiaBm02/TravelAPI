import { ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import { Header } from "./Header.tsx";
import { Page } from "./Page.tsx";

export const BaseLayout = ({
  children,
  rightMenu,
}: {
  children: ReactNode;
  rightMenu?: ReactNode;
}) => {
  return (
    <VStack bg={"white.500"} h={"100vh"} w={"100%"}>
      <Header rightMenu={rightMenu} />

      <Page>{children}</Page>
    </VStack>
  );
};
