import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CongregationPendingRequests from '../components/CongregationPendingRequests';
import UsersList from '../components/UsersList';

const AdminPanel = () => {
	const [value, setValue] = useState('1');

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList onChange={handleChange} aria-label='lab API tabs example'>
						<Tab label='Pending requests' value='1' />
						<Tab label='Congregations' value='2' />
						<Tab label='Users' value='3' />
					</TabList>
				</Box>
				<TabPanel value='1'>
					<CongregationPendingRequests />
				</TabPanel>
				<TabPanel value='2'>Item Two</TabPanel>
				<TabPanel value='3'>
					<UsersList />
				</TabPanel>
			</TabContext>
		</Box>
	);
};

export default AdminPanel;