import React, { useState } from 'react'
import { YStack, XStack, Text, Input, Button, H2 } from 'tamagui'
import { Lock, Eye, EyeOff, User } from '@tamagui/lucide-icons'
import { Redirect } from 'expo-router'

type LoginFormData = {
  user: string
  senha: string
}

const MOCK_USER = {
  user: 'admin',
  senha: '123',
}

export default function Login() {
  const [form, setForm] = useState<LoginFormData>({
    user: '',
    senha: '',
  })

  const [showsenha, setShowsenha] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [autenticado, setAutenticado] = useState(false)

  if (autenticado) {
    return <Redirect href="/(tabs)" />
  }

  const userError = enviado && !form.user ? 'Informe o usuário' : ''
  const senhaError = enviado && !form.senha ? 'Informe a senha' : ''
  const hasError = !!userError || !!senhaError

  function handleSubmit() {
    setEnviado(true)
    setAuthError('')

    if (hasError) return

    setLoading(true)

    setTimeout(() => {
      const isValid =
        form.user === MOCK_USER.user &&
        form.senha === MOCK_USER.senha

      if (!isValid) {
        setAuthError('Usuário ou senha inválidos')
        setLoading(false)
        return
      }

      setAutenticado(true)
      setLoading(false)
    }, 800)
  }

  return (
    <YStack flex={1} justify="center" items="center" p="$4">
      <YStack
        width="100%"
        maxW={420}
        gap="$5"
        p="$5"
        rounded="$6"
        bg="$background"
        elevation="$2"
      >
        <YStack gap="$2">
          <H2 fontWeight="800">Dosely</H2>
          <Text fontSize="$3" opacity={0.7}>
            Controle seus horários de medicação
          </Text>
        </YStack>

        <YStack gap="$1">
          <XStack
            items="center"
            gap="$2"
            p="$3"
            b="$1"
            rounded="$4"
            borderColor={userError ? '$red10' : '$borderColor'}
          >
            <User size={20} opacity={0.6} />
            <Input
              flex={1}
              unstyled
              placeholder="Usuário"
              value={form.user}
              onChangeText={user =>
                setForm(f => ({ ...f, user }))
              }
            />
          </XStack>

          {userError && (
            <Text fontSize="$2" color="$red10">
              {userError}
            </Text>
          )}
        </YStack>

        <YStack gap="$1">
          <XStack
            items="center"
            gap="$2"
            p="$3"
            b="$1"
            rounded="$4"
            borderColor={senhaError ? '$red10' : '$borderColor'}
          >
            <Lock size={20} opacity={0.6} />
            <Input
              flex={1}
              unstyled
              placeholder="Senha"
              secureTextEntry={!showsenha}
              value={form.senha}
              onChangeText={senha =>
                setForm(f => ({ ...f, senha }))
              }
            />

            <Button
              chromeless
              size="$2"
              onPress={() => setShowsenha(!showsenha)}
            >
              {showsenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </XStack>

          {senhaError && (
            <Text fontSize="$2" color="$red10">
              {senhaError}
            </Text>
          )}
        </YStack>

        {authError && (
          <Text fontSize="$2" color="$red10">
            {authError}
          </Text>
        )}

        <Button
          size="$4"
          fontWeight="700"
          bg="$blue12"
          color="white"
          disabled={loading || hasError}
          onPress={handleSubmit}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </YStack>
    </YStack>
  )
}
