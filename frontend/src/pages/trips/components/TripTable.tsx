import {
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { CalendarIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Destination, Trip } from "../../../adapter/api";

export const TripTable = ({
  data,
  onClickDeleteTrip,
  onClickUpdateTrip,
  onClickAddCalendar,
}: {
  data: Trip[];
  onClickDeleteTrip: (trip: Trip) => void;
  onClickUpdateTrip: (trip: Trip) => void;
  onClickAddCalendar: (trip: Trip) => void;
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Participants</Th>
            <Th>Destinations</Th>
            <Th>Aktionen</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((trip) => {
            return (
              <Tr key={trip.id}>
                <Td>{trip.name}</Td>
                <Td>{trip.description}</Td>
                <Td>{trip.startDate}</Td>
                <Td>{trip.endDate}</Td>
                <Td>{trip.participants}</Td>
                <Td>
                  <HStack>
                    {trip.destinations?.map((destination: Destination) => (
                      <Tag colorScheme={"blue"} key={destination.id}>
                        {destination.name}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
                <Td>
                  <IconButton
                    aria-label={"Delete Trip"}
                    icon={<DeleteIcon />}
                    onClick={() => onClickDeleteTrip(trip)}
                  />{" "}
                  <IconButton
                    aria-label={"Edit Trip"}
                    icon={<EditIcon />}
                    onClick={() => onClickUpdateTrip(trip)}
                  />{" "}
                  <IconButton
                    aria-label={"Add Trip to Calendar"}
                    icon={<CalendarIcon />}
                    onClick={() => onClickAddCalendar(trip)}
                  />{" "}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
