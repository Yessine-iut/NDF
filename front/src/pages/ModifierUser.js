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

export const ModifierUser = () => {
    const mailParam = useSearchParams()[0].get("user");
    const userInSS = useSessionStorage('user')[0];
    const token = useSessionStorage('token')[0];
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    var boolIsGestionnaire = false;

	const [errorIban, setErrorIban] = useState(false);
	const [errorBic, setErrorBic] = useState(false);
	const [errorIbanMsg, setErrorIbanMsg] = useState();
	const [errorBicMsg, setErrorBicMsg] = useState();
	const [errorCP, setErrorCP] = useState(false);

    const [user, setUser] = useState('');
    const toast = useToast();
    const toastIdRef = React.useRef();

    const handleFormData = input => e => {
        const { value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [input]: value
        }));
    }
    const submitFormData = (e) => {
        e.preventDefault();
        setErrorIban(false);
        setErrorBic(false);
        setErrorCP(false);
        setSuccess("");
        setError("");
		if (!validator.isPostalCode(user.codePostal, "FR")) {
			setErrorCP(true);
        }
        if (!validator.isIBAN(user.iban)) {
			setErrorIban(true);
			setErrorIbanMsg("International Bank Account Number erroné")
		}
		if (!validator.isBIC(user.bic)) {
			setErrorBic(true);
			setErrorBicMsg("Code BIC / Code SWIFT erroné")
		}
        if(validator.isIBAN(user.iban) && validator.isBIC(user.bic) && validator.isPostalCode(user.codePostal, "FR") ) {

            try {
                request.put('http://localhost:8080/api/user/' + user._id + '?secret_token=' + token, user)
                    .then((resp) => {
                        if (resp.status === 200) {
                            setSuccess('User modifié avec succès')
                            addToast();
                            //setUser("");
                        } else setError(resp.data.error);
                    });
            } catch (err) {
                return;
            }
        }
    };

    useEffect(() => {
        try {
            request.get('http://localhost:8080/api/user/' + mailParam + '?secret_token=' + token)
                .then((resp) => {
                    if (resp.data.succes) {
                        setUser(resp.data.user);
                    } else setError(resp.data.msg);

                });
        } catch (err) {
            return;
        }
    }, []);

    function addToast() {
        toastIdRef.current = toast({
            title: 'Utilisateur modifié.',
            status: 'success',
            position: 'top',
            duration: 2000,
            isClosable: true,
        })
    }

    if (userInSS !== null && userInSS !== undefined)
        userInSS.services.forEach(service => {
            if (service.role === "gestionnaire" || userInSS.superUtilisateur) {
                boolIsGestionnaire = true
                return;
            }
        })

    return (
        (boolIsGestionnaire) ?
            <>
                <Navbar />
                <Container maxW='5xl' centerContent mb={3}>
                    <Box as='b'>
                        <Text fontSize='3xl' color='salmon' as='span'>Modifier l'utilisateur </Text><Text fontSize='xl' color='salmon' as='span'>{mailParam}</Text>
                    </Box>
                    <Box as="i" mb={2}><Text as="span">L'utilisateur doit modifier son mot de passe en faisant "mot de passe oublié" sur la page de connexion</Text></Box>
                    <Flex width="full" align="center" justifyContent="center">
                        <Box
                            p={8}
                            maxWidth="500px"
                            borderWidth={1}
                            borderRadius={8}
                            boxShadow="lg">
                            <Box my={4} textAlign="left">
                                <Box textAlign="center" mb={4}>
                                    <Heading>Modifier user</Heading>
                                </Box>
                                {success && <SuccessMessage message={success} />}
                                {error && <ErrorMessage message={error} />}
                                <form onSubmit={submitFormData} my={4}>

                                    <FormControl isRequired mt={3}>
                                        <FormLabel>Prénom</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="prénom"
                                            size="lg"
                                            name="prenom"
                                            defaultValue={user.prenom}
                                            onChange={handleFormData("prenom")}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt={3}>
                                        <FormLabel>Nom</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="nom"
                                            size="lg"
                                            name="nom"
                                            defaultValue={user.nom}
                                            onChange={handleFormData("nom")}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt={3}>
                                        <FormLabel>Numéro de voie</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="num de voie"
                                            size="lg"
                                            name="numdevoie"
                                            defaultValue={user.numVoie}
                                            onChange={handleFormData("numVoie")}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt={3}>
                                        <FormLabel>Nom de voie</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="nom de voie"
                                            size="lg"
                                            name="nomdevoie"
                                            defaultValue={user.nomVoie}
                                            onChange={handleFormData("nomVoie")}
                                        />
                                    </FormControl>
                                    <FormControl mt={3}>
                                        <FormLabel>Complément de voie</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="complément de voie"
                                            size="lg"
                                            name="complementdevoie"
                                            defaultValue={user.complementVoie}
                                            onChange={handleFormData("complementVoie")}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt={3} isInvalid={errorCP}>
                                        <FormLabel>Code postal</FormLabel>
                                        <Input
                                            type="number"
                                            placeholder="code postal"
                                            size="lg"
                                            name="codepostal"
                                            pattern="[0-9]{5}"
                                            defaultValue={user.codePostal}
                                            onChange={handleFormData("codePostal")}
                                        />
                                        {errorCP ? (<FormErrorMessage>Code postal invalide.</FormErrorMessage>) : (<></>)}
                                    </FormControl>
                                    <FormControl isRequired mt={3}>
                                        <FormLabel>Commune</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="commune"
                                            size="lg"
                                            name="commune"
                                            defaultValue={user.commune}
                                            onChange={handleFormData("commune")}
                                        />
                                    </FormControl>
                                    <FormControl isRequired isInvalid={errorIban} mt={3}>
                                        <FormLabel>IBAN</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="iban"
                                            size="lg"
                                            name="iban"
                                            defaultValue={user.iban}
                                            onChange={handleFormData("iban")}
                                        />
                                        {errorIban ? (<FormErrorMessage>{errorIbanMsg}</FormErrorMessage>) : (<></>)}
                                    </FormControl>
                                    <FormControl isRequired mt={3} isInvalid={errorBic}>
                                        <FormLabel>Codes BIC / SWIFT</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="codes BIC / SWIFT"
                                            size="lg"
                                            name="bic"
                                            defaultValue={user.bic}
                                            onChange={handleFormData("bic")}
                                        />
                                        {errorBic ? (<FormErrorMessage>{errorBicMsg}</FormErrorMessage>) : (<></>)}
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
                        <Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire de cet utilisateur pour la modifier.</Text>
                    </Box>
                </Container>
            </>
    )
}