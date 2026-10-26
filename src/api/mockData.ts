import { Temple, Offering, Order, NAKSHATRAS } from '../types';

export const INITIAL_TEMPLES: Temple[] = [
  {
    id: 'sabarimala',
    name: 'Sabarimala Sree Dharma Sastha Temple',
    location: 'Pathanamthitta, Kerala',
    deity: 'Lord Ayyappa',
  },
  {
    id: 'chottanikkara',
    name: 'Chottanikkara Bhagavathy Temple',
    location: 'Ernakulam, Kerala',
    deity: 'Sree Bhagavathy & Bhadrakali',
  },
  {
    id: 'guruvayur',
    name: 'Guruvayur Sree Krishna Temple',
    location: 'Thrissur, Kerala',
    deity: 'Lord Guruvayurappan',
  },
];

export const INITIAL_OFFERINGS: Offering[] = [
  // Sabarimala
  {
    id: 'sab-neyyabhishekam',
    templeId: 'sabarimala',
    name: 'Neyyabhishekam',
    description: 'Sacred ghee offering bathed over the sanctum idol.',
    price: 150,
    active: true,
  },
  {
    id: 'sab-aravana',
    templeId: 'sabarimala',
    name: 'Aravana Payasam',
    description: 'Traditional dark jaggery and rice pudding prasadam.',
    price: 100,
    active: true,
  },
  {
    id: 'sab-appam',
    templeId: 'sabarimala',
    name: 'Unniyappam Prasadam',
    description: 'Sweet fried rice flour delicacies offered to Lord Sastha.',
    price: 60,
    active: true,
  },
  {
    id: 'sab-pushpanjali',
    templeId: 'sabarimala',
    name: 'Pushpanjali',
    description: 'Floral garland offering with chanting of sacred mantras.',
    price: 30,
    active: true,
  },
  {
    id: 'sab-archana',
    templeId: 'sabarimala',
    name: 'Archana',
    description: 'Vedic recitation of names for devotee blessings and prosperity.',
    price: 50,
    active: true,
  },
  {
    id: 'sab-ganapathi-homam',
    templeId: 'sabarimala',
    name: 'Ganapathi Homam',
    description: 'Sacred fire ritual performed early morning for overcoming obstacles.',
    price: 250,
    active: true,
  },
  {
    id: 'sab-sahasranamam',
    templeId: 'sabarimala',
    name: 'Sahasranama Archana',
    description: 'Chanting of 1008 divine names with bilva and tulsi leaves.',
    price: 120,
    active: true,
  },
  {
    id: 'sab-ashtabhishekam',
    templeId: 'sabarimala',
    name: 'Ashtabhishekam',
    description: 'Holy bathing with 8 sacred substances including honey and milk.',
    price: 500,
    active: true,
  },
  {
    id: 'sab-padi-pooja',
    templeId: 'sabarimala',
    name: 'Padi Pooja (Seasonal)',
    description: 'Grand floral and lamp ritual across the holy 18 golden steps.',
    price: 15000,
    active: false, // Inactive seasonal offering
  },
  {
    id: 'sab-udayasthamana',
    templeId: 'sabarimala',
    name: 'Udayasthamana Pooja',
    description: 'Comprehensive dawn to dusk pooja cycle.',
    price: 5000,
    active: false, // Inactive
  },

  // Chottanikkara
  {
    id: 'cho-guruthi',
    templeId: 'chottanikkara',
    name: 'Guruthi Pooja',
    description: 'Auspicious evening pooja performed at the Keezhkkavu shrine.',
    price: 200,
    active: true,
  },
  {
    id: 'cho-bhagyasooktha',
    templeId: 'chottanikkara',
    name: 'Bhagyasooktha Pushpanjali',
    description: 'Offering of sacred flowers invoking good fortune and wealth.',
    price: 40,
    active: true,
  },
  {
    id: 'cho-archana',
    templeId: 'chottanikkara',
    name: 'Archana',
    description: 'Personalized chanting of holy mother stotrams for devotee peace.',
    price: 50,
    active: true,
  },
  {
    id: 'cho-raktha-pushpanjali',
    templeId: 'chottanikkara',
    name: 'Pushpanjali (Raktha Pushpanjali)',
    description: 'Red ixora flower offering dedicated to Goddess Bhadrakali.',
    price: 35,
    active: true,
  },
  {
    id: 'cho-payasam',
    templeId: 'chottanikkara',
    name: 'Palpayasam Nivedyam',
    description: 'Rich condensed milk and sugar payasam nivedyam.',
    price: 75,
    active: true,
  },
  {
    id: 'cho-thrikkala-pooja',
    templeId: 'chottanikkara',
    name: 'Thrikkala Pooja',
    description: 'Three-session pooja during morning, noon, and twilight.',
    price: 300,
    active: true,
  },
  {
    id: 'cho-vidyarambham',
    templeId: 'chottanikkara',
    name: 'Vidyarambham Saraswati Pooja',
    description: 'Blessings for education, wisdom, and speech arts.',
    price: 150,
    active: true,
  },
  {
    id: 'cho-chuttuvilakku',
    templeId: 'chottanikkara',
    name: 'Chuttuvilakku Deepam',
    description: 'Lighting all stone oil lamps around the outer sanctum.',
    price: 1000,
    active: true,
  },
  {
    id: 'cho-chirappu',
    templeId: 'chottanikkara',
    name: 'Mandalam Chirappu (Seasonal)',
    description: 'Special 41-day festive mandalam ceremony.',
    price: 2500,
    active: false, // Inactive
  },
];

const DEVOTEES = [
  { name: 'Ramesh Nair', phone: '9847012345' },
  { name: 'Priya Pillai', phone: '9847123456' },
  { name: 'Anand Krishna', phone: '9847234567' },
  { name: 'Anjana Menon', phone: '9847345678' },
  { name: 'Suresh Kumar', phone: '9847456789' },
  { name: 'Divya Varma', phone: '9847567890' },
  { name: 'Gokul Das', phone: '9847678901' },
  { name: 'Lakshmi Nambiar', phone: '9847789012' },
  { name: 'Unnikrishnan P', phone: '9847890123' },
  { name: 'Meera Rajesh', phone: '9847901234' },
  { name: 'Arjun Mohan', phone: '9745012345' },
  { name: 'Kavitha Sreedharan', phone: '9745123456' },
  { name: 'Hari Govind', phone: '9745234567' },
  { name: 'Sujatha Kurup', phone: '9745345678' },
  { name: 'Vipin Chandran', phone: '9745456789' },
];

export function generateSeedOrders(): Order[] {
  const orders: Order[] = [];
  const today = new Date('2026-10-26');

  for (let i = 1; i <= 52; i++) {
    const devotee = DEVOTEES[i % DEVOTEES.length];
    const nakshatra = NAKSHATRAS[i % NAKSHATRAS.length];
    const temple = i % 2 === 0 ? INITIAL_TEMPLES[0] : INITIAL_TEMPLES[1];
    
    // Spread dates from past 10 days to next 20 days
    const dateOffset = (i % 30) - 10;
    const offeringDateObj = new Date(today);
    offeringDateObj.setDate(offeringDateObj.getDate() + dateOffset);
    const offeringDate = offeringDateObj.toISOString().split('T')[0];

    const templeOfferings = INITIAL_OFFERINGS.filter(
      (o) => o.templeId === temple.id && o.active
    );

    const off1 = templeOfferings[i % templeOfferings.length];
    const off2 = templeOfferings[(i + 2) % templeOfferings.length];
    const qty1 = (i % 3) + 1;
    const qty2 = i % 4 === 0 ? 2 : 0;

    const items = [
      {
        offeringId: off1.id,
        offeringName: off1.name,
        price: off1.price,
        quantity: qty1,
        subtotal: off1.price * qty1,
      },
    ];

    if (qty2 > 0 && off2.id !== off1.id) {
      items.push({
        offeringId: off2.id,
        offeringName: off2.name,
        price: off2.price,
        quantity: qty2,
        subtotal: off2.price * qty2,
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const status = i % 11 === 0 ? 'CANCELLED' : i % 5 === 0 ? 'PENDING' : 'CONFIRMED';

    const orderDate = new Date(offeringDateObj);
    orderDate.setDate(orderDate.getDate() - 3);

    orders.push({
      id: `ORD-2026-${String(1000 + i)}`,
      templeId: temple.id,
      templeName: temple.name,
      devoteeName: devotee.name,
      phoneNumber: devotee.phone,
      nakshatra,
      offeringDate,
      items,
      totalAmount,
      status,
      createdAt: orderDate.toISOString(),
    });
  }

  return orders;
}
