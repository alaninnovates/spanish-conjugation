import { Tense } from '@/lib/types';
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
} from '@chakra-ui/react';
import React, { useState } from 'react';

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

const SessionQuestion = ({
	sessionId,
	sessionStartTime,
	onSessionEnd,
}: {
	sessionId: string;
	sessionStartTime: number;
	onSessionEnd: () => void;
}) => {
	// role: get a random question from the backend (/api/get-question)
	// when the user submits an answer:
	// 1. tell the backend the user's answer (/api/submit-question)
	// 2. check if the sessionCompleted field is true, if so, call onSessionEnd
	// 3. get a new question
	const getQuestion = async () => {
		const res = await fetch('/api/get-question', {
			method: 'POST',
			body: JSON.stringify({
				sessionId,
			}),
		});
		const data = await res.json();
		if ('error' in data) {
			console.error('ERROR', data.error);
			return;
		}
		if ('sessionCompleted' in data) {
			onSessionEnd();
			return;
		}
		console.log('RECV QUESTION', data);
		return data;
	};
	const submitQuestion = async (
		tenseData: Exclude<Exclude<Tense, 'id'>, 'tense'>
	) => {
		const res = await fetch('/api/submit-question', {
			method: 'POST',
			body: JSON.stringify({
				sessionId,
				tenseData,
			}),
		});
		const data = await res.json();
		if ('error' in data) {
			console.error('ERROR', data.error);
			return;
		}
		console.log('RECV SUBMIT', data);
		return data;
	};
	return <></>;
};

const SessionEnd = () => {
	return (
		<>
			<Heading>Session Ended</Heading>
			<Text>Good job!</Text>
		</>
	);
};

export const Session = () => {
	const [currScreen, setCurrScreen] = useState('start');
	const [length, setLength] = useState<number>();
	const [tenses, setTenses] = useState<string[]>([]);
	const [sessionStartTime, setSessionStartTime] = useState<number>();
	const [sessionId, setSessionId] = useState<string>();
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
					{currScreen === 'start' ? (
						<SessionStartInputs
							length={length}
							setLength={setLength}
							tenses={tenses}
							setTenses={setTenses}
							onStart={async () => {
								setCurrScreen('session');
								setSessionStartTime(Date.now());
								const res = await fetch('/api/start-session', {
									method: 'POST',
									body: JSON.stringify({
										length,
										tenses,
									}),
								});
								const data = await res.json();
								console.log('RECV SESSION ID', data);
								setSessionId(data.sessionId);
							}}
						/>
					) : currScreen === 'session' ? (
						<SessionQuestion
							sessionId={sessionId!}
							sessionStartTime={sessionStartTime!}
							onSessionEnd={() => {
								setCurrScreen('end');
							}}
						/>
					) : currScreen === 'end' ? (
						<SessionEnd />
					) : (
						<></>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Session;
