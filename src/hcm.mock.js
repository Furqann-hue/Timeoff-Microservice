function validate(req, res) {
  const { days } = req.body;

  if (days > 10) {
    return res.json({ success: false });
  }

  res.json({ success: true });
}

module.exports = { validate };