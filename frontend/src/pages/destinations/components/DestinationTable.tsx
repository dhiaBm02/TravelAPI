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
  Link,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Destination, Trip } from "../../../adapter/api";
import { Link as RouterLink } from "react-router-dom";


export const DestinationTable = ({
  data,
  onClickDeleteDestination,
  onClickUpdateDestination,
}: {
  data: Destination[];
  onClickDeleteDestination: (destination: Destination) => void;
  onClickUpdateDestination: (destination: Destination) => void;
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
            <Th>Activities</Th>
            <Th>Trips</Th>
            <Th>Aktionen</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((destination) => {
            return (
              <Tr key={destination.id}>
                <Td>{destination.name}</Td>
                <Td>{destination.description}</Td>
                <Td>{destination.startDate}</Td>
                <Td>{destination.endDate}</Td>
                <Td>{destination.activities}</Td>
                <Td>
                  <HStack>
                    {destination.trips?.map((trip: Trip) => (
                      <Tag colorScheme={"blue"} key={trip.id}>
                        {trip.name}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
                <Td>
                  <IconButton
                    aria-label={"Delete Destination"}
                    icon={<DeleteIcon />}
                    onClick={() => onClickDeleteDestination(destination)}
                  />{" "}
                  <IconButton
                    aria-label={"Edit Destination"}
                    icon={<EditIcon />}
                    onClick={() => onClickUpdateDestination(destination)}
                  />{" "}
                  <Link as={RouterLink} to={`/destinations/${destination.id}`}>
                    <IconButton
                      aria-label={"Open Destination"}
                      icon={<ViewIcon />}

                    />
                  </Link>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
