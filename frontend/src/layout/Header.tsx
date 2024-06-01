import { Box, Flex, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Header = ({ rightMenu }: { rightMenu?: ReactNode }) => {
  return (
    <HStack bg={"white.500"} p={8} w={"100%"}>
      <Box flex={1}>FWE SS 2024 Dhia Eddine Ben Messaoud</Box>
      <Flex justifyContent={"flex-end"} flex={1}>
        {rightMenu}
      </Flex>
    </HStack>
  );
};
