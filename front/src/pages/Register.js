import { Container, Box, Text } from "@chakra-ui/react";
import FormulaireRegister from "../components/FormulaireRegister";
import { Navbar } from "../components/Navbar";
import useSessionStorage from "../lib/useSessionStorage";

export const Register = () => {
	const user = useSessionStorage('user')[0];
	var boolIsGestionnaire = false;
	if (user !== null && user !== undefined)
		user.services.forEach(service => {
			if (service.role === "gestionnaire" || user.superUtilisateur || user.superUtilisateur) {
				boolIsGestionnaire = true
				return;
			}
		})
	return (
		(boolIsGestionnaire) ?
			<>
				<Navbar />
				<FormulaireRegister />
			</> : <>
				<Navbar />
				<Container centerContent>
					<Box mb={4} as='b'>
						<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire pour créer un compte.</Text>
					</Box>
				</Container>
			</>
	);
};