import React, { useState } from 'react';
import {
	Flex,
	Box,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Button,
	CircularProgress,
} from '@chakra-ui/react';
import { request } from '../lib/request';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SucessMessage';
import { Navbar } from '../components/Navbar';

export const Forgotpassword = () => {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [mail, setEmail] = useState('');

	const handleSubmit = async event => {
		event.preventDefault();
		setIsLoading(true);
		const user = { "mail": mail };
		try {
			await request.post('http://localhost:8080/forgot', user)
				.then((resp) => resp.data);
			setIsLoading(false);
			setError("");
			setSuccess("Un courriel de réinitialisation de mot de passe vous a été envoyé à l'adresse " + user.mail);
		} catch (error) {
			setSuccess("");
			setError("Aucun utilisateur trouvé avec cette adresse " + user.mail);
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
						<Heading>Mot de passe oublié</Heading>
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
									name="mail"
									onChange={event => setEmail(event.currentTarget.value)}
								/>
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
									'Recevoir courriel de réinitialisation'
								)}
							</Button>
						</form>
					</Box>
				</Box>
			</Flex>
		</>
	);
}
