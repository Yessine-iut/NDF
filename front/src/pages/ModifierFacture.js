import React, { useEffect, useState } from 'react';
import {
    Text,
    Container,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Box,
    Flex,
    Heading,
    useToast
} from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { useSearchParams } from 'react-router-dom';
import { request } from '../lib/request';
import ErrorMessage from '../components/ErrorMessage';
import useSessionStorage from '../lib/useSessionStorage';
import validator from 'validator';
import SuccessMessage from '../components/SucessMessage';

export const ModifierFacture = () => {
    const idParam = useSearchParams()[0].get("facture");
    const user = useSessionStorage('user')[0];
    const token = useSessionStorage('token')[0];
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    var boolIsGestionnaire = false;

    const [errorFloatHT, seterrorFloatHT] = useState(false);
    const [errorFloatHTMsg, seterrorFloatHTMsg] = useState();
    const [errorFloatTTC, seterrorFloatTTC] = useState(false);
    const [errorFloatTTCMsg, seterrorFloatTTCMsg] = useState();
    const [errorFloatTVA, seterrorFloatTVA] = useState(false);
    const [errorFloatTVAMsg, seterrorFloatTVAMsg] = useState();

    const [facture, setFacture] = useState('');
    const toast = useToast();
	const toastIdRef = React.useRef();

    const handleFormData = input => e => {
        const { value } = e.target;
        setFacture(prevState => ({
            ...prevState,
            [input]: value
        }));
    }
    const submitFormData = (e) => {
        e.preventDefault();
        seterrorFloatHT(false);
        seterrorFloatTTC(false);
        seterrorFloatTVA(false);
        setSuccess("");
        setError("");
        if (!validator.isNumeric("" + facture.totalHt)) {
            seterrorFloatHT(true);
            seterrorFloatHTMsg("Valeure numérique attendue");
        }
        if (!validator.isNumeric("" + facture.totalTtc)) {
            seterrorFloatTTC(true);
            seterrorFloatTTCMsg("Valeure numérique attendue");
        }
        if (!validator.isNumeric("" + facture.tva)) {
            seterrorFloatTVA(true);
            seterrorFloatTVAMsg("Valeure numérique attendue");
        }
        else {
            try {
                facture.totalHt=parseFloat(facture.totalHt);
                facture.totalTtc=parseFloat(facture.totalTtc);
                facture.tva=parseFloat(facture.tva);
                request.put('http://localhost:8080/api/facture/' + idParam + '?secret_token=' + token, facture)
                    .then((resp) => {
                        if (resp.status === 200) {
                            setSuccess('Facture modifiée avec succès')
                            addToast();
                            //setFacture("");
                        } else setError(resp.data.error);
                    });
            } catch (err) {
                return;
            }
        }
    };

    useEffect(() => {
        try {
            request.get('http://localhost:8080/api/facture/' + idParam + '?secret_token=' + token)
                .then((resp) => {
                    if (resp.data.status === 200) {
                        setFacture(resp.data.data);
                        document.getElementById("dateAchat").value = resp.data.data.dateAchat.split("T")[0]
                    } else setError(resp.data.msg);
                });
        } catch (err) {
            return;
        }
    }, []);

    function addToast() {
		toastIdRef.current = toast({
			title: 'Facture modifiée.',
			status: 'success',
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

    if (user !== null && user !== undefined)
    user.services.forEach(service => {
        if (service.role === "gestionnaire" || user.superUtilisateur) {
            boolIsGestionnaire = true
            return;
        }
    })

    return (
        (boolIsGestionnaire) ?
        <>
            <Navbar />
            <Container maxW='5xl' centerContent mb={3}>
                <Box mb={4} as='b'>
                    <Text fontSize='3xl' color='salmon' as='span'>Modifier la facture </Text><Text fontSize='xl' color='salmon' as='span'>{idParam}</Text>
                </Box>
                <Flex width="full" align="center" justifyContent="center">
                    <Box
                        p={8}
                        maxWidth="500px"
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow="lg">
                        <Box my={4} textAlign="left">
                            <Box textAlign="center" mb={4}>
                                <Heading>Modifier facture</Heading>
                            </Box>
                            {success && <SuccessMessage message={success} />}
                            {error && <ErrorMessage message={error} />}
                            <form onSubmit={submitFormData} my={4}>
                                <FormControl isRequired>
                                    <FormLabel>Adresse courriel</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="e-mail"
                                        size="lg"
                                        name="idUtilisateur"
                                        defaultValue={facture.idUtilisateur}
                                        onChange={handleFormData("idUtilisateur")}
                                    />
                                </FormControl>
                                <FormControl isRequired mt={3}>
                                    <FormLabel>Date achat</FormLabel>
                                    <Input
                                        id="dateAchat"
                                        type="date"
                                        placeholder="date achat"
                                        size="lg"
                                        name="dateAchat"
                                        onChange={handleFormData("dateAchat")}
                                    />
                                </FormControl>
                                <FormControl isRequired mt={3}>
                                    <FormLabel>Service</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="service"
                                        size="lg"
                                        name="service"
                                        defaultValue={facture.service}
                                        onChange={handleFormData("service")}
                                    />
                                </FormControl>
                                <FormControl isRequired mt={3}>
                                    <FormLabel>Créditeur</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="crediteur"
                                        size="lg"
                                        name="crediteur"
                                        defaultValue={facture.crediteur}
                                        onChange={handleFormData("crediteur")}
                                    />
                                </FormControl>
                                <FormControl isRequired mt={3} isInvalid={errorFloatHT}>
                                    <FormLabel>Total HT</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="totalHt"
                                        size="lg"
                                        name="totalHt"
                                        defaultValue={facture.totalHt}
                                        onChange={handleFormData("totalHt")}
                                    />
                                    {errorFloatHT ? (<FormErrorMessage>{errorFloatHTMsg}</FormErrorMessage>) : (<></>)}
                                </FormControl>
                                <FormControl isRequired mt={3} isInvalid={errorFloatTTC}>
                                    <FormLabel>Total TTC</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="totalTtc"
                                        size="lg"
                                        name="totalTtc"
                                        defaultValue={facture.totalTtc}
                                        onChange={handleFormData("totalTtc")}
                                    />
                                    {errorFloatTTC ? (<FormErrorMessage>{errorFloatTTCMsg}</FormErrorMessage>) : (<></>)}
                                </FormControl>
                                <FormControl isRequired mt={3} isInvalid={errorFloatTVA}>
                                    <FormLabel>TVA</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="tva"
                                        size="lg"
                                        name="tva"
                                        defaultValue={facture.tva}
                                        onChange={handleFormData("tva")}
                                    />
                                    {errorFloatTVA ? (<FormErrorMessage>{errorFloatTVAMsg}</FormErrorMessage>) : (<></>)}
                                </FormControl>
                                <FormControl isRequired mt={3}>
                                    <FormLabel>Catégorie</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="catégorie"
                                        size="lg"
                                        name="categorie"
                                        defaultValue={facture.categorie}
                                        onChange={handleFormData("categorie")}
                                    />
                                </FormControl>
                                <Button colorScheme='green' variant="outline" type="submit" width="full" mt={3}>Valider</Button>
                            </form>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </> : <>
		<Navbar />
			<Container centerContent>
				<Box mb={4} as='b'>
					<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire de cette facture pour la modifier.</Text>
				</Box>
			</Container>
		</>
    )
}