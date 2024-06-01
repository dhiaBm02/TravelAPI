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
import { date, object, string } from "yup";


interface DestinationOption extends OptionBase {
  id?: string;
  label: string;
  value: string;
}

export const CreatetripSchema = object({
  name: string().required(),
  description: string().required(),
  startDate: date().required(),
  endDate: date().required(),
});

type TripT = Omit<Trip, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Trip, "id">>;

export const CreateTripModal = ({
  initialValues,
  onSubmit,
  ...restProps
}: Omit<ModalProps, "children"> & {
  initialValues: TripT | null;
  onSubmit?: (data: TripT) => void;
}) => {
  const client = useApiClient();
  return (
    <Modal {...restProps}>
      <ModalOverlay />

      <Formik<TripT>
        initialValues={{
          ...initialValues,
          destinations: initialValues?.destinations.map((destination: Destination) => ({
            id: destination.id,
            label: destination.name ?? "",
            value: destination.name ?? "",
          })) ?? [],
          name: initialValues?.name ?? "",
          description: initialValues?.description ?? "",
          startDate: initialValues?.startDate ?? new Date(),
          endDate: initialValues?.endDate ?? new Date(),
          participants: initialValues?.participants ?? "",
        }}
        onSubmit={(e, formikHelpers) => {
          onSubmit?.(e);
          formikHelpers.setSubmitting(false);
        }}
        validationSchema={CreatetripSchema}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues
              ? "Edit Trip"
              : "Create Trip"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputControl name={"name"} label={"Name"} />
              <TextareaControl name={"description"} label={"Description"} />
              <InputControl name={"startDate"} label={"Start Date"} />
              <InputControl name={"endDate"} label={"End Date"} />
              <InputControl name={"participants"} label={"Participants"} />

              {<ReactSelectControl<DestinationOption, true, GroupBase<DestinationOption>>
                name="destinations"
                label="Destinations"
                selectProps={{
                  isMulti: true,
                  defaultOptions: true,
                  loadOptions: async (inputValue) => {
                    const destinations = await client.getDestinatins();
                    if (destinations.status === 200) {
                      return destinations.data
                        .filter((destination: Destination) => destination?.id?.includes(inputValue))
                        .map((destination: Destination) => ({
                          id: destination.id,
                          label: destination.name ?? "",
                          value: destination.name ?? "",
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
              {initialValues ? "Edit Trip" : "Create Trip"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik>
    </Modal>
  );
};
