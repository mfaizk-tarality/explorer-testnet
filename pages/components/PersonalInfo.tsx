import { Box, Text, VStack, Grid, GridItem, Button, Divider, Stack, Container, Input } from "@chakra-ui/react";
import { useAppContext } from 'lib/contexts/app';
import { useState } from 'react';
import LoginHistoryModal from './LoginHostoryModal';
import OverviewPage from './OverviewPage';
import { useRouter } from 'next/router';

const PersonalInfo = () => {
    const { user, getProfileHandler, setUser } = useAppContext();
    const router = useRouter()
    const [openHistory, setOpenHistor] = useState(false)
    const [emailField, setEmailField] = useState(false)
    console.log(">>>>>>>user", user);

    return (
        <>
            <Container maxW="container.lg" >

                <Stack spacing={6}>

                    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                        <VStack spacing="4" align="start">
                            <Box style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                <Text fontSize="2xl" fontWeight="bold">Personal Info</Text>
                                <Button onClick={() => {
                                    setUser({})
                                    sessionStorage.removeItem("explorerToken")
                                    localStorage.removeItem("rememberedUser")
                                    router.push("/")
                                }}>Sign Out</Button>
                            </Box>
                            <Text fontSize="sm" color="gray.600">
                                Below are the username, email, and overview information for your account.
                            </Text>
                            <Divider />

                            <Grid templateColumns="repeat(3, 1fr)" gap="4" w="full">
                                <GridItem>
                                    <Text fontWeight="bold">Username</Text>
                                </GridItem>
                                <GridItem>
                                    <Text>{user?.userName || null}</Text>
                                </GridItem>
                            </Grid>
                            <Divider />

                            <Grid templateColumns="repeat(3, 1fr)" gap="4" w="full">
                                <GridItem>
                                    <Text fontWeight="bold">Email</Text>
                                </GridItem>
                                <GridItem>
                                    {emailField ? (
                                        <Input
                                            //  isDisabled={isLoading}
                                            type="email"
                                            name="email"
                                            placeholder='Enter your email'
                                            //  value={formData.email}
                                            //  onChange={handleChange}
                                            required
                                            h="35px"
                                        />

                                    ) : (
                                        <Text>{user?.email || null}</Text>
                                    )}

                                </GridItem>
                                <GridItem textAlign="right">
                                    <Button onClick={() => router.push("/accountssetting")} mt="2" colorScheme="blue" size="sm">{emailField ? "Cancel" : "Edit"} </Button>
                                </GridItem>
                            </Grid>
                            <Divider />

                            <Grid templateColumns="repeat(3, 1fr)" gap="4" w="full">
                                <GridItem>
                                    <Text fontWeight="bold">Last Login</Text>
                                </GridItem>
                                <GridItem>
                                    <Text>{new Date(user?.lastLoginTime)?.toLocaleString()}</Text>
                                </GridItem>
                                <GridItem textAlign="right">
                                    <Button onClick={() => setOpenHistor(true)} mt="2" colorScheme="blue" size="sm">History</Button>
                                </GridItem>
                            </Grid>
                        </VStack>
                    </Box>

                    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                        <VStack spacing="4" align="start">
                            <Text fontSize="2xl" fontWeight="bold">Overview</Text>
                            {/* <Text fontSize="sm" color="gray.600">
                            Usage of account features such as address watch list, address name tags, and API keys.
                        </Text> */}
                            <Divider />
                        </VStack>

                        <OverviewPage />
                    </Box>
                </Stack>
            </Container>
            {openHistory && (
                <LoginHistoryModal openHistory={openHistory} setOpenHistor={(item) => setOpenHistor(item)} />
            )}
        </>
    );
};

export default PersonalInfo;
