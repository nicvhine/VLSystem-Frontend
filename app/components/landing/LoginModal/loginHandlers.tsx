interface LoginParams {
  username: string;
  password: string;
  onClose: () => void;
  router: any;
}

export async function loginHandler({ username, password, onClose, router }: LoginParams) {
  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  try {
    const borrowerRes = await fetch('http://localhost:3001/borrowers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (borrowerRes.ok) {
      const data = await borrowerRes.json();
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('fullName', data.fullName || data.name || data.username);
      localStorage.setItem('role', 'borrower');
      if (data.borrowersId) localStorage.setItem('borrowersId', data.borrowersId);
      data.isFirstLogin
        ? localStorage.setItem('forcePasswordChange', 'true')
        : localStorage.removeItem('forcePasswordChange');
      onClose();
      router.push('/components/borrower');
      return;
    }

    const staffRes = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (staffRes.ok) {
      const data = await staffRes.json();
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('fullName', data.fullName || data.name || data.username || data.email);
      localStorage.setItem('email', data.email);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role?.toLowerCase() || 'staff');
      if (data.role?.toLowerCase() === 'collector') {
        localStorage.setItem('collectorName', data.name);
      }
      if (data.userId) localStorage.setItem('userId', data.userId);
      data.isFirstLogin
        ? localStorage.setItem('forcePasswordChange', 'true')
        : localStorage.removeItem('forcePasswordChange');
      onClose();

      const redirectMap: Record<string, string> = {
        head: '/components/head',
        manager: '/components/manager',
        'loan officer': '/components/loanOfficer',
        collector: '/components/collector',
      };
      router.push(redirectMap[data.role?.toLowerCase()] || '/');
      return;
    }

    alert('Invalid credentials or user not found.');
  } catch (error) {
    console.error('Login error:', error);
    alert('Error connecting to the server.');
  }
}
