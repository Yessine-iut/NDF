import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Text,
	Container,
	Box,
	Select,
	FormControl,
	Stack,
	Button,
	Divider,
	InputLeftAddon,
	InputGroup,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	InputRightElement,
	useToast
} from '@chakra-ui/react'
import useSessionStorage from '../lib/useSessionStorage';
import ErrorMessage from '../components/ErrorMessage';
import { request } from '../lib/request';
import { Navbar } from '../components/Navbar';

export const ListerFactures = () => {
	const user = useSessionStorage('user')[0];
	var boolIsGestionnaire = false;
	const [em, setEm] = useState([]);
	const [emailFactures, setEmailFactures] = useState([]);
	const [error, setError] = useState('');
	const TABLE_HEADERS = ["Email", "Date facture", "Service", "Total HT", "Total TTC", "TVA", "Créditeur","Catégorie", "Modifier", "Supprimer"];	const token = useSessionStorage('token')[0];
	const [factures, setFactures] = useState([]);
	const toast = useToast();
	const toastIdRef = React.useRef();

	useEffect(() => {
		var listeMails = [];
		if (user != null)
			axios.get('http://localhost:8080/api/allemailssameservice/' + user.mail).then((rep) => {
				let emails = rep.data[0];
				for (var i = 0; i < emails.length; i++)
					listeMails.push(emails[i])
				setEm(listeMails);
			});
	}, [user]);

	const listerFactures = (filtreEmail) => {
		try {
			request.get('http://localhost:8080/api/allFactures/', {
				params: {
					user : user,
					mail: filtreEmail
				  }
			}).then((resp) => {
					resp.data.status === 200 ? setFactures(resp.data.data) : setError(resp.data.msg);
				});
		} catch (err) {
			setError(err.message);
			return;
		}
	}

	useEffect(() => {
		listerFactures("");
	}, []);

	const submitFormData = async (e) => {
		e.preventDefault();
		setError("");
		listerFactures(emailFactures);
	};

	const supprFacture = (id) => {
		try {
			request.delete('http://localhost:8080/api/facture/' + id + '?secret_token=' + token)
				.then((resp) => {
					if (resp.data.status === 204) {
						listerFactures(emailFactures);
						addToast();
					} else setError(resp.data.msg);
				});
		} catch (err) {
			setError(err.message);
		}
	}
	function addToast() {
		toastIdRef.current = toast({
			title: 'Facture supprimée.',
			status: 'success',
			position: 'top',
			duration: 2000,
			isClosable: true,
		})
	}

	const modifierFacture = (id) => {
		window.location.href='editfacture?facture='+id;
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
					<Text fontSize='3xl' color='salmon' as='u'>Lister Factures</Text>
				</Box>
			</Container>
			<Container maxW='container.sm'>
				{error && <ErrorMessage message={error} />}
				<form onSubmit={submitFormData} my={4}>
					<Stack direction='row'>
						<FormControl>
							<InputGroup>
								<InputLeftAddon children="Filtrer par utilisateur :" />
								<Select placeholder='tous les utilisateurs' onChange={event => setEmailFactures(event.currentTarget.value)}>
									{em.map((utilisateur) => (
										<option key={utilisateur}>{utilisateur}</option>
									))}
								</Select>
								<InputRightElement width='50px'>
									<Button colorScheme='saumon' type="submit">Lister</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
					</Stack>
				</form>
			</Container>
			<Divider borderColor={'salmon'} height={'20px'} borderBottom="5px solid salmon" />
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
						{factures.map((facture) => (
							<Tr key={facture._id}>
								<Td>{facture.idUtilisateur}</Td>
								<Td>{facture.dateAchat.split("T")[0]}</Td>
								<Td>{facture.service}</Td>
								<Td>{facture.totalHt}</Td>
								<Td>{facture.totalTtc}</Td>
								<Td>{facture.tva}</Td>
								<Td>{facture.crediteur}</Td>
								<Td>{facture.categorie}</Td>
								<Td onClick={() => { modifierFacture(facture._id) }}><Text className="cursorPointer" as="span">📝</Text></Td>
								<Td onClick={() => { supprFacture(facture._id) }}><Text className="cursorPointer" as="span">🗑️</Text></Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</> : <>
		<Navbar />
			<Container centerContent>
				<Box mb={4} as='b'>
					<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire pour Lister les factures.</Text>
				</Box>
			</Container>
		</>
	)
}
