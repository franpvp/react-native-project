import React from "react";
import { Button, Center, Factory, PresenceTransition, Stack, VStack, View } from "native-base";

const ButtonCustom = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return <VStack space={4} alignItems="center">
        <Button 
            size="md" 
            variant="solid" 
            colorScheme="primary" 
            w="80%" 
            mt={10} 
            borderRadius={30}
            onPress={() => setIsOpen(!isOpen)}>
                {isOpen ? "Buscar" : "Buscar"}
        </Button>
        <PresenceTransition visible={isOpen} initial={{
            opacity: 0,
            scale: 0
            }} animate={{
            opacity: 1,
            scale: 1,
            transition: {
                duration: 250
            }
            }}>
        <Center w="200" h="100" mt="7" bg="teal.500" rounded="md">
            Info
        </Center>
        </PresenceTransition>
    </VStack>;
}

export default ButtonCustom;