import {
  Box,
  Container,
  Stack,
  Text,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box id="footer"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Divider />
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}>
        <Text>© 2023 TPI NDF. &nbsp;
        Agrebi, Ahmed, Ben El Bey, Nortier</Text>
      </Container>
    </Box>
  );
}