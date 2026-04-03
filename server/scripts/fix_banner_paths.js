import { Banner } from '../models/index.js';
import path from 'path';

const fixBanners = async () => {
    try {
        const banners = await Banner.findAll();
        let fixCount = 0;

        for (const banner of banners) {
            // Check if image_url is a full local path (contains backslashes or starts with D:\ etc)
            if (banner.image_url && (banner.image_url.includes('\\') || banner.image_url.includes(':\\'))) {
                const filename = path.basename(banner.image_url);
                const newUrl = `/covers/${filename}`;
                
                console.log(`🔧 Fixing path for banner "${banner.title}":`);
                console.log(`   FROM: ${banner.image_url}`);
                console.log(`   TO:   ${newUrl}`);
                
                await banner.update({ image_url: newUrl });
                fixCount++;
            }
        }

        console.log(`\n✅ Successfully repaired ${fixCount} banner paths.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing banner paths:', error);
        process.exit(1);
    }
};

fixBanners();
