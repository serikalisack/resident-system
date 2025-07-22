// public/js/dashboard.js

// Redirect to login if no token
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
  window.location.href = 'index.html';
}

document.getElementById('username').textContent = user.username;
document.getElementById('role').textContent = user.role;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});

// Fetch stats from backend
async function fetchStats() {
  try {
    const headers = { 'Authorization': token };

    const [usersRes, residentsRes, householdsRes] = await Promise.all([
      fetch('http://localhost:5000/api/auth/users', { headers }),
      fetch('http://localhost:5000/api/residents', { headers }),
      fetch('http://localhost:5000/api/households', { headers }),
    ]);

    const users = await usersRes.json();
    const residents = await residentsRes.json();
    const households = await householdsRes.json();

    document.getElementById('totalUsers').textContent = Array.isArray(users) ? users.length : 'N/A';
    document.getElementById('totalResidents').textContent = Array.isArray(residents) ? residents.length : 'N/A';
    document.getElementById('totalHouseholds').textContent = Array.isArray(households) ? households.length : 'N/A';

  } catch (err) {
    console.error('Error fetching stats:', err);
  }
}

fetchStats();
