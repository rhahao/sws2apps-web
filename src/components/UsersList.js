import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';
import UserItem from './UserItem';
import {
	adminEmailState,
	adminPasswordState,
	apiHostState,
	usersListState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const UsersList = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [data, setData] = useRecoilState(usersListState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPasswordState);

	const [isProcessing, setIsProcessing] = useState(true);
	const [isError, setIsError] = useState(false);

	const handleFetchUsers = useCallback(async () => {
		setIsError(false);
		setIsProcessing(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/get-users`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						const users = await res.json();
						setData(users);
					} else {
						setIsError(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					setIsError(true);
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	}, [
		adminEmail,
		adminPassword,
		apiHost,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setData,
		abortCont,
	]);

	useEffect(() => {
		const fetchUsers = async () => {
			await handleFetchUsers();
		};

		fetchUsers();
	}, [handleFetchUsers]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<>
			{isError && (
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '25px',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<ErrorIcon
						color='error'
						sx={{
							fontSize: '60px',
							cursor: 'pointer',
						}}
					/>
					<Typography align='center' sx={{ marginTop: '15px' }}>
						An error occured while fetching users
					</Typography>
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleFetchUsers}
					>
						Refresh
					</Link>
				</Container>
			)}
			{isProcessing && (
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '25px',
					}}
				>
					<CircularProgress disableShrink color='secondary' size={'60px'} />
				</Container>
			)}
			{!isProcessing && !isError && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
						<IconButton color='inherit' edge='start' onClick={handleFetchUsers}>
							<RefreshIcon />
						</IconButton>
					</Box>
					<Box sx={{ marginTop: '20px' }}>
						{data.length > 0 && (
							<>
								{data.map((user) => (
									<UserItem key={user.uid} user={user} />
								))}
							</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default UsersList;