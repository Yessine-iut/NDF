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
	Text,
	Link,
} from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import useSessionStorage from '../lib/useSessionStorage';
import { request } from '../lib/request';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SucessMessage';

export const Login = () => {
	const [error, setError] = useState('');
	const success = sessionStorage.getItem('emailRegistered');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handlePasswordVisibility = () => setShowPassword(!showPassword);
	const navigate = useNavigate();
	const token = useSessionStorage('token')[1];
	const [userInSS, setUserInSS] = useSessionStorage('user');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const user = useState({
		"mail": '',
		"password": ''
	})[0];
	sessionStorage.removeItem('emailRegistered');
	const handleSubmit = async event => {
		event.preventDefault();
		setIsLoading(true);
		try {
			user.mail = email;
			user.password = password;
			await request.post('http://localhost:8080/login', user)
				.then((resp) => {
					token(resp.data.token);
					setUserInSS(resp.data.user);
					navigate('/');
				}
				);
			setIsLoading(false);
		} catch (err) {
			setError('Email ou mot de passe incorrect');
			setIsLoading(false);
			setEmail('');
			setPassword('');
		}
	};

	const logout = () => {
		token(null);
		setUserInSS(null);
		navigate('/');
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
					{userInSS != null ? (
						<Box textAlign="center">
							<Text>{userInSS.mail} already logged in!</Text>
							<Button
								variantcolor="orange"
								variant="outline"
								width="full"
								mt={4}
								onClick={logout}
							>
								Se déconnecter
							</Button>
						</Box>
					) : (
						<>
							<Box textAlign="center">
								<Heading>Se connecter</Heading>
							</Box>
							<Box my={4} textAlign="left">
								<form onSubmit={handleSubmit}>
									{error && <ErrorMessage message={error} />}
									{success && <SuccessMessage message={success} />}
									<FormControl isRequired>
										<FormLabel>Adresse courriel</FormLabel>
										<Input
											type="email"
											placeholder="e-mail"
											size="lg"
											name="email"
											onChange={event => setEmail(event.currentTarget.value)}
										/>
									</FormControl>
									<FormControl isRequired mt={6}>
										<FormLabel>Mot de passe</FormLabel>
										<InputGroup>
											<Input
												type={showPassword ? 'text' : 'password'}
												placeholder="mot de passe"
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
									<Button variant="link" colorScheme="blue" size="sm" float="right" mt={1}>
										<Link href="/forgotpassword">Mot de passe oublié ?</Link>
									</Button>
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
											'Valider'
										)}
									</Button>
								</form>
							</Box>
						</>)}
				</Box>
			</Flex>
		</>
	);
}
