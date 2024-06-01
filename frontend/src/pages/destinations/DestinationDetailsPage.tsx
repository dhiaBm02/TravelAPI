import { Badge, Box, Heading, Spinner, Text, VStack, Link, Flex, Divider, Image, HStack } from "@chakra-ui/react";
import { BaseLayout } from "../../layout/BaseLayout";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiClient } from "../../adapter/api/useApiClient";
import { Link as RouterLink } from "react-router-dom";
import { format } from 'date-fns';

export const DestinationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const client = useApiClient();
  const [destination, setDestination] = useState<any | null>(null);

  const onLoadData = useCallback(async () => {
    try {
      const res = await client.getDestinationsId(id);
      setDestination(res.data);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    onLoadData();
  }, [onLoadData]);

  return (
    <BaseLayout>
      {destination ? (
        <Box maxW="800px" mx="auto" mt={10} p={6} shadow="md" borderWidth="1px" borderRadius="lg">
          <HStack spacing={4} align="center">
            <VStack spacing={4}>
              <Heading size="xl" color="teal.500">{destination.name}</Heading>
              <Text fontSize="lg" color="gray.600">{destination.description}</Text>

              {destination.country && (
                <Box textAlign="center">
                  <Text fontSize="2xl">{destination.country.emoji} {destination.country.name}</Text>
                  <Text fontSize="lg" color="gray.600">{destination.country.capital}</Text>
                </Box>
              )}

              <Divider my={4} />

              <Badge colorScheme="teal" p={2} fontSize="md">Activities: {destination.activities}</Badge>
              <Badge colorScheme="teal" p={2} fontSize="md">Start Date: {format(new Date(destination.startDate), 'MMMM dd, yyyy')}</Badge>
              <Badge colorScheme="teal" p={2} fontSize="md">End Date: {format(new Date(destination.endDate), 'MMMM dd, yyyy')}</Badge>
            </VStack>

            {destination.weather && (
              <Box textAlign="center" mt={5}>
                <Heading as="h3" size="lg" mb={4}>Current Weather in {destination.weather.name}</Heading>
                <Flex align="center" justify="center" mb={4}>
                  <Text fontSize="2xl">{destination.weather.main.temp}°C</Text>
                </Flex>
                <Text fontSize="md" mb={2}><strong>Condition:</strong> {destination.weather.weather[0].description}</Text>
                <Text fontSize="md" mb={2}><strong>Humidity:</strong> {destination.weather.main.humidity}%</Text>
                <Text fontSize="md" mb={2}><strong>Wind Speed:</strong> {destination.weather.wind.speed} m/s</Text>
              </Box>
            )}
          </HStack>

          <Box display="flex" justifyContent="center" mt={5}>
            <Link as={RouterLink} to="/destinations">
              <Text color="teal.500" fontSize="lg">Back to Destinations</Text>
            </Link>
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      )}
    </BaseLayout>
  );
};
