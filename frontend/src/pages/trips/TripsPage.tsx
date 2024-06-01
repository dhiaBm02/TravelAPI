import { BaseLayout } from "../../layout/BaseLayout.tsx";
import { Box, Button, HStack, Input, useDisclosure, Link } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { TripTable } from "./components/TripTable.tsx";
import { CreateTripModal } from "./components/CreateTripModal.tsx";
import { Trip, TripsBody, Destination } from "../../adapter/api/index.ts";
import { useApiClient } from "../../adapter/api/useApiClient.ts";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export const TripsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  //const client = new DefaultApi(new Configuration({ basePath: "/apis/default-api" }), "/apis/default-api", axios.create());
  const client = useApiClient();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDateTerm, setSearchDateTerm] = useState('');
  const [searchDestinationTerm, setSearchDestinationTerm] = useState('');
  const onLoadData = useCallback(async () => {
    const res = await client.getTrips(searchTerm.toLowerCase(), searchDateTerm.toLowerCase());

    //filter trips by destination
    if (searchDestinationTerm === '') {
      setTrips(res.data);
      return;
    }

    const destinationResponse = await axios('/apis/default-api/destinations?name=' + searchDestinationTerm);
    //get id of destination
    if (destinationResponse.data.length === 0) {
      setTrips([]);
      return;
    }

    const destinationId = destinationResponse.data[0].id;



    const destinationTripsResponse = await client.getDestinationsIdTrips(destinationId);

    // intersection of trips and destinationTrips
    const intersection = res.data.filter((trip: { id: any; }) => destinationTripsResponse.data.some((destinationTrip: { id: any; }) => destinationTrip.id === trip.id));

    setTrips(intersection);
    //setTrips(res.data);
  }, [searchTerm, searchDateTerm, searchDestinationTerm]);
  useEffect(() => {
    onLoadData();
  }, [onLoadData]);
  const onCreateTrip = async (data: TripsBody) => {
    await client.postTrips(data);
    onClose();
    await onLoadData();
  };

  const onDeleteTrip = async (trip: Trip) => {
    // alert if trip is not deleted with try catch
    try {
      await client.deleteTripsId(trip.id);
    } catch (e) {
      alert('You can\'t delete this trip because it is the only trip for a destination');
    }
    await onLoadData();
  };

  const onClickAddCalendar = async (trip: Trip) => {
    const url = `/apis/default-api/trips/${trip.id}/calendar`;
    window.location.href = url;
  };

  const [tripToBeUpdated, setTripToBeUpdated] = useState<Trip | null>(
    null,
  );

  const onClickUpdateTrip = async (trip: Trip) => {
    setTripToBeUpdated(trip);
    onOpen();
  };

  const onUpdateTrip = async (trip: TripsBody) => {
    await client.putTripsId(tripToBeUpdated?.id, trip);
    onClose();
    await onLoadData();
    setTripToBeUpdated(null);
  };

  return (
    <BaseLayout>
      <Box>
        <HStack spacing={4} justifyContent={"space-between"}>
          <Button
            variant={"solid"}
            colorScheme={"blue"}
            marginBottom={4}
            onClick={() => {
              onOpen();
            }}
          >
            Create new Trip
          </Button>
          <Link as={RouterLink} to="/destinations">
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              marginBottom={4}
            >
              Browse all Destinations
            </Button>
          </Link>
        </HStack>
        <HStack spacing={4} marginBottom={4}>
          <Input
            type="text"
            placeholder="filter trip by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Input
            type="date"
            placeholder="filter trip by date"
            value={searchDateTerm}
            onChange={e => setSearchDateTerm(e.target.value)}
          />
          <Input type="text"
            placeholder="filter trip by destination name"
            value={searchDestinationTerm}
            onChange={e => setSearchDestinationTerm(e.target.value)}
          />
        </HStack>
        <CreateTripModal
          initialValues={tripToBeUpdated}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setTripToBeUpdated(null);
          }
          }
          onSubmit={(updatedTrip) => {
            const updatedDestinations =
              updatedTrip.destinations?.map((destination: Destination) => {
                return { id: destination.id ?? undefined, label: destination.name, value: destination.name };
              }) ?? [];
            if (tripToBeUpdated) {
              onUpdateTrip({ ...updatedTrip, destinations: updatedDestinations });
            } else {
              onCreateTrip({ ...updatedTrip, destinations: updatedDestinations });
            }
          }}
        />
        <TripTable
          data={trips}
          onClickDeleteTrip={onDeleteTrip}
          onClickUpdateTrip={onClickUpdateTrip}
          onClickAddCalendar={onClickAddCalendar}
        />
      </Box>
    </BaseLayout>
  );
};
