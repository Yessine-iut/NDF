import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Text,
	Container,
	Box,
	Select,
	FormControl,
	Input,
	Stack,
	FormLabel,
	CircularProgress,
	Button,
	Divider
} from '@chakra-ui/react';
import useSessionStorage from '../lib/useSessionStorage';
import ErrorMessage from '../components/ErrorMessage';
import { request } from '../lib/request';
import SingleNdfPage from "../components/NDFgenerator";
import { Navbar } from '../components/Navbar';
import { PDFDownloadLink } from "@react-pdf/renderer";

export const CreateNDF = () => {
	const [em, setEm] = useState([]);
	const [serv, setServ] = useState([]);
	const user = useSessionStorage('user')[0];
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	var boolIsGestionnaire = false;
	const token = useSessionStorage('token')[0];


	const [userNDF, setUserNDF] = useState('');
	const [servNDF, setServNDF] = useState('');
	const [startDateNDF, setStartDateNDF] = useState('');
	const [endDateNDF, setEndDateNDF] = useState('');
	const [pdf, setPdf] = useState('');

	useEffect(() => {
		if (user != null)
			axios.get('http://localhost:8080/api/allemailssameservice/' + user.mail).then((rep) => {
				let emails = rep.data[0];
				let servicesEnCommun = rep.data[1];
				let listeMails = [];
				let listeServ = [];
				for (var i = 0; i < emails.length; i++) {
					listeMails.push(emails[i])
				}
				setEm(listeMails);
				for (var j = 0; j < servicesEnCommun.length; j++) {
					listeServ.push(servicesEnCommun[j])
				}
				setServ(listeServ);
			});
	}, [user]);

	const submitFormData = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		if (endDateNDF < startDateNDF) {
			setError("date de fin < date de début");
			setIsLoading(false);
			return;
		}
		const ndfNeeded = {
			"mail": userNDF,
			"service": servNDF,
			"startDate": new Date(startDateNDF + ' 14:00:00').toISOString(),
			"endDate": new Date(endDateNDF + ' 14:00:00').toISOString()
		};
		try {
			await request.post('http://localhost:8080/api/factureByUser', ndfNeeded)
				.then((resp) => {
					if (resp.data.status === 200) {
						let factures = resp.data.data;

						try {
							request.get('http://localhost:8080/api/user/' + userNDF + '?secret_token=' + token)
								.then((resp) => {
									if (resp.data.succes) {

										setIsLoading(false);
										var user = resp.data.user;
										var infoFactures = [];
										var totalTTC = 0;
										var totalHT = 0;
										var totalTVA = 0;
										for (let i = 0; i < factures.length; i++) {
											infoFactures.push({
												"date d'achat": factures[i].dateAchat.split("T")[0],
												"service": factures[i].service,
												"HT": factures[i].totalHt,
												"TVA": factures[i].tva,
												"TTC": factures[i].totalTtc,
												"crediteur": factures[i].crediteur,
												"categorie": factures[i].categorie
											})
											totalTTC += factures[i].totalTtc
											totalHT += factures[i].totalHt
											totalTVA += factures[i].tva
										}
										totalTTC = Math.round(totalTTC*100)/100
										totalHT = Math.round(totalHT*100)/100
										totalTVA = Math.round(totalTVA*100)/100

										var data = {
											"column": [
												"date d'achat",
												"service",
												"HT",
												"TVA",
												"TTC",
												"crediteur",
												"categorie"
											],
											"data": infoFactures
										}
										setPdf(<>
											<Container centerContent>
												<Box mb={4} as='b'>
													<Text fontSize='3xl' color='salmon' as='u'>Votre Note de Frais est prête</Text>
												</Box>
												<PDFDownloadLink document={<SingleNdfPage props={{ data, userNDF, startDateNDF, endDateNDF, servNDF, totalTTC, totalHT, totalTVA, user }} />} filename="FORM">
													{({ loading }) => (loading ? <>Traitement...</> : <Button colorScheme='green' variant="outline" width="full" mt={3}>Télécharger</Button>)}
												</PDFDownloadLink>
											</Container>
										</>)
									} else setError(resp.data.msg);

								});
						} catch (err) {
							return;
						}
					}
					else {
						setError(resp.data.msg)
					}
				});
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
	};

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
					<Box mb={4} as='b'>
						<Text fontSize='3xl' color='salmon' as='u'>Créer une Note de Frais</Text>
					</Box>
				</Container>
				<Container maxW='container.xl'>
					{error && <ErrorMessage message={error} />}
					<form onSubmit={submitFormData} my={4}>
						<Stack direction='row'>
							<FormControl isRequired mr={3}>
								<FormLabel>Pour l'utilisateur :</FormLabel>
								<Select placeholder='Choisir utilisateur' onChange={event => setUserNDF(event.currentTarget.value)}>
									{em.map((utilisateur) => (
										<option key={utilisateur}>{utilisateur}</option>
									))}
								</Select>
							</FormControl>
							<FormControl isRequired ml={3}>
								<FormLabel>Pour le service :</FormLabel>
								<Select placeholder='Choisir service' onChange={event => setServNDF(event.currentTarget.value)}>
									{serv.map((service) => (
										<option key={service}>{service}</option>
									))}
								</Select>
							</FormControl>
						</Stack>
						<Stack direction='row' mt={3}>
							<FormControl isRequired mr={3}>
								<FormLabel>entre (Date début)</FormLabel>
								<Input
									size="md"
									type="date"
									onChange={event => setStartDateNDF(event.currentTarget.value)}
								/>
							</FormControl>
							<FormControl isRequired ml={3}>
								<FormLabel>et (Date fin)</FormLabel>
								<Input
									size="md"
									type="date"
									onChange={event => setEndDateNDF(event.currentTarget.value)}
								/>
							</FormControl>
						</Stack>
						<Stack align="center" mt={3}>
							<Button colorScheme='green' variant="outline" type="submit">
								{isLoading ? (<CircularProgress isIndeterminate size="24px" color="teal" />) : ('Créer NDF')}
							</Button>
						</Stack>
					</form>
				</Container>
				<Divider borderColor={'salmon'} height={'20px'} borderBottom="5px solid salmon" />
				<Container>
					{pdf}
				</Container>
			</> : <>
				<Navbar />
				<Container centerContent>
					<Box mb={4} as='b'>
						<Text fontSize='2xl' color='red'>Connectez vous en tant que gestionnaire pour créer une NDF.</Text>
					</Box>
				</Container>
			</>
	)
}
