import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormLabel,
    FormControl,
    useDisclosure,
    CircularProgress
} from '@chakra-ui/react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SucessMessage';
import { request } from '../lib/request';
import useSessionStorage from '../lib/useSessionStorage';

const CreateServiceModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const token = useSessionStorage('token')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newService = {
            "service": serviceName,
        };
        setIsLoading(true);
        try {
            await request.post('http://localhost:8080/api/services?secret_token=' + token, newService)
                .then((resp) => resp.data);
            setIsLoading(false);
            setSuccess("Le service " + newService.service + " a été créé");
            setError("");
        } catch (error) {
            setSuccess("");
            setError("Le service " + newService.service + " n'a pas été créé");
            setIsLoading(false);
        }
    };

    const clear = () => {
        setError("");
        setSuccess("");
        onClose();
    }

    return (
        <>
            <Button onClick={onOpen}>Créer un service</Button>
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={clear}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Créer un service</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit}>
                        <ModalBody pb={6}>
                            {error && <ErrorMessage message={error} />}
                            {success && <SuccessMessage message={success} />}
                            <FormControl isRequired>
                                <FormLabel>Nom du service</FormLabel>
                                <Input ref={initialRef} placeholder='nom du service' onChange={event => setServiceName(event.currentTarget.value)} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme='green' variant={'outline'} mr={3}>
                                {isLoading ? (<CircularProgress isIndeterminate size="24px" color="teal" />) : ('Créer')}
                            </Button>
                            <Button colorScheme='red' variant={'outline'} onClick={clear}>Quitter</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
export default CreateServiceModal;