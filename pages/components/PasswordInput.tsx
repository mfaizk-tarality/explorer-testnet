import { useState } from 'react';
import {
    Box,
    IconButton,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const PasswordInput = ({
    value,
    onChange,
    id,
    placeholder,
    isDisabled,
    error
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    placeholder: string;
    isDisabled: boolean;
    error?: string;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl id={id} mb={4} isInvalid={!!error}>
            <FormLabel>{placeholder}</FormLabel>

            <InputGroup
                h="35px"
                size='sm'
            >
                <Input
                    maxLength={30}
                    isDisabled={isDisabled}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />

                <InputRightAddon sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '40px'
                }}>
                    <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <HiEyeOff /> : <HiEye />}
                        onClick={() => setShowPassword(!showPassword)}
                        position="absolute"
                        variant="link"
                        p="0"
                        m="0"
                    />
                </InputRightAddon>
            </InputGroup>


            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default PasswordInput;
