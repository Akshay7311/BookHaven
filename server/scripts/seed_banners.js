import { sequelize, Banner } from '../models/index.js';

const seedBanners = async () => {
    try {
        await sequelize.sync();
        
        const banners = [
            {
                title: "Summer Reading Festival",
                subtitle: "Up to 50% Off Top Authors",
                image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
                link_url: "/shop?category=Fiction",
                color: "bg-blue-900",
                btnColor: "bg-blue-500 hover:bg-blue-600",
                is_system: true,
                is_active: true
            },
            {
                title: "Expand Your Tech Skills",
                subtitle: "New Programming Books Arrived",
                image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
                link_url: "/shop?category=Science",
                color: "bg-slate-900",
                btnColor: "bg-primary-500 hover:bg-primary-600",
                is_system: true,
                is_active: true
            }
        ];

        for (const bannerData of banners) {
            // Use findOrCreate to avoid duplicates if script is run multiple times
            const [banner, created] = await Banner.findOrCreate({
                where: { title: bannerData.title },
                defaults: bannerData
            });
            
            if (created) {
                console.log(`Created system banner: ${banner.title}`);
            } else {
                // Update it to ensure values are correct
                await banner.update(bannerData);
                console.log(`Updated system banner: ${banner.title}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit();
    } catch (error) {
        console.error('Error seeding banners:', error);
        process.exit(1);
    }
};

seedBanners();
