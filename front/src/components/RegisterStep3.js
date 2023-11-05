import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	Button,
	FormErrorMessage,
	Stack,
	ButtonGroup,
	Box,
	Flex,
	Heading
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import validator from 'validator';

const FormulaireStep3 = ({ nextStep, handleFormData, prevStep, values }) => {
	const [errorCP, setErrorCP] = useState(false);

	const submitFormData = (e) => {
		e.preventDefault();
		setErrorCP(false);
		if (!validator.isPostalCode(values.codePostal, "FR")) {
			setErrorCP(true);
		} else {
			nextStep();
		}
	};
	return (
		<Flex width="full" align="center" justifyContent="center" mb={3}>
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
					<form onSubmit={submitFormData} my={4}>
						<FormControl isRequired>
							<FormLabel>Numéro de voie</FormLabel>
							<Input
								type="text"
								placeholder="num de voie"
								size="lg"
								name="numdevoie"
								defaultValue={values.numVoie}
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
								defaultValue={values.nomVoie}
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
								defaultValue={values.complementVoie}
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
								defaultValue={values.codePostal}
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
								defaultValue={values.commune}
								onChange={handleFormData("commune")}
							/>
						</FormControl>
						<Stack direction='row' spacing={4} justifyContent="center">
							<ButtonGroup variant='outline' mt={3} >
								<Button leftIcon={<ArrowBackIcon />} onClick={prevStep}>Précédent</Button>
								<Button rightIcon={<ArrowForwardIcon />} colorScheme='blue' type="submit">Suivant</Button>
							</ButtonGroup>
						</Stack>
					</form>
				</Box>
			</Box>
		</Flex>
	);
}
export default FormulaireStep3;