const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gearguard');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

const seedData = async () => {
    await connectDB();

    try {

        await User.deleteMany({});
        await Equipment.deleteMany({});
        await MaintenanceTeam.deleteMany({});
        await MaintenanceRequest.deleteMany({});

        console.log('Cleared existing data...');


        const teams = await MaintenanceTeam.create([
            { name: 'Electrical Team', specialization: 'ELECTRICAL', description: 'Electrical systems and wiring' },
            { name: 'Mechanical Team', specialization: 'MECHANICAL', description: 'Heavy machinery and hydraulics' },
            { name: 'IT Support', specialization: 'IT', description: 'Computers and network infrastructure' }
        ]);

        console.log(`Created ${teams.length} teams`);


        const commonPassword = await hashPassword('password123');
        
        const usersData = [
            {
                name: 'Admin User',
                email: 'admin@gearguard.com',
                password: commonPassword,
                role: 'ADMIN',
                department: 'Administration'
            },
            {
                name: 'Manager Mike',
                email: 'manager@gearguard.com',
                password: commonPassword,
                role: 'MANAGER',
                department: 'Operations'
            },
            {
                name: 'Tech Tony',
                email: 'tony@gearguard.com',
                password: commonPassword,
                role: 'TECHNICIAN',
                department: 'Maintenance',
                maintenanceTeam: teams[0]._id
            },
            {
                name: 'Tech Sarah',
                email: 'sarah@gearguard.com',
                password: commonPassword,
                role: 'TECHNICIAN',
                department: 'Maintenance',
                maintenanceTeam: teams[1]._id
            },
            {
                name: 'Tech David',
                email: 'david@gearguard.com',
                password: commonPassword,
                role: 'TECHNICIAN',
                department: 'IT',
                maintenanceTeam: teams[2]._id
            },
            {
                name: 'Employee John',
                email: 'john@gearguard.com',
                password: commonPassword,
                role: 'EMPLOYEE',
                department: 'Production'
            },
            {
                name: 'Employee Jane',
                email: 'jane@gearguard.com',
                password: commonPassword,
                role: 'EMPLOYEE',
                department: 'Logistics'
            }
        ];


        const users = await User.insertMany(usersData);
        console.log(`Created ${users.length} users`);


        const equipmentData = [
            {
                name: 'CNC Lathe X1',
                serialNumber: 'CNC-2023-001',
                category: 'MACHINERY',
                department: 'Production',
                location: 'Floor 1, Zone A',
                maintenanceTeam: teams[1]._id,
                status: 'ACTIVE',
                purchaseDate: new Date('2023-01-15'),
                warrantyExpiry: new Date('2025-01-15'),
                assignedEmployee: users[5]._id
            },
            {
                name: 'Main Conveyor Belt',
                serialNumber: 'CONV-2022-88',
                category: 'MACHINERY',
                department: 'Logistics',
                location: 'Warehouse B',
                maintenanceTeam: teams[1]._id,
                status: 'ACTIVE',
                purchaseDate: new Date('2022-05-10'),
                warrantyExpiry: new Date('2026-05-10'),
                assignedEmployee: users[6]._id
            },
            {
                name: 'Server Rack A',
                serialNumber: 'SRV-2024-05',
                category: 'COMPUTER',
                department: 'IT',
                location: 'Server Room',
                maintenanceTeam: teams[2]._id,
                status: 'ACTIVE',
                purchaseDate: new Date('2024-02-01'),
                warrantyExpiry: new Date('2027-02-01'),
                assignedEmployee: users[1]._id
            },
            {
                name: 'Generator Backup',
                serialNumber: 'GEN-2020-X',
                category: 'OTHER',
                department: 'Facilities',
                location: 'Utility Room',
                maintenanceTeam: teams[0]._id,
                status: 'ACTIVE',
                purchaseDate: new Date('2020-11-20'),
                warrantyExpiry: new Date('2025-11-20'),
                assignedEmployee: users[1]._id
            },
            {
                name: 'Forklift 05',
                serialNumber: 'FL-05-22',
                category: 'VEHICLE',
                department: 'Logistics',
                location: 'Loading Dock',
                maintenanceTeam: teams[1]._id,
                status: 'SCRAPPED',
                purchaseDate: new Date('2018-06-15'),
                warrantyExpiry: new Date('2020-06-15'),
                assignedEmployee: users[6]._id
            }
        ];

        const equipments = await Equipment.insertMany(equipmentData);
        console.log(`Created ${equipments.length} equipment items`);


        const requestsData = [
            {
                subject: 'CNC Alignment Issue',
                description: 'The CNC lathe is producing parts with 0.5mm deviation.',
                equipment: [equipments[0]._id],
                requestType: 'CORRECTIVE',
                priority: 'HIGH',
                status: 'IN_PROGRESS',
                createdBy: users[5]._id,
                maintenanceTeam: teams[1]._id,
                assignedTechnician: users[3]._id,
                createdAt: new Date('2024-12-25')
            },
            {
                subject: 'Conveyor Noise',
                description: 'Loud screeching noise from the main belt motor.',
                equipment: [equipments[1]._id],
                requestType: 'CORRECTIVE',
                priority: 'MEDIUM',
                status: 'NEW',
                createdBy: users[6]._id,
                maintenanceTeam: teams[1]._id,
                createdAt: new Date('2024-12-26')
            },
            {
                subject: 'Monthly Server Maintenance',
                description: 'Routine dust cleaning and firmware updates.',
                equipment: [equipments[2]._id],
                requestType: 'PREVENTIVE',
                priority: 'MEDIUM',
                status: 'REPAIRED',
                createdBy: users[1]._id,
                maintenanceTeam: teams[2]._id,
                assignedTechnician: users[4]._id,
                completedDate: new Date('2024-12-20'),
                scheduledDate: new Date('2024-12-19'),
                createdAt: new Date('2024-12-19')
            },
            {
                subject: 'Generator Test Failed',
                description: 'Weekly auto-test failed to start generator.',
                equipment: [equipments[3]._id],
                requestType: 'CORRECTIVE',
                priority: 'CRITICAL',
                status: 'NEW',
                createdBy: users[1]._id,
                maintenanceTeam: teams[0]._id,
                createdAt: new Date('2024-12-27')
            }
        ];

        const requests = await MaintenanceRequest.insertMany(requestsData);
        console.log(`Created ${requests.length} maintenance requests`);


        const fullDump = {
            users: await User.find({}).lean(),
            teams: await MaintenanceTeam.find({}).lean(),
            equipment: await Equipment.find({}).lean(),
            requests: await MaintenanceRequest.find({}).lean()
        };

        fs.writeFileSync(
            path.join(__dirname, '../../demo-data.json'), 
            JSON.stringify(fullDump, null, 2)
        );
        console.log('Data exported to demo-data.json');

        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
