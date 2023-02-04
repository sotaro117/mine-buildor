import { FC, MouseEventHandler, useCallback, useMemo, useState } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useRouter } from "next/router"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

const Connected: FC = () => {
  const router = useRouter()
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const candyMachineAddress = new PublicKey(
    "FeRUHbtb2u3euTiYFw7QE2Bgx4re7j6kqzDja9HJur2d"
  )
  const collectionUpdateAuthority = new PublicKey(
    "C3DaRYDJo5QTwovJ5hL2pefwkKKcJqD3xyQFNGZ1jZBp"
  )
  let candyMachine
  const [isMinting, setIsMinting] = useState(false)
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: candyMachineAddress })

      if (event.defaultPrevented) return
      if (!walletAdapter.connected) return
      if (!candyMachine) return

      try {
        setIsMinting(true)
        const nft = await metaplex
          .candyMachines()
          .mint({ candyMachine, collectionUpdateAuthority })
        console.log(nft)
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`)
      } catch (err) {
        alert(err)
      } finally {
        setIsMinting(false)
      }
    },
    [metaplex, walletAdapter, candyMachine]
  )
  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  )
}

export default Connected
