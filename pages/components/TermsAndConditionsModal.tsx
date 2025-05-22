import React, { useEffect, useState } from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { apiRouterCall } from "ApiConfig/services";

const TermsAndConditionsModal: React.FC = ({isOpen,onClose}) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

const[termCondition,setTermCondition]=useState([])
const getTermandCondition = async()=>{
  try {
      const res = await apiRouterCall({
          method:"GET",
          endPoint:"staticsContentList",
         
      })
      if(res.data){
        setTermCondition(res?.data?.result[0])
      }
  } catch (error) {
      
  }
}
useEffect(() => {
  getTermandCondition()
}, [])


  return (
    <>
     

      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent className="bg-white dark:bg-gray-800 shadow-lg" maxH="500px" overflowX={'auto'}>
          <ModalHeader className="text-lg font-bold text-gray-900 dark:text-white">Terms and Conditions</ModalHeader>
          <ModalCloseButton className="text-gray-700 dark:text-gray-400" />
          <ModalBody className="p-6 text-gray-700 dark:text-gray-300 space-y-4">
          <div
       
          dangerouslySetInnerHTML={{ __html: termCondition && termCondition.description }}
        />
            {/* Add more terms as needed */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TermsAndConditionsModal;
