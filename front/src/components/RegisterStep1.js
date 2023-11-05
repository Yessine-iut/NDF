import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	Input,
	Button,
	InputGroup,
	InputRightElement,
	FormHelperText,
	FormErrorMessage,
	Stack,
	ButtonGroup,
	Box,
	Flex,
	Heading
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import validator from 'validator';

const FormulaireStep1 = ({ nextStep, handleFormData, values }) => {
	const [errorPsw, setErrorPsw] = useState(false);
	const [errorConfPsw, setErrorConfPsw] = useState(false);
	const [errorPswMsg, setErrorPswMsg] = useState();
	const [errorConfPswMsg, setErrorConfPswMsg] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const handlePasswordVisibility = () => setShowPassword(!showPassword);

	const submitFormData = (e) => {
		e.preventDefault();
		setErrorPsw(false);
		setErrorPsw(false);
		if (!validator.isStrongPassword(values.password)) {
			setErrorPsw(true);
			setErrorPswMsg("Mot de passe trop peu complexe");
		}
		else if (values.password !== values.confirmpassword) {
			setErrorConfPsw(true);
			setErrorConfPswMsg("Ces mots de passe ne correspondent pas");
		}
		else {
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
							<FormLabel>Adresse courriel</FormLabel>
							<Input
								type="email"
								placeholder="e-mail"
								size="lg"
								name="mail"
								defaultValue={values.mail}
								onChange={handleFormData("mail")}
							/>
						</FormControl>
						<FormControl isRequired mt={3}>
							<FormLabel>Prénom</FormLabel>
							<Input
								type="text"
								placeholder="prénom"
								size="lg"
								name="prenom"
								defaultValue={values.prenom}
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
								defaultValue={values.nom}
								onChange={handleFormData("nom")}
							/>
						</FormControl>
						<FormControl isRequired mt={3} isInvalid={errorPsw}>
							<FormLabel>Mot de passe</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? 'text' : 'password'}
									placeholder="mot de passe"
									size="lg"
									name="password"
									defaultValue={values.password}
									onChange={handleFormData("password")}
								/>
								<InputRightElement width="3rem" height="100%">
									<Button size="sm" onClick={handlePasswordVisibility}>
										{showPassword ? <ViewOffIcon /> : <ViewIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
							{errorPsw ? (<FormErrorMessage>{errorPswMsg}</FormErrorMessage>) : (<></>)}
							<FormHelperText>8 charactères (1 majuscule, 1 minuscule, 1 spécial)</FormHelperText>
						</FormControl>
						<FormControl isRequired mt={3} isInvalid={errorConfPsw}>
							<FormLabel>Confirmation mot de passe</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? 'text' : 'password'}
									placeholder="confirmation mot de passe"
									size="lg"
									name="confirmationPassword"
									defaultValue={values.confirmpassword}
									onChange={handleFormData("confirmpassword")}
								/>
								<InputRightElement width="3rem" height="100%">
									<Button size="sm" onClick={handlePasswordVisibility}>
										{showPassword ? <ViewOffIcon /> : <ViewIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
							{errorConfPsw ? (<FormErrorMessage>{errorConfPswMsg}</FormErrorMessage>) : (<></>)}
						</FormControl>
						<Stack direction='row' spacing={4} justifyContent="center">
							<ButtonGroup variant='outline' mt={3} >
								<Button rightIcon={<ArrowForwardIcon />} colorScheme='blue' type="submit">Suivant</Button>
							</ButtonGroup>
						</Stack>
					</form>
				</Box>
			</Box>
		</Flex>
	);
}
export default FormulaireStep1;