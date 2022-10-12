import { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Text,
  Modal,
  FormControl
} from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'

import Logo from '../assets/logo_primary.svg'

import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [modalVisible, setModalVisible] = useState(false)
  const [emailNewUser, setEmailNewUser] = useState('')
  const [passwordNewUser, setPasswordNewUser] = useState('')

  const { colors } = useTheme()
  const navigation = useNavigation()

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe e-mail e senha.')
    }

    setIsLoading(true)

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error)
        setIsLoading(false)

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido.')
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'E-mail ou senha inválida.')
        }

        return Alert.alert('Entrar', 'Não foi possível acessar')
      })
  }

  async function handleNewUser() {
    if (!emailNewUser || !passwordNewUser) {
      return Alert.alert('Entrar', 'Preencha todos os campos.')
    }
    setIsLoading(true)
    auth()
      .createUserWithEmailAndPassword(emailNewUser, passwordNewUser)
      .then(() => {
        Alert.alert('Cadastro', 'Usuario cadastrado com sucesso!')
        navigation.goBack()
      })
      .catch(error => {
        console.log(error)
        setIsLoading(false)

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'E-mail inválido.')
        }

        return Alert.alert('Entrar', 'Não foi possível acessar')
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />

      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Entrar"
        w="full"
        mb={10}
        onPress={handleSignIn}
        isLoading={isLoading}
      />

      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        justifyContent="center"
      
        bottom="4"
        size="lg"
      >
        <Modal.Content  >
          <Modal.CloseButton />
          <Modal.Header  >Cadastro</Modal.Header>
          <Modal.Body>
            <Input
              mb={22}
              placeholder="E-mail"
              InputLeftElement={
                <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
              }
              onChangeText={setEmailNewUser}
            />
            <Input
          
              placeholder="Senha"
              InputLeftElement={
                <Icon as={<Key color={colors.gray[300]} />} ml={4} />
              }
              secureTextEntry
              onChangeText={setPasswordNewUser}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              title="Cadastro"
              w="full"
              onPress={handleNewUser}
              isLoading={isLoading}
            />
          
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <VStack alignItems="flex-end">
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <Text color="gray.100" fontSize="14">
            Não possui uma conta?{' '}
            <Text color={colors.green[500]}> Registre-se.</Text>
          </Text>
        </TouchableOpacity>
      </VStack>
    </VStack>
  )
}
