import React from 'react';
import { Text, Container, Box, UnorderedList, ListItem, Link, Button, ButtonGroup } from '@chakra-ui/react';
import useSessionStorage from '../lib/useSessionStorage';
import { Navbar } from '../components/Navbar';
import CreateServiceModal from '../components/CreateServiceModal';

export const Home = () => {
	const user = useSessionStorage('user')[0];
	var boolIsGestionnaire = false;
	var canCreateService = <></>;
	if (user !== null && user !== undefined) {
		user.services.forEach(service => {
			if (service.role === "gestionnaire" || user.superUtilisateur) {
				boolIsGestionnaire = true
				return;
			}
		})
		if (user.superUtilisateur) canCreateService = <CreateServiceModal />
	}
	return (
		<>
			<Navbar />
			<Container centerContent>
				<Box mb={4} as='b' alignContent="center">
					<Text fontSize='3xl' color='salmon' as='u'>Accueil</Text>
				</Box>
				{user !== null && user !== undefined && !user.superUtilisateur ? (
					<UnorderedList>
						<Text fontSize='2xl'>Bienvenue {user.prenom} {user.nom}, vous êtes :</Text>
						{user.services.map((service, index) => (
							<ListItem fontSize='2xl' key={index}>{service.role} du service {service.nom}</ListItem>
						))}
					</UnorderedList>
				) : (<></>)}
				{user !== null && user !== undefined && user.superUtilisateur ? (
					<Text fontSize='xl'>Bienvenue {user.prenom} {user.nom}, vous êtes superUtilisateur</Text>
				) : (<></>)}
				{user === undefined || user === null ? (
					<Link href="/login"><Button fontSize='2xl'>Connectez-vous</Button></Link>) : (<></>)}
				{boolIsGestionnaire ? (
					<Container centerContent mt={4}>
						<Box mb={4} as='b' alignContent="center">
							<Text fontSize='2xl' color='salmon' as='u'>Gérer le personnel</Text>
						</Box>
						<Box>
							<ButtonGroup variant="link" spacing="7">
								<Button><Link href="/register">Créer un utilisateur</Link></Button>
								{canCreateService}
								<Button><Link href="/listerusers">Lister utilisateurs</Link></Button>
								<Button><Link href="/listerfactures">Lister factures</Link></Button>
							</ButtonGroup>
						</Box>
					</Container>) : (<></>)}
			</Container>
		</>
	)
}
