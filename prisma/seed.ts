import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HK Cafe database...");

  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.setting.deleteMany();

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.create({
    data: { email: "admin@hkcafe.com", passwordHash, name: "HK Cafe Admin" },
  });
  console.log("✅ Admin: admin@hkcafe.com / admin123");

  // Categories
  const [breakfast, lunch, dinner, drinks, desserts, snacks] = await Promise.all([
    prisma.category.create({ data: { name: "Breakfast", nameAm: "ቁርስ", slug: "breakfast", description: "Start your morning the HK way", descriptionAm: "ጠዋቱን በHK ዘዴ ይጀምሩ", sortOrder: 1 } }),
    prisma.category.create({ data: { name: "Lunch", nameAm: "ምሳ", slug: "lunch", description: "Hearty midday meals", descriptionAm: "ሙሉ የቀን ምሳ", sortOrder: 2 } }),
    prisma.category.create({ data: { name: "Dinner", nameAm: "እራት", slug: "dinner", description: "Evening comfort food", descriptionAm: "የምሽት ምግብ", sortOrder: 3 } }),
    prisma.category.create({ data: { name: "Drinks", nameAm: "መጠጦች", slug: "drinks", description: "Classic HK beverages", descriptionAm: "ክላሲካዊ HK መጠጦች", sortOrder: 4 } }),
    prisma.category.create({ data: { name: "Desserts", nameAm: "ጣፋጮች", slug: "desserts", description: "Sweet endings", descriptionAm: "ጣፋጭ መጨረሻ", sortOrder: 5 } }),
    prisma.category.create({ data: { name: "Snacks", nameAm: "መክሰስ", slug: "snacks", description: "Light bites and street food", descriptionAm: "ቀላል ምግብ", sortOrder: 6 } }),
  ]);
  console.log("✅ Categories created");

  // Breakfast
  await prisma.menuItem.createMany({ data: [
    { name: "HK French Toast", nameAm: "HK ፈረንሳይ ቶስት", description: "Thick-cut bread dipped in egg batter, deep-fried to golden perfection. Served with butter and golden syrup.", descriptionAm: "ወፍራም ዳቦ በእንቁላል ዱቄት ተዘፍቆ ወርቃማ ቀለም እስኪያገኝ ሲጠበስ። ቅቤ እና ወርቃማ ሽሮፕ ጋር ይቀርባል።", price: 52, imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Vegetarian"], sortOrder: 1, categoryId: breakfast.id },
    { name: "Pineapple Bun with Butter", nameAm: "ቦሎ ባኦ ከቅቤ ጋር", description: "Freshly baked bolo bao with a crispy sugar topping, stuffed with a thick slab of cold butter.", descriptionAm: "አዲስ የተጋገረ ቦሎ ባኦ ሸካር ጣሪያ ያለው፤ ቀዝቃዛ ቅቤ ተሞልቶ ይቀርባል።", price: 28, imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "New"], sortOrder: 2, categoryId: breakfast.id },
    { name: "Congee with Century Egg", nameAm: "ከሳምፒ እንቁላል ጋር ዙሃ", description: "Silky smooth rice porridge with century egg and salted pork.", descriptionAm: "ስስ የሩዝ ፖሪጅ ሳምፒ እንቁላልና ጨዋ ስጋ ጋር።", price: 45, imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop", isAvailable: true, tags: [], sortOrder: 3, categoryId: breakfast.id },
    { name: "Scrambled Egg on Toast", nameAm: "ጥጋ እንቁላል ከቶስት ጋር", description: "Fluffy soft-scrambled eggs on buttered toast — a classic HK cafe breakfast staple.", descriptionAm: "ለስላሳ የተቀቀለ እንቁላል ከቅቤ ቶስት ጋር።", price: 38, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian"], sortOrder: 4, categoryId: breakfast.id },
  ]});

  // Lunch
  await prisma.menuItem.createMany({ data: [
    { name: "Wonton Noodle Soup", nameAm: "ወንቶን ኑድል ሾርባ", description: "Bouncy egg noodles in a clear pork and shrimp bone broth with handmade wontons.", descriptionAm: "ትኩስ ቀስ ሽሪምፕ የተሞሉ ወንቶን ጋር ግልጽ ሾርባ።", price: 68, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 1, categoryId: lunch.id },
    { name: "Beef Brisket Noodles", nameAm: "የበሬ ብሬስኬት ኑድል", description: "Tender slow-braised beef brisket with tendon in a rich, aromatic broth.", descriptionAm: "ቀስ ብሎ የተቀቀለ ለስላሳ የበሬ ብሬስኬት ሽቱ ሾርባ ጋር።", price: 88, imageUrl: "https://images.unsplash.com/photo-1556040220-4096d522378d?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Spicy"], sortOrder: 2, categoryId: lunch.id },
    { name: "Char Siu Rice", nameAm: "ቻር ሲዩ ሩዝ", description: "Glossy, caramelized BBQ pork over steamed jasmine rice.", descriptionAm: "ካራሜላዊ ባርቤኪው ስጋ ከስቲሙ ጃስሚን ሩዝ ጋር።", price: 75, imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop", isAvailable: true, tags: [], sortOrder: 3, categoryId: lunch.id },
    { name: "Spam & Egg on Rice", nameAm: "ስፓምና እንቁላል ከሩዝ ጋር", description: "Crispy fried Spam and sunny-side up egg on steamed rice.", descriptionAm: "ጥብስ ስፓምና የወጋ እንቁላል ስቲሙ ሩዝ ጎሜ ውስጥ።", price: 58, imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 4, categoryId: lunch.id },
  ]});

  // Dinner
  await prisma.menuItem.createMany({ data: [
    { name: "Clay Pot Rice with Chinese Sausage", nameAm: "ሸክላ ድስት ሩዝ ከቻይናው ሰስጌ ጋር", description: "Fragrant rice slow-cooked in a clay pot with lap cheong, chicken, and mushrooms.", descriptionAm: "ሽቱ ሩዝ ቀስ ብሎ ሸክላ ድስት ላፕ ቼዮንግ፣ ዶሮና ፈንጉስ ጋር።", price: 98, imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 1, categoryId: dinner.id },
    { name: "Steamed Fish with Ginger & Scallion", nameAm: "ስቲሙ አሳ ዝንጅብልና ስካሊዮን ጋር", description: "Whole sea bass steamed with fresh ginger, scallions, and a sizzling soy drizzle.", descriptionAm: "ሙሉ ባስ አሳ ትኩስ ዝንጅብልና ስካሊዮን ጋር ፍጹም ስቲሙ ሆኖ።", price: 148, imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop", isAvailable: true, tags: [], sortOrder: 2, categoryId: dinner.id },
    { name: "Mapo Tofu", nameAm: "ማፖ ቶፉ", description: "Silken tofu in a bold Sichuan peppercorn and chilli bean sauce with minced pork.", descriptionAm: "ስስ ቶፉ ደፋር የሲቹዋን ፔፐር እና ቺሊ ባቄላ ሾርባ ውስጥ።", price: 88, imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop", isAvailable: false, tags: ["Spicy"], sortOrder: 3, categoryId: dinner.id },
    { name: "Stir-Fried Beef with Broccoli", nameAm: "ጥብስ ስጋ ከብሮኮሊ ጋር", description: "Tender wok-seared beef with crisp broccoli in savory oyster sauce.", descriptionAm: "ለስላሳ ዋክ ስጋ ትኩስ ብሮኮሊ ጋር ሸሎት ሾርባ ሸፍኖ።", price: 105, imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop", isAvailable: true, tags: [], sortOrder: 4, categoryId: dinner.id },
  ]});

  // Drinks
  await prisma.menuItem.createMany({ data: [
    { name: "HK Milk Tea", nameAm: "HK ወተት ሻይ", description: "Strong Ceylon black tea blended with evaporated milk for a silky, rich cup.", descriptionAm: "ጠንካራ ሴይሎን ጥቁር ሻይ ወተት ጋር ተቀልቅሎ ስስና ሃብታም ጣዕም ይሰጣል።", price: 28, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Vegetarian"], sortOrder: 1, categoryId: drinks.id },
    { name: "Lemon Tea", nameAm: "ሎሚ ሻይ", description: "Refreshing chilled black tea with fresh lemon and honey. Served over ice.", descriptionAm: "ትኩስ ቀዝቃዛ ጥቁር ሻይ ትኩስ ሎሚ እና ማር ጋር። በ얼음 ላይ ይቀርባል።", price: 25, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian", "New"], sortOrder: 2, categoryId: drinks.id },
    { name: "Yuanyang (Coffee-Tea Mix)", nameAm: "ዩዋያንያንግ (ቡና-ሻይ ድብልቅ)", description: "The quintessential HK blend of strong drip coffee and creamy milk tea.", descriptionAm: "ጠንካራ ቡናና ወተት ሻይ የHK ዋና ድብልቅ — ሁለቱም ዓለም ምርጥ።", price: 30, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 3, categoryId: drinks.id },
    { name: "Horlicks", nameAm: "ሆርሊክስ", description: "Warm malt drink with whole milk — a childhood classic.", descriptionAm: "ሙቅ ማልት መጠጥ ሙሉ ወተት ጋር — ነፍስን የሚሞቅ ልጅነት ክላሲክ።", price: 26, imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian"], sortOrder: 4, categoryId: drinks.id },
    { name: "Fresh Orange Juice", nameAm: "ትኩስ የብርቱካን ጭማቂ", description: "Freshly squeezed Valencia oranges. Pure, bright, and refreshing.", descriptionAm: "ትኩስ ቫለንሺያ ብርቱካን ጭማቂ። ንጹህ፣ ብርሃን እና አነቃቂ።", price: 35, imageUrl: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian"], sortOrder: 5, categoryId: drinks.id },
  ]});

  // Desserts
  await prisma.menuItem.createMany({ data: [
    { name: "Egg Tart", nameAm: "እንቁላል ኬክ", description: "Flaky pastry shell filled with smooth egg custard. Baked fresh daily.", descriptionAm: "ቅባታማ ቅርፊት ስስ ጣፋጭ እንቁላል ካስታርድ ተሞልቶ። ዕለት ዕለት አዲስ ይጋገራል።", price: 18, imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Vegetarian"], sortOrder: 1, categoryId: desserts.id },
    { name: "Mango Pudding", nameAm: "ማንጎ ፑዲንግ", description: "Creamy mango pudding topped with fresh mango chunks and evaporated milk.", descriptionAm: "ለስላሳ ማንጎ ፑዲንግ ትኩስ ማንጎ ቁርጥ እና ወተት ጋር።", price: 35, imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Vegetarian", "New"], sortOrder: 2, categoryId: desserts.id },
    { name: "Sesame Tangyuan", nameAm: "ሰሚ ታንግዩዋን", description: "Soft glutinous rice balls filled with black sesame paste in sweet ginger broth.", descriptionAm: "ለስላሳ የሩዝ ኳሶች ጥቁር ሰሊጥ ፔስት ተሞልቶ ጣፋጭ ዝንጅብል ሾርባ ጋር።", price: 32, imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian"], sortOrder: 3, categoryId: desserts.id },
    { name: "Tofu Pudding with Ginger Syrup", nameAm: "ቶፉ ፑዲንግ ዝንጅብል ሽሮፕ ጋር", description: "Silken tofu pudding drizzled with warm brown sugar ginger syrup.", descriptionAm: "ስስ ቶፉ ፑዲንግ ሙቅ ቡናማ ሸካር ዝንጅብል ሽሮፕ ጋር።", price: 28, imageUrl: "https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Vegetarian"], sortOrder: 4, categoryId: desserts.id },
  ]});

  // Snacks
  await prisma.menuItem.createMany({ data: [
    { name: "Curry Fish Balls", nameAm: "ካሪ ዓሳ ኳሶች", description: "Springy fish balls simmered in fragrant, mildly spicy curry sauce.", descriptionAm: "ለፍፍ ዓሳ ኳሶች ሽቱ ትንሽ ቅመም ካሪ ሾርባ ውስጥ ቀስ ብሎ ተቀቅሎ።", price: 32, imageUrl: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular", "Spicy"], sortOrder: 1, categoryId: snacks.id },
    { name: "Cheung Fun (Rice Noodle Rolls)", nameAm: "ቼዎንግ ፈን (ሩዝ ኑድል ሮልስ)", description: "Silky steamed rice noodle sheets with shrimp, sweet soy and sesame oil.", descriptionAm: "ስስ ስቲሙ ሩዝ ኑድል ሽሪምፕ ተሞልቶ ጣፋጭ ሶያ እና ሰሊጥ ዘይት ጋር።", price: 45, imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 2, categoryId: snacks.id },
    { name: "Lo Mai Gai (Sticky Rice in Lotus Leaf)", nameAm: "ሎ ማይ ጋይ (ሎተስ ቅጠል ውስጥ ሩዝ)", description: "Glutinous rice with chicken, mushrooms and sausage wrapped in lotus leaf.", descriptionAm: "ሽቱ ሩዝ ዶሮ፣ ፈንጉስ እና ሰስጌ ጋር ሎተስ ቅጠል ተጠቅሶ ስቲሙ ሆኖ።", price: 38, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop", isAvailable: true, tags: [], sortOrder: 3, categoryId: snacks.id },
    { name: "Spring Rolls", nameAm: "ስፕሪንግ ሮልስ", description: "Crispy golden rolls filled with seasoned pork, cabbage, and glass noodles.", descriptionAm: "ወርቃማ ጥብስ ሮልስ ቅቡ ስጋ፣ ጎመን እና ኑድል ተሞልቶ። ቺሊ ሾርባ ጋር።", price: 42, imageUrl: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&auto=format&fit=crop", isAvailable: true, tags: ["Popular"], sortOrder: 4, categoryId: snacks.id },
  ]});

  // Settings
  await prisma.setting.createMany({ data: [
    { key: "cafe_name", value: "HK Cafe" },
    { key: "cafe_name_am", value: "HK ካፌ" },
    { key: "cafe_tagline", value: "Authentic Hong Kong Flavours Since 1979" },
    { key: "cafe_tagline_am", value: "ከ1979 ጀምሮ ዋና የሆንግ ኮንግ ጣዕሞች" },
    { key: "cafe_description", value: "A beloved cha chaan teng serving classic Hong Kong comfort food and iconic milk teas." },
    { key: "cafe_description_am", value: "ታዋቂ ቻ ቻን ቴንግ ክላሲካዊ የሆንግ ኮንግ ምግቦችና ታዋቂ ወተት ሻይ ያቀርባል።" },
    { key: "opening_hours", value: "Mon–Fri: 7:00am – 10:00pm\nSat–Sun: 8:00am – 11:00pm" },
    { key: "phone", value: "+852 2345 6789" },
    { key: "address", value: "123 Nathan Road, Mong Kok, Hong Kong" },
    { key: "currency", value: "HKD" },
    { key: "menu_url", value: "https://YOUR-APP.vercel.app/menu" },
  ]});

  console.log("✅ All data seeded");
  console.log("🎉 Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
