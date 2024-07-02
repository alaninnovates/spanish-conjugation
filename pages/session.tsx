import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Container,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Spacer,
	Text,
	VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SessionStartInputs = ({
	length,
	setLength,
	tenses,
	setTenses,
	onStart,
}: {
	length: number | undefined;
	setLength: React.Dispatch<React.SetStateAction<number | undefined>>;
	tenses: string[];
	setTenses: React.Dispatch<React.SetStateAction<string[]>>;
	onStart: () => void;
}) => {
	return (
		<>
			<Heading>Start a session?</Heading>
			<Input
				type="number"
				value={length}
				onChange={(e) => setLength(parseInt(e.target.value))}
				placeholder="# Mins"
			/>
			<Box>
				<Text fontSize="lg" fontWeight="bold">
					Additional Options
				</Text>
				<FormControl>
					<FormLabel>Verb Tense</FormLabel>
					<CheckboxGroup
						onChange={(value: string[]) => {
							setTenses(value);
							console.log(value);
						}}
						value={tenses}
					>
						<VStack spacing={4} align="start">
							<Checkbox value="present">Present</Checkbox>
							<Checkbox value="preterite">Preterite</Checkbox>
							<Checkbox value="imperfect">Imperfect</Checkbox>
							<Checkbox value="present-subjunctive">
								Present Subjunctive
							</Checkbox>
						</VStack>
					</CheckboxGroup>
				</FormControl>
			</Box>
			<Spacer />
			<Button colorScheme="blue" size="lg" onClick={onStart}>
				Go!
			</Button>
		</>
	);
};

export const Session = () => {
	const [currScreen, setCurrScreen] = useState("start");
	const [length, setLength] = useState<number>();
	const [tenses, setTenses] = useState<string[]>([]);
	return (
		<Box bg="blue.300" h="100%">
			<Container
				maxW="container.lg"
				h="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Box
					bg="#F4F7FF"
					w="100%"
					h="80%"
					p={12}
					borderRadius="md"
					display="flex"
					flexDirection="column"
					gap={4}
				>
					{currScreen === "start" ? (
						<SessionStartInputs
							length={length}
							setLength={setLength}
							tenses={tenses}
							setTenses={setTenses}
							onStart={() => setCurrScreen("session")}
						/>
					) : (
						<></>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Session;
