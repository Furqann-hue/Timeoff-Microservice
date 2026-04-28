function getBalance(req, res) {
  const { employeeId, locationId } = req.params;
  const key = `${employeeId}_${locationId}`;

  const balance = req.app.locals.balances[key] || 0;

  res.json({ employeeId, locationId, balance });
}

function batchSync(req, res) {
  const data = req.body;

  data.forEach(b => {
    const key = `${b.employeeId}_${b.locationId}`;
    req.app.locals.balances[key] = b.balance;
  });

  res.json({ success: true });
}

module.exports = { getBalance, batchSync };