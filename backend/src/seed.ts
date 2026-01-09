import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding de la base de données...\n');

    try {
        // Utilisation d'une transaction pour garantir la cohérence
        await prisma.$transaction(async (tx) => {
            console.log('🧹 Nettoyage complet de la base de données...');

            // Ordre important : supprimer les tables enfants avant les parents
            await tx.invoice.deleteMany({});
            await tx.paymentMethod.deleteMany({});
            await tx.teamMember.deleteMany({});
            await tx.billing.deleteMany({});
            await tx.database.deleteMany({});
            await tx.domain.deleteMany({});
            await tx.droplet.deleteMany({});
            await tx.team.deleteMany({});
            await tx.vendor.deleteMany({});
            await tx.user.deleteMany(); // Doit être après teamMember
            // Note : user doit être supprimé après tout ce qui a une relation avec lui

            console.log('✓ Base de données nettoyée\n');

            // === Création des utilisateurs ===
            console.log('👤 Création des utilisateurs de test...');
            const passwordHash = await bcrypt.hash('password123', 10);

            const users = await Promise.all([
                tx.user.create({
                    data: {
                        email: 'alice@example.com',
                        passwordHash,
                        name: 'Alice Johnson',
                    },
                }),
                tx.user.create({
                    data: {
                        email: 'bob@example.com',
                        passwordHash,
                        name: 'Bob Smith',
                    },
                }),
                tx.user.create({
                    data: {
                        email: 'charlie@example.com',
                        passwordHash,
                        name: 'Charlie Brown',
                    },
                }),
            ]);

            const [alice, bob, charlie] = users;
            console.log(`✓ Utilisateurs créés : ${users.map(u => u.name).join(', ')}\n`);

            // === Facturation (Billing) ===
            console.log('💳 Création des abonnements...');
            await Promise.all([
                tx.billing.create({
                    data: { userId: alice.id, plan: 'pro', status: 'active' },
                }),
                tx.billing.create({
                    data: { userId: bob.id, plan: 'free', status: 'active' },
                }),
                tx.billing.create({
                    data: { userId: charlie.id, plan: 'enterprise', status: 'active' },
                }),
            ]);
            console.log('✓ Abonnements configurés\n');

            // === Équipe ===
            console.log('👥 Création d\'une équipe...');
            const team = await tx.team.create({
                data: {
                    name: 'Acme Corp',
                    members: {
                        create: [
                            { userId: alice.id, role: 'owner' },
                            { userId: bob.id, role: 'admin' },
                            { userId: charlie.id, role: 'member' },
                        ],
                    },
                },
            });
            console.log(`✓ Équipe créée : ${team.name}\n`);

            // === Droplets ===
            console.log('☁️ Création des droplets (serveurs virtuels)...');
            const droplets = await Promise.all([
                tx.droplet.create({
                    data: {
                        name: 'web-server-01',
                        region: 'nyc3',
                        size: 's-2vcpu-4gb',
                        status: 'active',
                        ipAddress: '104.131.45.120',
                        userId: alice.id,
                        teamId: team.id,
                    },
                }),
                tx.droplet.create({
                    data: {
                        name: 'api-server-01',
                        region: 'sfo3',
                        size: 's-4vcpu-8gb',
                        status: 'active',
                        ipAddress: '167.99.12.85',
                        userId: alice.id,
                        teamId: team.id,
                    },
                }),
                tx.droplet.create({
                    data: {
                        name: 'db-server-01',
                        region: 'ams3',
                        size: 's-8vcpu-16gb',
                        status: 'active',
                        ipAddress: '188.166.42.31',
                        userId: bob.id,
                        teamId: team.id,
                    },
                }),
            ]);
            console.log(`✓ ${droplets.length} droplets créés\n`);

            // === Domaines ===
            console.log('🌐 Création des domaines...');
            const domains = await Promise.all([
                tx.domain.create({
                    data: { name: 'acme-corp.com', status: 'active', userId: alice.id },
                }),
                tx.domain.create({
                    data: { name: 'api.acme-corp.com', status: 'active', userId: alice.id },
                }),
                tx.domain.create({
                    data: { name: 'staging.acme-corp.com', status: 'pending', userId: bob.id },
                }),
            ]);
            console.log(`✓ ${domains.length} domaines créés\n`);

            // === Bases de données ===
            console.log('🗄️ Création des bases de données managées...');
            const databases = await Promise.all([
                tx.database.create({
                    data: {
                        name: 'production-db',
                        engine: 'postgres',
                        version: '15',
                        status: 'active',
                        connectionString: 'postgresql://prod_user:securepass@db-prod.internal:5432/production',
                        userId: alice.id,
                    },
                }),
                tx.database.create({
                    data: {
                        name: 'staging-db',
                        engine: 'postgres',
                        version: '15',
                        status: 'active',
                        connectionString: 'postgresql://staging_user:pass@db-staging.internal:5432/staging',
                        userId: alice.id,
                    },
                }),
                tx.database.create({
                    data: {
                        name: 'redis-cache',
                        engine: 'redis',
                        version: '7',
                        status: 'active',
                        connectionString: 'redis://:secret@redis-cache.internal:6379/0',
                        userId: bob.id,
                    },
                }),
                tx.database.create({
                    data: {
                        name: 'analytics-db',
                        engine: 'mysql',
                        version: '8.0',
                        status: 'creating',
                        connectionString: 'mysql://analytics:pass@analytics-db.internal:3306/analytics',
                        userId: charlie.id,
                    },
                }),
            ]);
            console.log(`✓ ${databases.length} bases de données créées\n`);

            // === Vendors (Marketplace) ===
            console.log('🏪 Création des vendors pour la marketplace...');
            const vendors = await Promise.all([
                tx.vendor.create({
                    data: {
                        name: 'Nike Official',
                        storeSlug: 'nike-official',
                        themeJson: JSON.stringify({
                            primaryColor: '#111111',
                            secondaryColor: '#FFFFFF',
                            accentColor: '#F24C00',
                            logoUrl: '/vendors/nike-logo.png',
                        }),
                    },
                }),
                tx.vendor.create({
                    data: {
                        name: 'Adidas Store',
                        storeSlug: 'adidas-store',
                        themeJson: JSON.stringify({
                            primaryColor: '#000000',
                            secondaryColor: '#FFFFFF',
                            accentColor: '#00A650',
                        }),
                    },
                }),
                tx.vendor.create({
                    data: {
                        name: 'Puma Shop',
                        storeSlug: 'puma-shop',
                        themeJson: JSON.stringify({
                            primaryColor: '#1E252F',
                            secondaryColor: '#FFFFFF',
                            accentColor: '#D81E05',
                        }),
                    },
                }),
            ]);
            console.log(`✓ ${vendors.length} vendors créés\n`);
        });

        // === Résumé final ===
        console.log('✨ Seeding terminé avec succès !\n');
        console.log('📊 Résumé des données créées :');
        console.log('   • 3 utilisateurs');
        console.log('   • 1 équipe avec 3 membres');
        console.log('   • 3 droplets');
        console.log('   • 3 domaines');
        console.log('   • 4 bases de données');
        console.log('   • 3 vendors\n');

        console.log('🔐 Comptes de test (mot de passe commun : password123) :');
        console.log('   • alice@example.com    → Plan Pro');
        console.log('   • bob@example.com      → Plan Free');
        console.log('   • charlie@example.com  → Plan Enterprise\n');

        console.log('🚀 Tu peux maintenant lancer l\'application et te connecter !');

    } catch (error) {
        console.error('❌ Erreur fatale lors du seeding :');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
