import React from 'react';
import {
	Text, Container, Box, Link, Button, List, ListItem
} from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import CreateServiceModal from '../components/CreateServiceModal';
import useSessionStorage from '../lib/useSessionStorage';

export const ManageUser = () => {
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
		if(user.superUtilisateur) canCreateService = <ListItem><CreateServiceModal /></ListItem>
	}
	return (
		(boolIsGestionnaire) ?
			<>
				<Navbar />
				<Container maxW='5xl' centerContent>
					<Box mb={4} as='b'>
						<Text fontSize='3xl' color='salmon' as='u'>Gestion personnel</Text>
					</Box>
					<List spacing={7}>
						<ListItem><Link href="/register"><Button>Créer un utilisateur</Button></Link></ListItem>
						<ListItem><Link href="/listerusers"><Button>Lister utilisateurs</Button></Link></ListItem>
						<ListItem><Link href="/listerfactures"><Button>Lister factures</Button></Link></ListItem>
						{canCreateService}
					</List>
				</Container>
			</> : <>
				<Navbar />
				<Container centerContent>
					<Box mb={4} as='b'>
						<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire pour accéder à cette page.</Text>
					</Box>
				</Container>
			</>
	)
}
