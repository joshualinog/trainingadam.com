const rows = require('./donationRows');

// One slip per donatable item plus one general (handwritten) slip per row.
const slips = [];

rows.forEach((row) => {
  const isBranch = Boolean(row.key);
  const base = {
    rowName: row.name,
    rowTagline: row.tagline || '',
    rowUrl: row.url,
    isBranch,
    domain: row.domain || '',
  };

  slips.push({
    ...base,
    kind: 'general',
    title: 'General Donation',
    short: `Anything that helps ${row.name}`,
    description: '',
    url: row.generalSlipUrl,
  });

  row.branchDonations.forEach((d) => {
    slips.push({
      ...base,
      kind: 'item',
      title: d.name,
      short: d.short,
      description: d.description,
      image: d.image,
      photo: d.photo || '',
      url: d.slipUrl,
    });
  });
});

module.exports = slips;
