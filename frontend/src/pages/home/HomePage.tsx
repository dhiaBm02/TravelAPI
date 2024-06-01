import { Box, Button, HStack, Heading, Link } from "@chakra-ui/react";
import { BaseLayout } from "../../layout/BaseLayout";
import { Link as RouterLink } from "react-router-dom";


export const HomePage = () => {
  return (
    <BaseLayout>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap="4">
        <Heading textAlign={"center"}>Welcome to the Trip Destination API by Dhia Eddine Ben Messaoud 1116625</Heading>
        <HStack>
          <Box width="large" height="large" border="1px" borderRadius="md" padding="4" display="flex" justifyContent="center" alignItems="center">
            <Link as={RouterLink} to="/trips">
              <Button>Go to Trips</Button>
            </Link>
          </Box>
          <Box width="large" height="large" border="1px" borderRadius="md" padding="4" display="flex" justifyContent="center" alignItems="center">
            <Link as={RouterLink} to="/destinations">
              <Button>Go to Destinations</Button>
            </Link>
          </Box>
        </HStack>
      </Box>
    </BaseLayout>
  );
};