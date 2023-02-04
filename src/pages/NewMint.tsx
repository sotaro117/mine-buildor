import {
  Button,
  Text,
  HStack,
  VStack,
  Container,
  Heading,
  Box,
} from "@chakra-ui/react"
import {
  MouseEventHandler,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { NextPage } from "next"
import styles from "../../styles/Home.module.css"

interface NewMintProps {
  mint: PublicKey
}

// @ts-ignore
const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [metadata, setMetadata] = useState<any>()
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    // What this does is to allow us to find the NFT object
    // based on the given mint address
    metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(mint) })
      .then((nft) => {
        // We then fetch the NFT uri to fetch the NFT metadata
        fetch(nft.uri)
          .then((res) => res.json())
          .then((metadata) => {
            setMetadata(metadata)
          })
      })
  }, [mint, metaplex, walletAdapter])

  // REST OF YOUR CODE

  return (
    <div className={styles.container}>
      <Box
        w="full"
        h="calc(100vh)"
        bgImage={"url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <VStack>
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

              <Text color="white" fontSize="xl" textAlign="center">
                Conglatulations! Each buildoor is randomly generated and can be
                staked to receive $BLD Use your $BLD to upgrade your buildoor
                and receive perks within the community!
              </Text>
            </VStack>
          </Container>
          <img src={metadata?.image ?? ""} alt="" />
          <Button bgColor="accent" color="white" maxWidth="380px">
            <HStack>
              <Text>stake my buildoor</Text>
              <ArrowForwardIcon />
            </HStack>
          </Button>
        </VStack>
      </Box>
    </div>
  )
}
// @ts-ignore
NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query
  if (!mint) throw { error: "No mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey }
  } catch (err) {
    alert(err)
  }
}
export default NewMint
