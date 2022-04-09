import { promiseSetRecoil } from 'recoil-outside';
import {
	adminEmailState,
	adminPwdState,
	adminTmpEmailState,
	adminTmpPwdState,
	adminTokenState,
	isAdminState,
	isMfaEnabledState,
	isMfaVerifiedState,
	pendingRequestsState,
	usersListState,
} from '../states/main';

export const handleAdminLogout = async () => {
	localStorage.removeItem('email');
	await promiseSetRecoil(pendingRequestsState, []);
	await promiseSetRecoil(usersListState, []);
	await promiseSetRecoil(adminEmailState, '');
	await promiseSetRecoil(adminPwdState, '');
	await promiseSetRecoil(adminTmpEmailState, '');
	await promiseSetRecoil(adminTmpPwdState, '');
	await promiseSetRecoil(adminTokenState, '');
	await promiseSetRecoil(isAdminState, false);
	await promiseSetRecoil(isMfaEnabledState, false);
	await promiseSetRecoil(isMfaVerifiedState, false);
};
