import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { fonts } from "@/lib/fonts";
import { theme } from "@/lib/theme";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<style jsx global>
				{`
					:root {
						height: 100%;
						--font-inter: ${fonts.inter.style.fontFamily};
					}
					#__next {
						height: 100vh;
					}
				`}
			</style>

			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</>
	);
}
