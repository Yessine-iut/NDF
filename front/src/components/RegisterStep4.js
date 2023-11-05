import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	Button,
	FormErrorMessage,
	Stack,
	ButtonGroup,
	CircularProgress,
	Box,
	Flex,
	Heading
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { request } from '../lib/request';
import validator from 'validator';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SucessMessage';

const FormulaireStep4 = ({ handleFormData, prevStep, values }) => {
	const [errorIban, setErrorIban] = useState(false);
	const [errorBic, setErrorBic] = useState(false);
	const [errorIbanMsg, setErrorIbanMsg] = useState();
	const [errorBicMsg, setErrorBicMsg] = useState();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const sleep = ms => new Promise(r => setTimeout(r, ms));

	const submitFormData = (e) => {
		e.preventDefault();
		setErrorIban(false);
		setErrorBic(false);

		if (!validator.isIBAN(values.iban)) {
			setErrorIban(true);
			setErrorIbanMsg("International Bank Account Number erroné")
		}
		else if (!validator.isBIC(values.bic)) {
			setErrorBic(true);
			setErrorBicMsg("Code BIC / Code SWIFT erroné")
		} else {
			register(e);
		}
	};

	const register = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setSuccess("");
		setError("");
		const user = {
			"mail": values.mail,
			"prenom": values.prenom,
			"nom": values.nom,
			"password": values.password,
			"services": values.services,
			"numVoie": values.numVoie,
			"nomVoie": values.nomVoie,
			"complementVoie": values.complementVoie,
			"codePostal": values.codePostal,
			"commune": values.commune,
			"iban": values.iban,
			"bic": values.bic
		};
		try {
			await request.post('http://localhost:8080/signup', user)
				.then((resp) => {
					if (resp.data.status === 200) {
						setSuccess("Compte " + values.mail + " a été créé")
						sessionStorage.setItem("emailRegistered","Compte " + values.mail + " a été créé. \nConnectez-vous !");
						sleep(10).then(window.location.href = '/login');
					} else if (resp.data.status === 409) {
						setError("Un compte éxiste déjà avec cette e-mail");
						setIsLoading(false);
						return;
					}
				});
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	return (
		<Flex width="full" align="center" justifyContent="center">
			<Box
				p={8}
				maxWidth="500px"
				borderWidth={1}
				borderRadius={8}
				boxShadow="lg">
				<Box my={4} textAlign="left">
					<Box textAlign="center" mb={4}>
						<Heading>Créer un compte</Heading>
					</Box>
					{error && <ErrorMessage message={error} />}
					{success && <SuccessMessage message={success} />}
					<form onSubmit={submitFormData} my={4}>
						<FormControl isRequired isInvalid={errorIban}>
							<FormLabel>IBAN</FormLabel>
							<Input
								type="text"
								placeholder="iban"
								size="lg"
								name="iban"
								defaultValue={values.iban}
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
								defaultValue={values.bic}
								onChange={handleFormData("bic")}
							/>
							{errorBic ? (<FormErrorMessage>{errorBicMsg}</FormErrorMessage>) : (<></>)}
						</FormControl>
						<Stack direction='row' spacing={4} justifyContent="center">
							<ButtonGroup variant='outline' mt={3} >
								<Button leftIcon={<ArrowBackIcon />} onClick={prevStep}>Précédent</Button>
							</ButtonGroup>
						</Stack>
						<Button colorScheme='green' variant="outline" type="submit" width="full" mt={3}>
							{isLoading ? (<CircularProgress isIndeterminate size="24px" color="teal" />) : ('Valider')}
						</Button>
					</form>
				</Box>
			</Box>
		</Flex>
	);
}
export default FormulaireStep4;