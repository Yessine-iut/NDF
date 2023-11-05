import React, { useState } from 'react';
import {
	Flex,
	Box,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Button,
	InputGroup,
	InputRightElement,
	CircularProgress,
	FormHelperText
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import { request } from '../lib/request';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SucessMessage';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const ResetPassword = () => {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handlePasswordVisibility = () => setShowPassword(!showPassword);
	const sleep = ms => new Promise(r => setTimeout(r, ms));

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const token = useSearchParams()[0].get("token");
	console.log(token)
	const handleSubmit = async event => {
		event.preventDefault();
		const user = { "password": password };
		if (password !== confirmPassword) {
			setError("Ces mots de passe ne correspondent pas");
			setConfirmPassword("");
			return;
		}
		if (!new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^_&*-]).{6,}$').test(password)) {
			setError("Mot de passe pas assez complexe");
			return;
		}
		try {
			setIsLoading(true);
			await request.post('http://localhost:8080/reset/' + token, user)
				.then((resp) => {
					if (resp.data.status === 200) {
						setSuccess("Votre mot de passe a été modifié");
					} else {
						setError(resp.data.msg);
					}
					setIsLoading(false);
					sleep(1000).then(window.location.href = '/login');
				});
		} catch (err) {
			setSuccess("");
			setError(err);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<Flex width="full" align="center" justifyContent="center">
				<Box
					p={8}
					maxWidth="500px"
					borderWidth={1}
					borderRadius={8}
					boxShadow="lg"
				>
					<Box textAlign="center">
						<Heading>Modifier mot de passe</Heading>
					</Box>
					<Box my={4} textAlign="left">
						<form onSubmit={handleSubmit}>
							{error && <ErrorMessage message={error} />}
							{success && <SuccessMessage message={success} />}

							<FormControl isRequired mt={6}>
								<FormLabel>Nouveau mot de passe</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? 'text' : 'password'}
										placeholder="nouveau mot de passe"
										size="lg"
										name="password"
										onChange={event => setPassword(event.currentTarget.value)}
									/>
									<InputRightElement width="3rem" height="100%">
										<Button size="sm" onClick={handlePasswordVisibility}>
											{showPassword ? <ViewOffIcon /> : <ViewIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<FormControl isRequired mt={6}>
								<FormLabel>Confirmer le nouveau mot de passe</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? 'text' : 'password'}
										placeholder="confirmation mot de passe"
										size="lg"
										name="password"
										onChange={event => setConfirmPassword(event.currentTarget.value)}
									/>
									<InputRightElement width="3rem" height="100%">
										<Button size="sm" onClick={handlePasswordVisibility}>
											{showPassword ? <ViewOffIcon /> : <ViewIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
								<FormHelperText>8 charactères (1 majuscule, 1 minuscule, 1 spécial)</FormHelperText>
							</FormControl>
							<Button
								variantcolor="teal"
								variant="outline"
								type="submit"
								width="full"
								mt={4}
							>
								{isLoading ? (
									<CircularProgress
										isIndeterminate
										size="24px"
										color="teal"
									/>
								) : (
									'Modifier le mot de passe'
								)}
							</Button>
						</form>
					</Box>
				</Box>
			</Flex>
		</>
	);
}
