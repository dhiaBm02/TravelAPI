import { BaseLayout } from "../../layout/BaseLayout.tsx";
import { Box, Button, useDisclosure, Link, HStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Trip, Destination, DestinationsBody } from "../../adapter/api/index.ts";
import { useApiClient } from "../../adapter/api/useApiClient.ts";
import { CreateDestinationModal } from "./components/CreateDestinationModal.tsx";
import { DestinationTable } from "./components/DestinationTable.tsx";
import { Link as RouterLink } from "react-router-dom";



export const DestinationsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const client = useApiClient();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const onLoadData = useCallback(async () => {
    const res = await client.getDestinatins();
    setDestinations(res.data);
  }, []);
  useEffect(() => {
    onLoadData();
  }, [onLoadData]);
  const onCreateDestination = async (data: DestinationsBody) => {
    await client.postDestinatins(data);
    onClose();
    await onLoadData();
  };

  const onDeleteDestination = async (destination: Destination) => {
    await client.deleteDestinationsId(destination.id);
    await onLoadData();
  };

  const [destinationToBeUpdated, setDestinationToBeUpdated] = useState<Destination | null>(
    null,
  );

  const onClickUpdateDestination = async (destination: Destination) => {
    setDestinationToBeUpdated(destination);
    onOpen();
  };

  const onUpdateDestination = async (destination: DestinationsBody) => {
    await client.putDestinationsId(destinationToBeUpdated?.id, destination);
    onClose();
    await onLoadData();
    setDestinationToBeUpdated(null);
  };

  return (
    <BaseLayout>
      <Box>
        <HStack spacing={4} justifyContent={"space-between"}>
          <Button
            variant={"solid"}
            colorScheme={"blue"}
            onClick={() => {
              onOpen();
            }}
          >
            Create new Destination
          </Button>
          <Link as={RouterLink} to="/trips">
            <Button
              variant={"solid"}
              colorScheme={"blue"}
            >
              Browse all Trips
            </Button>
          </Link>
        </HStack>
        <CreateDestinationModal
          initialValues={destinationToBeUpdated}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setDestinationToBeUpdated(null);
          }
          }
          onSubmit={(updatedDestination) => {
            const updatedTrips =
              updatedDestination.trips?.map((trip: Trip) => {
                return { id: trip.id ?? undefined, name: trip.name };
              }) ?? [];
            if (destinationToBeUpdated) {
              onUpdateDestination({ ...updatedDestination, trips: updatedTrips });
            } else {
              onCreateDestination({ ...updatedDestination, trips: updatedTrips });
            }
          }}
        />
        <DestinationTable
          data={destinations}
          onClickDeleteDestination={onDeleteDestination}
          onClickUpdateDestination={onClickUpdateDestination}
        />
      </Box>
    </BaseLayout>
  );
};
