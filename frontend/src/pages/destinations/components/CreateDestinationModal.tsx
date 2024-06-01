import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton, TextareaControl } from "formik-chakra-ui";
import ReactSelectControl from "../../../components/ReactSelectControl.tsx";
import { GroupBase } from "react-select";
//import { useApiClient } from "../../../adapter/api/useApiClient.ts";
import { OptionBase } from "chakra-react-select";
import { Trip, Destination } from "../../../adapter/api/index.ts";
import { useApiClient } from "../../../adapter/api/useApiClient.ts";
import { array, date, object, string } from "yup";


interface TripOption extends OptionBase {
  id?: string;
  label: string;
  value: string;
}

export const CreateDestinationSchema = object({
  name: string().required(),
  description: string().required(),
  startDate: date().required(),
  endDate: date().required(),
  trips: array().required().min(1),
});


type DestinationT = Omit<Destination, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Destination, "id">>;

export const CreateDestinationModal = ({
  initialValues,
  onSubmit,
  ...restProps
}: Omit<ModalProps, "children"> & {
  initialValues: DestinationT | null;
  onSubmit?: (data: DestinationT) => void;
}) => {
  const client = useApiClient();
  return (
    <Modal {...restProps}>
      <ModalOverlay />

      <Formik<DestinationT>
        initialValues={{
          ...initialValues,
          trips: initialValues?.trips.map((trip: Trip) => ({
            id: trip.id,
            label: trip.name ?? "",
            value: trip.name ?? "",
          })) ?? [],
          name: initialValues?.name ?? "",
          description: initialValues?.description ?? "",
          activities: initialValues?.activities ?? "",
          startDate: initialValues?.startDate ?? new Date(),
          endDate: initialValues?.endDate ?? new Date(),
        }}
        onSubmit={(e, formikHelpers) => {
          onSubmit?.(e);
          formikHelpers.setSubmitting(false);
        }}
        validationSchema={CreateDestinationSchema}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues
              ? "Edit Destination"
              : "Create Destination"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputControl name={"name"} label={"Name"} />
              <TextareaControl name={"description"} label={"Description"} />
              <InputControl name={"startDate"} label={"Start Date"} />
              <InputControl name={"endDate"} label={"End Date"} />
              <InputControl name={"activities"} label={"activities"} />

              {<ReactSelectControl<TripOption, true, GroupBase<TripOption>>
                name="trips"
                label="Trips"
                selectProps={{
                  isMulti: true,
                  defaultOptions: true,
                  loadOptions: async (inputValue) => {
                    const trips = await client.getTrips();
                    if (trips.status === 200) {
                      return trips.data
                        .filter((trip: Trip) => trip?.id?.includes(inputValue))
                        .map((trip: Trip) => ({
                          id: trip.id,
                          label: trip.name ?? "",
                          value: trip.name ?? "",
                        }));
                    }
                    return [];
                  },
                }}
              />}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <SubmitButton>
              {initialValues ? "Edit Destination" : "Create Destination"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik>
    </Modal>
  );
};
