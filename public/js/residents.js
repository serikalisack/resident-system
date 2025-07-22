// public/js/residents.js

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

const residentsTableBody = document.querySelector('#residentsTable tbody');
const residentForm = document.getElementById('residentForm');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingResidentId = null;

showAddFormBtn.addEventListener('click', () => {
  residentForm.style.display = 'block';
  showAddFormBtn.style.display = 'none';
  residentForm.reset();
  editingResidentId = null;
});

cancelBtn.addEventListener('click', () => {
  residentForm.style.display = 'none';
  showAddFormBtn.style.display = 'block';
});

residentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const residentData = {
    id: editingResidentId || generateUUID(),
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    national_id: document.getElementById('national_id').value,
    date_of_birth: document.getElementById('date_of_birth').value,
    gender: document.getElementById('gender').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    location: document.getElementById('location').value,
    employment_status: document.getElementById('employment_status').value,
    property_ownership_details: document.getElementById('property_ownership_details').value,
    household_id: document.getElementById('household_id').value,
  };

  try {
    const url = editingResidentId
      ? `http://localhost:5000/api/residents/${editingResidentId}`
      : 'http://localhost:5000/api/residents';

    const method = editingResidentId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(residentData),
    });

    if (!response.ok) {
      const err = await response.json();
      alert('Error: ' + (err.message || 'Failed to save'));
      return;
    }

    residentForm.style.display = 'none';
    showAddFormBtn.style.display = 'block';
    loadResidents();
  } catch (error) {
    alert('Network error');
  }
});

// Fetch and display residents
async function loadResidents() {
  try {
    const response = await fetch('http://localhost:5000/api/residents', {
      headers: { Authorization: token },
    });
    const residents = await response.json();

    residentsTableBody.innerHTML = '';

    residents.forEach((r) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.first_name}</td>
        <td>${r.last_name}</td>
        <td>${r.national_id}</td>
        <td>${r.date_of_birth ? new Date(r.date_of_birth).toLocaleDateString() : ''}</td>
        <td>${r.gender}</td>
        <td>${r.phone || ''}</td>
        <td>${r.email || ''}</td>
        <td>
          <button onclick="editResident('${r.id}')">Edit</button>
          <button onclick="deleteResident('${r.id}')">Delete</button>
        </td>
      `;

      residentsTableBody.appendChild(tr);
    });
  } catch (error) {
    alert('Failed to load residents');
  }
}

window.editResident = async function (id) {
  try {
    const response = await fetch(`http://localhost:5000/api/residents/${id}`, {
      headers: { Authorization: token },
    });
    const resident = await response.json();

    editingResidentId = id;

    residentForm.style.display = 'block';
    showAddFormBtn.style.display = 'none';

    document.getElementById('residentId').value = resident.id;
    document.getElementById('first_name').value = resident.first_name;
    document.getElementById('last_name').value = resident.last_name;
    document.getElementById('national_id').value = resident.national_id;
    document.getElementById('date_of_birth').value = resident.date_of_birth ? resident.date_of_birth.split('T')[0] : '';
    document.getElementById('gender').value = resident.gender;
    document.getElementById('phone').value = resident.phone || '';
    document.getElementById('email').value = resident.email || '';
    document.getElementById('address').value = resident.address || '';
    document.getElementById('location').value = resident.location || '';
    document.getElementById('employment_status').value = resident.employment_status || '';
    document.getElementById('property_ownership_details').value = resident.property_ownership_details || '';
    document.getElementById('household_id').value = resident.household_id || '';

  } catch (error) {
    alert('Failed to fetch resident');
  }
};

window.deleteResident = async function (id) {
  if (!confirm('Are you sure you want to delete this resident?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/residents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    if (!response.ok) {
      alert('Failed to delete resident');
      return;
    }

    loadResidents();
  } catch (error) {
    alert('Network error');
  }
};

// Generate UUID for new residents (simple version)
function generateUUID() {
  return 'xxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 36) | 0).toString(36)
  );
}

// Initial load
loadResidents();
