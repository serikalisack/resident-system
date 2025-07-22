// public/js/households.js

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

const householdsTableBody = document.querySelector('#householdsTable tbody');
const householdForm = document.getElementById('householdForm');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingHouseholdId = null;

showAddFormBtn.addEventListener('click', () => {
  householdForm.style.display = 'block';
  showAddFormBtn.style.display = 'none';
  householdForm.reset();
  editingHouseholdId = null;
});

cancelBtn.addEventListener('click', () => {
  householdForm.style.display = 'none';
  showAddFormBtn.style.display = 'block';
});

householdForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const householdData = {
    id: editingHouseholdId || generateUUID(),
    household_name: document.getElementById('household_name').value,
    address: document.getElementById('address').value,
    location: document.getElementById('location').value,
    size: parseInt(document.getElementById('size').value) || 0,
    composition: document.getElementById('composition').value,
    property_ownership_details: document.getElementById('property_ownership_details').value,
  };

  try {
    const url = editingHouseholdId
      ? `http://localhost:5000/api/households/${editingHouseholdId}`
      : 'http://localhost:5000/api/households';

    const method = editingHouseholdId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(householdData),
    });

    if (!response.ok) {
      const err = await response.json();
      alert('Error: ' + (err.message || 'Failed to save'));
      return;
    }

    householdForm.style.display = 'none';
    showAddFormBtn.style.display = 'block';
    loadHouseholds();
  } catch (error) {
    alert('Network error');
  }
});

// Fetch and display households
async function loadHouseholds() {
  try {
    const response = await fetch('http://localhost:5000/api/households', {
      headers: { Authorization: token },
    });
    const households = await response.json();

    householdsTableBody.innerHTML = '';

    households.forEach((h) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${h.id}</td>
        <td>${h.household_name}</td>
        <td>${h.address || ''}</td>
        <td>${h.location || ''}</td>
        <td>${h.size}</td>
        <td>${h.composition || ''}</td>
        <td>
          <button onclick="editHousehold('${h.id}')">Edit</button>
          <button onclick="deleteHousehold('${h.id}')">Delete</button>
        </td>
      `;

      householdsTableBody.appendChild(tr);
    });
  } catch (error) {
    alert('Failed to load households');
  }
}

window.editHousehold = async function (id) {
  try {
    const response = await fetch(`http://localhost:5000/api/households/${id}`, {
      headers: { Authorization: token },
    });
    const household = await response.json();

    editingHouseholdId = id;

    householdForm.style.display = 'block';
    showAddFormBtn.style.display = 'none';

    document.getElementById('householdId').value = household.id;
    document.getElementById('household_name').value = household.household_name;
    document.getElementById('address').value = household.address || '';
    document.getElementById('location').value = household.location || '';
    document.getElementById('size').value = household.size || 0;
    document.getElementById('composition').value = household.composition || '';
    document.getElementById('property_ownership_details').value = household.property_ownership_details || '';

  } catch (error) {
    alert('Failed to fetch household');
  }
};

window.deleteHousehold = async function (id) {
  if (!confirm('Are you sure you want to delete this household?')) return;

  try {
    const response = await fetch(`http://localhost:5000/api/households/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    if (!response.ok) {
      alert('Failed to delete household');
      return;
    }

    loadHouseholds();
  } catch (error) {
    alert('Network error');
  }
};

// Generate UUID for new households (simple version)
function generateUUID() {
  return 'xxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 36) | 0).toString(36)
  );
}

// Initial load
loadHouseholds();
