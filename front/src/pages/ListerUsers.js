import React, { useEffect, useState } from 'react';
import {
	Text,
	Container,
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	useToast
} from '@chakra-ui/react'
import useSessionStorage from '../lib/useSessionStorage';
import { request } from '../lib/request';
import { Navbar } from '../components/Navbar';
import ErrorMessage from '../components/ErrorMessage';

export const ListerUsers = () => {
	const user = useSessionStorage('user')[0];
	const [error, setError] = useState('');
	var boolIsGestionnaire = false;
	const TABLE_HEADERS = ["Mail", "Nom Prénom", "Adresse", "IBAN", "BIC", "Modifier", "Supprimer"];
	const token = useSessionStorage('token')[0];
	const [users, setusers] = useState([]);
	const toast = useToast();
	const toastIdRef = React.useRef();

	const listerUser = () => {
		setError("");
		try {
			request.get('http://localhost:8080/api/users?secret_token=' + token, {
				params: {
					user : user
				  }
				}).then((resp) => {
					resp.data.status === 200 ? setusers(resp.data.data) : setError(resp.data.msg);
				});
		} catch (err) {
			setError(err.message);
			return;
		}
	}

	useEffect(() => {
		listerUser();
	}, []);

	const supprUser = (id) => {
		try {
			request.delete('http://localhost:8080/api/user/' + id + '?secret_token=' + token)
				.then((resp) => {
					if (resp.data.status === 204) {
						listerUser();
						addToast();
					} else setError(resp.data.msg);
				});
		} catch (err) {
			setError(err.message);
		}
	}
	function addToast() {
		toastIdRef.current = toast({
			title: 'Utilisateur supprimé.',
			status: 'success',
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

	const modifierUser = (id) => {
		window.location.href='editUser?user='+id;
	}

	if (user !== null && user !== undefined)
	user.services.forEach(service => {
		if (service.role === "gestionnaire" || user.superUtilisateur) {
			boolIsGestionnaire = true
			return;
		}
	})
	return (
		(boolIsGestionnaire) ?
		<>
			<Navbar />
			<Container centerContent>
				<Box mb={4} as='b' alignContent="center">
					<Text fontSize='3xl' color='salmon' as='u'>Lister Utilisateurs</Text>
				</Box>
				{error && <ErrorMessage message={error} />}
			</Container>
			<TableContainer mx='50px'>
				<Table variant='simple' my={3}>
					<Thead>
						<Tr>
							{TABLE_HEADERS.map((header, i) => (
								<Th key={i}>{header}</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{users.map((user) => (
							<Tr key={user._id}>
								<Td>{user.mail}</Td>
								<Td>{user.nom} {user.prenom}</Td>
								<Td>{user.numVoie} {user.nomVoie}{user.complementVoie!==""? (", " + user.complementVoie+", ") : ","} {user.codePostal} {user.commune}</Td>
								<Td>{user.iban}</Td>
								<Td>{user.bic}</Td>
								<Td onClick={() => { modifierUser(user.mail) }}><Text className="cursorPointer" as="span">📝</Text></Td>
								<Td onClick={() => { supprUser(user._id) }}><Text className="cursorPointer" as="span">🗑️</Text></Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</> : <>
		<Navbar />
			<Container centerContent>
				<Box mb={4} as='b'>
					<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire pour Lister les users.</Text>
				</Box>
			</Container>
		</>
	)
}
