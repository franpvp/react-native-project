import { Center, Factory, Input, Stack, View } from "native-base";
import ButtonCustom from "./Button";

const BuscadorMarketIdHome = () => {
    return <Stack space={4} w="100%" maxW="300px" mx="auto">
        <Input variant="outline" placeholder="Ingresar Market Id" mt={10}/>
        <ButtonCustom />
    </Stack>;
}

export default BuscadorMarketIdHome;