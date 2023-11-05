import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
	FormErrorMessage,
	FormLabel,
	Select,
	Radio,
	RadioGroup,
	HStack,
	FormControl,
	Button,
	Stack,
	Divider,
	ButtonGroup,
	Box,
	Flex,
	Heading
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import useSessionStorage from "../lib/useSessionStorage";

const FormulaireStep2 = ({ nextStep, handleFormData, prevStep, inputList, setInputList, values }) => {
	const rolesValue = useState([])[0];
	const servicesValue = useState([])[0];
	const [errorNoService, setErrorNoService] = useState(false);
	const [services, setServices] = useState([]);
	const token = useSessionStorage('token')[0];
	const user = useSessionStorage('user')[0];

	const submitFormData = (e) => {
		e.preventDefault();
		if (inputList.length === 0) {
			setErrorNoService(true);
			return;
		}
		var services = [];
		for (var i = 0; i < rolesValue.length; i++) {
			let service = {
				nom: servicesValue[i],
				role: rolesValue[i]
			}
			services.push(service);
		}
		values.services = services;
		nextStep();
	};

	const remplirTab = input => e => {
		if (input.split(" ")[0] === "service")
			servicesValue[input.split(" ")[1]] = e.target.value;
		else if (input.split(" ")[0] === "role")
			rolesValue[input.split(" ")[1]] = e.target.value;
	};

	useEffect(() => {
		var listeServices = [];
		if (user.superUtilisateur) // si c'est un superutilisateur, il peut associer au nouveau compte n'importe quel service
			axios.get('http://localhost:8080/api/services?secret_token=' + token).then((rep) => {
				let services = rep.data.data;
				for (var i = 0; i < services.length; i++)
					listeServices.push(services[i].service)
				setServices(listeServices);
				console.log(services)
			});
		else { // sinon, il ne peut associer au nouveau compte que les services dont il est gestionnaire
			user.services.forEach(element => {
				if (element.role === "gestionnaire")
					listeServices.push(element.nom);
			});
			setServices(listeServices);
		}
	}, [token,user]);

	const Service = () => {
		return <>
			<Divider borderColor={'orange'} height={'10px'} />
			<FormControl isRequired mt={3}>
				<FormLabel>Service n°{inputList.length + 1}</FormLabel>
				<Select name={"service" + inputList.length} placeholder='Choisir service' onChange={remplirTab("service " + inputList.length)}>
					{services.map((service) => (
						<option key={service} value={service}>{service}</option>
					))}
				</Select>
			</FormControl>
			<FormControl as='fieldset' isRequired mt={3}>
				<FormLabel as='legend'>Accréditation du service n°{inputList.length + 1}</FormLabel>
				<RadioGroup>
					<HStack spacing='24px'>
						<Radio value='utilisateur' name={"role" + inputList.length} onChange={remplirTab("role " + inputList.length)}>utilisateur</Radio>
						<Radio value='gestionnaire' name={"role" + inputList.length} onChange={remplirTab("role " + inputList.length)}>gestionnaire</Radio>
					</HStack>
				</RadioGroup>
			</FormControl>
		</>
	};

	const onAddBtnClick = () => {
		setInputList([...inputList, <Service key={inputList.length} />]);
	}

	return (
		<Flex width="full" align="center" justifyContent="center">
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
						<FormControl isRequired mt={3} isInvalid={errorNoService}>
							<Stack justifyContent="center">
								<Button variant='outline' colorScheme='orange' mt={3} mb={1} onClick={onAddBtnClick}>Associer un nouveau service</Button>
								{errorNoService ? (<FormErrorMessage>Associez un service svp.</FormErrorMessage>) : (<></>)}
								{inputList}
							</Stack>
						</FormControl>
						<Stack direction='row' spacing={4} justifyContent="center">
							<ButtonGroup variant='outline' mt={3} >
								<Button leftIcon={<ArrowBackIcon />} onClick={prevStep}>Précédent</Button>
								<Button rightIcon={<ArrowForwardIcon />} colorScheme='blue' type="submit">Suivant</Button>
							</ButtonGroup>
						</Stack>
					</form>
				</Box>
			</Box>
		</Flex>
	);
}
export default FormulaireStep2;