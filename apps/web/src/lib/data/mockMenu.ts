// ─── Mock menu data with real Unsplash images ─────────────────────────────────
export const MOCK_MENU_ITEMS = [
  // Breakfast
  { _id: 'b1', name: 'Masala Dosa', category: 'South Indian', mealType: 'breakfast', price: 79, emoji: '🥞', thumbnail: '/images/masala_dosa.png', rating: 4.8, preparationTime: 15, dietaryTags: ['veg'], description: 'Crispy golden dosa with spiced potato filling, sambar & chutneys', isFeatured: true, nutritionalInfo: { calories: 320 } },
  { _id: 'b2', name: 'Aloo Paratha', category: 'North Indian', mealType: 'breakfast', price: 69, emoji: '🫓', thumbnail: '/images/aloo_paratha.png', rating: 4.7, preparationTime: 20, dietaryTags: ['veg'], description: 'Whole wheat flatbread stuffed with spiced potatoes, served with curd & pickle', nutritionalInfo: { calories: 380 } },
  { _id: 'b3', name: 'Idli Sambar', category: 'South Indian', mealType: 'breakfast', price: 59, emoji: '🍚', thumbnail: '/images/idli_sambar.png', rating: 4.9, preparationTime: 10, dietaryTags: ['veg'], description: 'Soft steamed rice cakes with lentil soup & coconut chutney', isFeatured: true, nutritionalInfo: { calories: 280 } },
  { _id: 'b4', name: 'Poha', category: 'Snacks', mealType: 'breakfast', price: 49, emoji: '🍛', thumbnail: '/images/poha.png', rating: 4.5, preparationTime: 10, dietaryTags: ['veg'], description: 'Flattened rice with onions, peanuts & curry leaves', nutritionalInfo: { calories: 220 } },
  { _id: 'b5', name: 'Upma', category: 'South Indian', mealType: 'breakfast', price: 55, emoji: '🍲', thumbnail: '/images/upma.png', rating: 4.4, preparationTime: 12, dietaryTags: ['veg'], description: 'Semolina cooked with vegetables & tempered spices', nutritionalInfo: { calories: 250 } },
  { _id: 'b6', name: 'Bread Omelette', category: 'Continental', mealType: 'breakfast', price: 65, emoji: '🍳', thumbnail: '/images/bread_omelette.png', rating: 4.6, preparationTime: 8, dietaryTags: ['egg'], description: 'Fluffy egg omelette with toasted bread slices', nutritionalInfo: { calories: 340 } },

  // Lunch
  { _id: 'l1', name: 'Veg Thali', category: 'Thali', mealType: 'lunch', price: 149, emoji: '🍱', thumbnail: '/images/veg_thali.png', rating: 4.9, preparationTime: 25, dietaryTags: ['veg'], description: 'Dal, 2 sabzis, rice, roti, raita & dessert — a complete meal', isFeatured: true, nutritionalInfo: { calories: 650 } },
  { _id: 'l2', name: 'Chicken Biryani', category: 'Biryani', mealType: 'lunch', price: 189, emoji: '🍗', thumbnail: '/images/chicken_biryani.png', rating: 4.8, preparationTime: 30, dietaryTags: ['non-veg'], description: 'Fragrant basmati rice cooked with tender chicken & whole spices', isFeatured: true, nutritionalInfo: { calories: 720 } },
  { _id: 'l3', name: 'Rajma Chawal', category: 'North Indian', mealType: 'lunch', price: 119, emoji: '🫘', thumbnail: '/images/rajma_chawal.png', rating: 4.7, preparationTime: 20, dietaryTags: ['veg'], description: 'Slow-cooked kidney beans curry with steamed basmati rice', nutritionalInfo: { calories: 560 } },
  { _id: 'l4', name: 'Paneer Butter Masala', category: 'North Indian', mealType: 'lunch', price: 159, emoji: '🧀', thumbnail: '/images/paneer_butter_masala.png', rating: 4.8, preparationTime: 25, dietaryTags: ['veg'], description: 'Rich tomato-cream gravy with cottage cheese cubes & 3 rotis', nutritionalInfo: { calories: 610 } },
  { _id: 'l5', name: 'Mutton Curry + Rice', category: 'Non-Veg Curry', mealType: 'lunch', price: 219, emoji: '🥩', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Bengali_Mutton_Curry.JPG/960px-Bengali_Mutton_Curry.JPG', rating: 4.7, preparationTime: 35, dietaryTags: ['non-veg'], description: 'Slow-cooked mutton in aromatic spices with steamed rice', nutritionalInfo: { calories: 780 } },
  { _id: 'l6', name: 'Chole Bhature', category: 'North Indian', mealType: 'lunch', price: 99, emoji: '🥙', thumbnail: '/images/chole_bhature.png', rating: 4.6, preparationTime: 20, dietaryTags: ['veg'], description: 'Spicy chickpea curry with 2 fluffy deep-fried breads', nutritionalInfo: { calories: 680 } },
  { _id: 'l7', name: 'Fish Curry + Rice', category: 'Coastal', mealType: 'lunch', price: 199, emoji: '🐟', thumbnail: '/images/fish_curry.png', rating: 4.7, preparationTime: 25, dietaryTags: ['non-veg'], description: 'Coastal-style tangy fish curry with steamed rice', nutritionalInfo: { calories: 590 } },
  { _id: 'l8', name: 'Dal Makhani + Naan', category: 'North Indian', mealType: 'lunch', price: 139, emoji: '🍲', thumbnail: '/images/dal_makhani.png', rating: 4.8, preparationTime: 20, dietaryTags: ['veg'], description: 'Creamy black lentils slow-cooked overnight with butter naan', nutritionalInfo: { calories: 620 } },

  // Dinner
  { _id: 'd1', name: 'Butter Chicken + Naan', category: 'North Indian', mealType: 'dinner', price: 199, emoji: '🍗', thumbnail: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80', rating: 4.9, preparationTime: 25, dietaryTags: ['non-veg'], description: 'Tender chicken in velvety tomato-butter sauce with garlic naan', isFeatured: true, nutritionalInfo: { calories: 690 } },
  { _id: 'd2', name: 'Veg Biryani', category: 'Biryani', mealType: 'dinner', price: 149, emoji: '🍚', thumbnail: '/images/veg_biryani_new.jpg', rating: 4.6, preparationTime: 25, dietaryTags: ['veg'], description: 'Aromatic basmati rice layered with seasonal vegetables & saffron', nutritionalInfo: { calories: 520 } },
  { _id: 'd3', name: 'Kadai Paneer + Roti', category: 'North Indian', mealType: 'dinner', price: 169, emoji: '🧀', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kadai_Paneer-Delhi-12.jpg', rating: 4.7, preparationTime: 20, dietaryTags: ['veg'], description: 'Paneer cooked in iron wok with bell peppers & freshly ground spices', nutritionalInfo: { calories: 580 } },
  { _id: 'd4', name: 'Egg Curry + Rice', category: 'Egg', mealType: 'dinner', price: 129, emoji: '🥚', thumbnail: '/images/egg_curry_new.jpg', rating: 4.5, preparationTime: 20, dietaryTags: ['egg'], description: 'Boiled eggs in rich onion-tomato masala with steamed rice', nutritionalInfo: { calories: 480 } },
  { _id: 'd5', name: 'Palak Paneer + Roti', category: 'North Indian', mealType: 'dinner', price: 155, emoji: '🌿', thumbnail: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', rating: 4.7, preparationTime: 20, dietaryTags: ['veg'], description: 'Cottage cheese in silky spinach gravy with 3 whole wheat rotis', nutritionalInfo: { calories: 540 } },
  { _id: 'd6', name: 'Chicken Tikka Masala', category: 'North Indian', mealType: 'dinner', price: 209, emoji: '🍛', thumbnail: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', rating: 4.8, preparationTime: 25, dietaryTags: ['non-veg'], description: 'Grilled chicken tikka in smoky masala sauce with garlic naan', isFeatured: true, nutritionalInfo: { calories: 660 } },

  // Snacks & Beverages
  { _id: 's1', name: 'Samosa (2 pcs)', category: 'Snacks', mealType: 'snack', price: 30, emoji: '🥟', thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', rating: 4.6, preparationTime: 5, dietaryTags: ['veg'], description: 'Crispy pastry with spiced potato-pea filling & chutneys', nutritionalInfo: { calories: 220 } },
  { _id: 's2', name: 'Vada Pav', category: 'Snacks', mealType: 'snack', price: 35, emoji: '🍔', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.JPG/960px-Vada_Pav-Indian_street_food.JPG', rating: 4.7, preparationTime: 5, dietaryTags: ['veg'], description: 'Mumbai street-style spiced potato fritter in a soft bun', nutritionalInfo: { calories: 280 } },
  { _id: 's3', name: 'Mango Lassi', category: 'Beverages', mealType: 'beverage', price: 59, emoji: '🥭', thumbnail: '/images/mango_lassi_new.jpg', rating: 4.8, preparationTime: 5, dietaryTags: ['veg'], description: 'Thick chilled yogurt blended with sweet Alphonso mangoes', nutritionalInfo: { calories: 180 } },
  { _id: 's4', name: 'Masala Chai', category: 'Beverages', mealType: 'beverage', price: 25, emoji: '☕', thumbnail: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=80', rating: 4.9, preparationTime: 5, dietaryTags: ['veg'], description: 'Spiced Indian tea brewed with ginger, cardamom & fresh milk', nutritionalInfo: { calories: 90 } },
  { _id: 's5', name: 'Gulab Jamun (2 pcs)', category: 'Dessert', mealType: 'dessert', price: 45, emoji: '🟤', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Gulab-jamun-wallpaper-1.jpg', rating: 4.7, preparationTime: 5, dietaryTags: ['veg'], description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', nutritionalInfo: { calories: 320 } },
  { _id: 's6', name: 'Kheer', category: 'Dessert', mealType: 'dessert', price: 55, emoji: '🍮', thumbnail: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', rating: 4.6, preparationTime: 5, dietaryTags: ['veg'], description: 'Creamy rice pudding with cardamom, saffron & dry fruits', nutritionalInfo: { calories: 260 } },
];

export const ALL_CATEGORIES = [...new Set(MOCK_MENU_ITEMS.map(i => i.category))];
export const MEAL_TYPE_TABS = [
  { value: '', label: '🍽️ All' },
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch', label: '☀️ Lunch' },
  { value: 'dinner', label: '🌙 Dinner' },
  { value: 'snack', label: '🥟 Snacks' },
  { value: 'beverage', label: '🥤 Beverages' },
  { value: 'dessert', label: '🍮 Desserts' },
];
export const SORT_OPTIONS = [
  { value: '-rating', label: 'Top Rated' },
  { value: '-orderCount', label: 'Most Popular' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];
export const DIETARY_TAGS = ['veg', 'non-veg', 'egg'];
