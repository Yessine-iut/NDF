import React from 'react';
import {
    Box,
    Flex,
    Link,
    useColorModeValue,
    HStack,
    Button,
    useColorMode,
    ButtonGroup
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import CreateServiceModal from './CreateServiceModal';
import useSessionStorage from '../lib/useSessionStorage';
import { useLocation, useNavigate } from 'react-router-dom';


export const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useSessionStorage('user');
    const setToken = useSessionStorage('token')[1];
    const logout = () => {
        setUser(null);
        setToken(null);
        (location.pathname === "/") ? navigate(0) : navigate('/');
    };

    let adminRender = <></>
    if (user !== null && user !== undefined)
        user.services.forEach(service => {
            if (service.role === "gestionnaire" || user.superUtilisateur) {
                adminRender = <><Button><Link href="/gestiondupersonnel">Gérer personnel</Link></Button>
                    <Button><Link href="/genererndf">Générer NDF</Link></Button></>
                return;
            }
        })

    return (
        <>
            <Box mb={3} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Flex justify="space-between" flex="1">
                        <ButtonGroup variant="link" spacing="5">
                            <Button><Link href="/">Accueil</Link></Button>
                            {adminRender}
                        </ButtonGroup>
                    </Flex>
                    <Flex alignItems={'center'}>
                        <HStack spacing="2" ml={3}>
                            {(user !== null && user !== undefined) ? (
                                <Button onClick={logout}>Se déconnecter</Button>
                            ) : (<Link href="/login"><Button>Se connecter</Button></Link>)}
                        </HStack>
                        <Button mx={2} onClick={() => { toggleColorMode(); }}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};
