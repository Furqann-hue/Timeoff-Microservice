let requests = [];
let idCounter = 1;

function createRequest(req, res) {
  const { employeeId, locationId, daysRequested } = req.body;

  const key = `${employeeId}_${locationId}`;
  const balance = req.app.locals.balances[key] || 0;

  if (balance < daysRequested) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // call mock HCM
  if (balance < daysRequested) {
    return res.status(400).json({ error: 'HCM rejected' });
  }

  req.app.locals.balances[key] -= daysRequested;

  const request = {
    id: idCounter++,
    employeeId,
    locationId,
    daysRequested,
    status: 'APPROVED'
  };

  requests.push(request);

  res.json(request);
}

function getRequest(req, res) {
  const request = requests.find(r => r.id == req.params.id);
  if (!request) return res.status(404).json({ error: 'Not found' });
  res.json(request);
}

module.exports = { createRequest, getRequest };