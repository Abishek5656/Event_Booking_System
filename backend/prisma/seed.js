const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding dummy data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Organizer
  const organizer1 = await prisma.user.create({
    data: {
      name: 'Tech Events Inc',
      email: 'admin@techevents.com',
      passwordHash,
      role: 2, // ORGANIZER
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      name: 'Music Festivals LLC',
      email: 'admin@musicfest.com',
      passwordHash,
      role: 2, // ORGANIZER
    },
  });

  // 2. Create Customers
  const customer1 = await prisma.user.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      passwordHash,
      role: 1, // CUSTOMER
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      passwordHash,
      role: 1, // CUSTOMER
    },
  });

  // 3. Create Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Global Tech Summit 2026',
      description: 'The biggest technology conference focusing on AI, Web3, and Cloud computing.',
      venue: 'San Francisco Convention Center',
      eventDate: new Date('2026-09-15T09:00:00Z'),
      totalSeats: 500,
      availableSeats: 498, // 2 seats booked
      organizerId: organizer1.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Summer Jazz Festival',
      description: 'A relaxing weekend with the best jazz bands from around the world.',
      venue: 'Central Park Main Stage',
      eventDate: new Date('2026-07-20T17:00:00Z'),
      totalSeats: 1000,
      availableSeats: 995, // 5 seats booked
      organizerId: organizer2.id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Node.js Developer Meetup',
      description: 'Local meetup for Node.js backend developers to network and share ideas.',
      venue: 'TechHub Co-working Space',
      eventDate: new Date('2026-06-10T18:30:00Z'),
      totalSeats: 50,
      availableSeats: 50, // 0 seats booked
      organizerId: organizer1.id,
    },
  });

  // 4. Create Bookings
  await prisma.booking.create({
    data: {
      eventId: event1.id,
      customerId: customer1.id,
      ticketsCount: 2,
      status: 2, // BOOKED
    },
  });

  await prisma.booking.create({
    data: {
      eventId: event2.id,
      customerId: customer2.id,
      ticketsCount: 5,
      status: 2, // BOOKED
    },
  });

  // 5. Seed 50 more data entries
  console.log('Generating 50 more dummy entries...');
  const customers = [];
  for (let i = 0; i < 50; i++) {
    const cust = await prisma.user.create({
      data: {
        name: `Customer ${i + 3}`,
        email: `customer${i + 3}@example.com`,
        passwordHash,
        role: 1, // CUSTOMER
      },
    });
    customers.push(cust);

    const ev = await prisma.event.create({
      data: {
        title: `Dummy Event ${i + 4}`,
        description: `This is dynamically generated dummy event number ${i + 4}.`,
        venue: `Random Venue ${i + 4}`,
        eventDate: new Date(Date.now() + i * 86400000), // Next 50 days
        totalSeats: 100,
        availableSeats: 98,
        organizerId: organizer1.id, // Assign all dummy events to organizer 1
      },
    });

    await prisma.booking.create({
      data: {
        eventId: ev.id,
        customerId: cust.id,
        ticketsCount: 2,
        status: 2, // BOOKED
      },
    });
  }

  console.log('✅ Dummy data seeded successfully!');
  console.log('--- TEST ACCOUNTS ---');
  console.log('Organizer 1: admin@techevents.com / password123');
  console.log('Organizer 2: admin@musicfest.com / password123');
  console.log('Customer 1: alice@example.com / password123');
  console.log('Customer 2: bob@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
