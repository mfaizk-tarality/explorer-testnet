import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  useToast,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";
import { FaCopy } from "react-icons/fa";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

// Define the form schema using Yup
const schema = yup.object().shape({
  contractAddress: yup.string().required("Contract address is required"),
  message: yup.string(),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  projectName: yup.string(),
  websiteUrl: yup
    .string()
    .url("Invalid URL")
    .required("Website URL is required"),
  officialEmail: yup
    .string()
    .email("Invalid email")
    .required("Official email is required"),
  imageUrl: yup.string().url("Invalid URL").required("Image URL is required"),
  projectSector: yup.string(),
  description: yup.string().required("Description is required"),
});

interface IFormInput {
  contractAddress: string;
  message: string;
  name: string;
  email: string;
  projectName: string;
  websiteUrl: string;
  officialEmail: string;
  imageUrl: string;
  projectSector: string;
  description: string;
}

const TokenCreateForm: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { address, isConnected } = useAccount();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const formdata = new FormData();
        formdata.append("file", e.target.files[0]);
        const res = await apiRouterCall({
          method: "POST",
          endPoint: "uploadImage",
          data: formdata,
        });
        if (res.data.responseCode === 200) {
          const url = res.data.result.url;
          setUploadedImageUrl(url);
          setValue("imageUrl", url); // Optionally set this automatically
          toast({
            title: "Image Uploaded.",
            description: "Image uploaded successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Image Upload Error.",
        description: "There was an error uploading the image.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiRouterCall({
        method: "POST",
        endPoint: "createCretor",
        data: {
          ...data,
          userAddress: address,
        },
      });
      if (res.data.responseCode === 200) {
        router.push("/accountsdetail");
        toast({
          title: "Token Created.",
          description: res.data.responseMessage,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Token Creation Error.",
        description: error.response.data.responseMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.lg">
      <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          p={8}
          bg="white"
          _dark={{ bg: "black", shadow: "lg" }}
        >
          <SimpleGrid columns={2} spacing={4}>
            {[
              {
                name: "contractAddress",
                label: "Contract Address *",
                type: "input",
                placeholder: "Contract Address",
              },
              {
                name: "name",
                label: "Name *",
                type: "input",
                placeholder: "Name",
              },
              {
                name: "email",
                label: "Email *",
                type: "input",
                placeholder: "Email",
              },
              {
                name: "projectName",
                label: "Project Name",
                type: "input",
                placeholder: "Project Name",
              },
              {
                name: "websiteUrl",
                label: "Website URL *",
                type: "input",
                placeholder: "Website URL",
              },
              {
                name: "officialEmail",
                label: "Official Email *",
                type: "input",
                placeholder: "Official Email",
              },
              {
                name: "imageUrl",
                label: "Image URL *",
                type: "input",
                isCopyable: true,
                placeholder: "Image URL",
              },
              {
                name: "projectSector",
                label: "Project Sector",
                type: "input",
                placeholder: "Project Sector",
              },
              // { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Message' },
              {
                name: "description",
                label: "Description *",
                type: "textarea",
                placeholder: "Description",
              },
            ].map(({ name, label, type, isCopyable, placeholder }) => (
              <FormControl
                key={name}
                isInvalid={!!errors[name as keyof IFormInput]}
              >
                <FormLabel htmlFor={name}>{label}</FormLabel>
                {type === "input" ? (
                  <InputGroup>
                    <Input
                      h="35px"
                      isDisabled={isLoading}
                      placeholder={placeholder}
                      id={name}
                      {...register(name as keyof IFormInput)}
                    />
                  </InputGroup>
                ) : (
                  <Textarea
                    h="35px"
                    isDisabled={isLoading}
                    placeholder={placeholder}
                    id={name}
                    {...register(name as keyof IFormInput)}
                  />
                )}
                <FormErrorMessage>
                  {errors[name as keyof IFormInput]?.message}
                </FormErrorMessage>
              </FormControl>
            ))}
            <FormControl>
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                onChange={uploadFileHandler}
                disabled={isLoading}
              />
            </FormControl>
          </SimpleGrid>
          <Button
            isDisabled={isLoading}
            type="submit"
            mt={8}
            colorScheme="blue"
          >
            {isLoading ? "Creating" : "Create"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TokenCreateForm;
