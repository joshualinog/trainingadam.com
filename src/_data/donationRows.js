const branches = require('./branchPages');

const extraRows = [
  {
    name: 'Food',
    tagline: 'Fresh and shelf-stable food for gatherings, workdays and neighbors',
    emoji: '🍎',
    url: '/donate',
    branchDonations: [
      { image: 'donation-produce.jpg', name: 'Fresh Produce', short: 'Fruit and vegetables', description: 'Share garden surplus or farm-fresh produce for community meals and workdays.' },
      { image: 'donation-pantry.jpg', name: 'Pantry Staples', short: 'Shelf-stable food', description: 'Rice, beans, flour, canned goods and other staples that keep and feed many people.' },
      { image: 'donation-eggs.jpg', name: 'Eggs and Dairy', short: 'Local eggs and dairy', description: 'Eggs, milk, cheese and other fresh protein for shared meals.' },
      { image: 'donation-bread.jpg', name: 'Baked Goods', short: 'Bread and baking', description: 'Fresh bread and baked goods for gatherings and volunteer days.' },
      { image: 'donation-drinks.jpg', name: 'Drinks', short: 'Water, tea and coffee', description: 'Water, tea, coffee and juice to keep volunteers and guests refreshed.' },
      { image: 'donation-catering.jpg', name: 'Prepared Meals', short: 'Cooked meals', description: 'Prepared meals or catering for events, build days and community gatherings.' },
    ],
  },
  {
    name: 'Building Materials',
    tagline: 'Everything we need to keep building',
    emoji: '🧱',
    url: '/donate',
    branchDonations: [
      { image: 'donation-lumber.jpg', name: 'Wood and Lumber', short: 'Framing, decking and reclaimed wood', description: 'New or reclaimed lumber for sheds, coops, planters and tiny structures.' },
      { image: 'donation-hardware.jpg', name: 'Hardware', short: 'Screws, hinges and latches', description: 'Fasteners, hinges, latches and brackets for every build.' },
      { image: 'donation-roofing.jpg', name: 'Roofing and Siding', short: 'Panels, shingles and siding', description: 'Metal panels, shingles and siding to weatherproof our projects.' },
      { image: 'donation-windows.jpg', name: 'Windows and Doors', short: 'Salvaged windows and doors', description: 'Reusable windows and doors for sheds, greenhouses and tiny homes.' },
      { image: 'donation-paint.jpg', name: 'Paint and Finishes', short: 'Paint, stain and sealant', description: 'Leftover paint, stain and sealant to finish and protect our builds.' },
      { image: 'donation-tools.jpg', name: 'Tools', short: 'Hand and power tools', description: 'Hand and power tools in working condition for our builders and volunteers.' },
    ],
  },
  {
    name: 'Hosting Spaces and Times',
    tagline: 'Offer a place or a time to bring people together',
    emoji: '🗓️',
    url: '/donate',
    branchDonations: [
      { image: 'donation-venue.jpg', name: 'Event Venue', short: 'A place for gatherings', description: 'Host a community event, work party or celebration at your venue.' },
      { image: 'donation-workshop-space.jpg', name: 'Workshop Space', short: 'Room for learning', description: 'Lend a barn, garage or classroom for hands-on workshops.' },
      { image: 'donation-land.jpg', name: 'Land for Gatherings', short: 'Outdoor space', description: 'Open your land for a build day, garden day or campfire gathering.' },
      { image: 'donation-meeting.jpg', name: 'Meeting Rooms', short: 'Indoor meeting space', description: 'Provide a meeting room for planning sessions and community talks.' },
      { image: 'donation-hours.jpg', name: 'Volunteer Hours', short: 'Your time and hands', description: 'Give a day or a few hours to help build, plant, cook or organize.' },
      { image: 'donation-dates.jpg', name: 'Open Dates', short: 'Dates you can host', description: 'Tell us the dates and times you can host so we can plan events around them.' },
    ],
  },
];

module.exports = [...branches.filter((b) => b.key !== 'branch-data-schema'), ...extraRows];
