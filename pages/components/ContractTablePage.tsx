import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Button,
    Container,
    IconButton,
    Tooltip,
    Skeleton,
    Text
} from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";

// Utility function to shorten address
const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(date); // 'en-GB' for DD-MM-YYYY format
};

const ContractTablePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [verifiedData, setVerifiedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = verifiedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(verifiedData.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const copyToClipboard = (address) => {
        navigator.clipboard.writeText(address)
            .then(() => {
                alert("Address copied to clipboard!");
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const cratorRequesListHandler = async () => {
        setIsLoading(true);
        try {
            const res = await apiRouterCall({
                method: 'GET',
                endPoint: 'cratorRequesList',
            });
            if (res.data) {
                setVerifiedData(res.data.result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        cratorRequesListHandler();
    }, []);

    return (
        <Container maxW="container.lg">
            <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" overflowX="auto">
                <Table variant="striped" colorScheme="blue" className="shadow-lg">
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Status</Th>
                            <Th>Reason</Th>
                            <Th>Verified Date</Th> {/* New column for formatted date */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isLoading ? (
                            [...Array(itemsPerPage)].map((_, index) => (
                                <Tr key={index}>
                                    <Td><Skeleton height="20px" /></Td>
                                    <Td><Skeleton height="20px" /></Td>
                                    <Td><Skeleton height="20px" /></Td>
                                </Tr>
                            ))
                        ) : verifiedData.length === 0 ? (
                            <Tr>
                                <Td colSpan={4} textAlign="center">
                                    <Text>No data found.</Text>
                                </Td>
                            </Tr>
                        ) : (
                            currentItems.map((item, index) => (
                                <Tr key={index}>
                                    <Td isTruncated maxWidth="120px">
                                        {shortenAddress(item?.contractAddress)}
                                        <Tooltip label="Copy to clipboard" fontSize="md">
                                            <IconButton
                                                icon={<FaCopy />}
                                                onClick={() => copyToClipboard(item?.contractAddress)}
                                                variant="link"
                                                aria-label="Copy address"
                                                size="sm"
                                                ml={2}
                                            />
                                        </Tooltip>
                                    </Td>

                                    <Td sx={{ color: item?.status == 'APPROVED' ? 'green' : 'red', fontWeight: '600' }}>{item?.status}</Td>
                                    <Td>
                                        {item?.rejectReason ? (
                                            <Tooltip label={item?.rejectReason} fontSize="md">
                                                <Box isTruncated maxWidth="150px">{item?.rejectReason}</Box>
                                            </Tooltip>
                                        ) : (
                                            <Box isTruncated maxWidth="150px">-</Box>
                                        )}
                                    </Td>
                                    <Td>{formatDate(item?.updatedAt)}</Td> {/* Use formatDate function here */}
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
                <Box display="flex" justifyContent="space-between" mt={4} flexWrap="wrap">
                    <Button
                        onClick={handlePreviousPage}
                        isDisabled={currentPage === 1 || isLoading}
                        size="sm"
                        mt={[2, 0]}
                    >
                        Previous
                    </Button>
                    <Box mt={[2, 0]}>Page {currentPage} of {totalPages}</Box>
                    <Button
                        onClick={handleNextPage}
                        isDisabled={currentPage === totalPages || isLoading}
                        size="sm"
                        mt={[2, 0]}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ContractTablePage;
