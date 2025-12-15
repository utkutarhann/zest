export type Language = 'tr' | 'en';

export const translations = {
    tr: {
        // Header
        'nav.home': 'Ana Sayfa',
        'nav.about': 'Hakkında',
        'nav.login': 'Giriş Yap',

        // Landing Page
        'landing.badge': 'Yapay Zeka Destekli Şefin',
        'landing.title.prefix': 'Dolabındaki Malzemelerle',
        'landing.title.suffix': 'Harikalar Yarat',
        'landing.description': 'Yapay zeka destekli şefin Zest ile tanış. Elindeki malzemeleri gir, sana özel tarifleri saniyeler içinde bulsun.',
        'landing.cta': 'Hemen Başla',
        'landing.secondaryCta': 'Nasıl Çalışır?',

        'landing.howItWorks.title': 'Nasıl Çalışır?',
        'landing.howItWorks.step1.title': 'Malzemelerini Seç',
        'landing.howItWorks.step1.desc': 'Dolabında ne varsa listeye ekle.',
        'landing.howItWorks.step2.title': 'Zestle!',
        'landing.howItWorks.step2.desc': 'Yapay zeka senin için en uygun tarifleri bulsun.',
        'landing.howItWorks.step3.title': 'Tarifini Pişir',
        'landing.howItWorks.step3.desc': 'Adım adım tariflerle lezzete ulaş.',

        'landing.features.title': 'Neler Yapabilirsin?',
        'landing.features.kitchen': 'Mutfak Modu',
        'landing.features.bar': 'Bar Modu',
        'landing.features.fit': 'Fit Modu',
        'landing.features.menu': 'Tam Menü',

        'landing.footer.copyright': '© 2025 Zest. Tüm hakları saklıdır.',

        // About Page
        'about.title': 'Zest Hakkında',
        'about.subtitle': 'Yapay zeka ile yemek pişirme deneyimini dönüştürüyoruz.',
        'about.mission.title': 'Misyonumuz',
        'about.mission.desc': 'Herkesin elindeki malzemelerle lezzetli yemekler yapmasına yardımcı olmak, gıda israfını azaltmak ve mutfakta yaratıcılığı ateşlemek.',
        'about.vision.title': 'Vizyonumuz',
        'about.vision.desc': 'Yemek yapmanın herkes için erişilebilir, eğlenceli ve sürdürülebilir olduğu bir dünya.',
        'about.values.title': 'Değerlerimiz',
        'about.values.innovation': 'İnovasyon',
        'about.values.sustainability': 'Sürdürülebilirlik',
        'about.values.creativity': 'Yaratıcılık',
        'about.team.title': 'Ekibimiz',

        // Create Menu Page
        'create.title': 'Bugün ne planlıyoruz?',
        'create.scenario.bar.title': 'Bar Modu',
        'create.scenario.bar.desc': 'Sadece içecek ve kokteyl odaklı.',
        'create.scenario.kitchen.title': 'Mutfak Modu',
        'create.scenario.kitchen.desc': 'Sadece yemek ve atıştırmalık.',
        'create.scenario.full.title': 'Tam Menü',
        'create.scenario.full.desc': 'Yemek ve yanında içecek eşleşmesi.',
        'create.scenario.fit.title': 'Fit & Sağlıklı',
        'create.scenario.fit.desc': 'Düşük kalorili, sağlıklı seçenekler.',

        'create.pantry.title': 'Kilerde neler var?',
        'create.pantry.subtitle': 'Özel bir tercihin var mı?',
        'create.generate': 'Zestle!',
        'create.results.title': 'Senin İçin Bulduklarım',
        'create.results.desc': 'Elindeki malzemelerle yapabileceğin en iyi {count} tarif.',
        'create.results.missing_none': 'Tüm Malzemeler Var!',
        'create.results.missing_some': '{count} Malzeme Eksik',
        'create.results.chef_tip': 'Şefin Tavsiyesi',
        'create.results.edit': 'Malzemeleri Düzenle',
        'recipe.back_home': 'Ana Sayfaya Dön',
        'recipe.selected_ingredients': 'Seçtiğin Malzemeler',

        // History
        'history.title': 'Aramalar',
        'history.subtitle': 'Daha önce keşfettiğin lezzetler',
        'history.24h': 'Son 24 Saat',
        'history.7d': 'Son 7 Gün',
        'history.empty': 'Bu zaman aralığında tarif bulunamadı.',

        // Pantry Selector
        'pantry.back': 'Geri Dön',
        'pantry.search.placeholder': 'Malzeme ara (örn: Domates, Tavuk...)',
        'pantry.search.no_results': 'Sonuç bulunamadı.',
        'pantry.items_count': '{count} malzeme',
        'pantry.selected_count': '{count} seçili',
        'pantry.my_pantry': 'Kilerim',
        'pantry.my_pantry.desc': 'Seçtiğin malzemeler burada listelenir.',
        'pantry.empty.title': 'Henüz malzeme yok',
        'pantry.empty.desc': 'Soldaki listeden veya aramadan malzeme ekle.',
        'pantry.clear': 'Aramayı Temizle',
        'pantry.mobile.view_list': 'Listeyi Gör',
        'pantry.mobile.selected': '{count} Malzeme Seçili',
        'pantry.custom.placeholder': 'Listede yok mu? Elle ekle...',

        // Auth
        'auth.google': 'Google ile Devam Et',
        'auth.welcome': 'Tekrar Hoşgeldin',

        // Core Features
        'vibe.title': 'Bugün modun nasıl?',
        'vibe.romantic': 'Romantik',
        'vibe.friends': 'Arkadaşlarla',
        'vibe.quick': 'Hızlı & Pratik',
        'vibe.treat': 'Kendini Şımart',
        'vibe.healthy': 'Sağlıklı',
        'vibe.comfort': 'Rahatlama',

        'pantry.title': 'Dolapta ne var?',
        'pantry.search': 'Ne var elinde?',
        'pantry.category.protein': 'Protein',
        'pantry.category.veggie': 'Sebze',
        'pantry.category.carb': 'Karbonhidrat',
        'pantry.category.drink': 'İçecek',
        'pantry.generate': 'Zestle!',

        // Limits
        'limit.title': 'Mutfak Biraz Dinleniyor 👨‍🍳',
        'limit.desc': 'Bugünlük 2 tarif hakkını doldurdun. Yarın taptaze önerilerle seni bekliyor olacağız!',
        'limit.button': 'Yarın Görüşürüz',
        'limit.display': 'Günlük Hak: {current}/{max}',

        // Cookie Consent
        'cookie.title': 'Çerezleri Kullanıyoruz',
        'cookie.desc': 'Web sitemizde, deneyiminizi iyileştirmek ve hizmetlerimizi geliştirmek için çerezler kullanıyoruz. Zorunlu çerezler her zaman aktiftir. Diğer çerezler için tercihinizi seçebilirsiniz.',
        'cookie.accept_all': 'Tümünü Kabul Et',
        'cookie.reject_all': 'Sadece Zorunlu Çerezler',
        'cookie.manage': 'Tercihleri Yönet',
        'cookie.save': 'Tercihleri Kaydet',
        'cookie.policy': 'Çerez Politikası',
        'cookie.privacy': 'Gizlilik Politikası',

        'cookie.cat.essential.title': 'Zorunlu Çerezler',
        'cookie.cat.essential.desc': 'Web sitesinin düzgün çalışması için gereklidir. Bu çerezler kapatılamaz.',
        'cookie.cat.analytics.title': 'Analitik Çerezler',
        'cookie.cat.analytics.desc': 'Site kullanımını analiz ederek performansı iyileştirmemize yardımcı olur.',
        'cookie.cat.marketing.title': 'Pazarlama Çerezleri',
        'cookie.cat.marketing.desc': 'İlgi alanlarınıza uygun içerik ve reklamlar sunmamıza yardımcı olur.',

        // Fun Facts
        'fact.tomato': 'Domatesin aslında bir meyve olduğunu biliyor muydun? 🍅',
        'fact.zest': 'Zest senin için binlerce tarifi tarıyor... 🤖',
        'fact.saffron': 'Dünyanın en pahalı baharatı safrandır. 💰',
        'fact.magic': 'Elindeki malzemelerle harikalar yaratabilirsin! ✨',
        'fact.honey': 'Bal asla bozulmayan tek yiyecektir. 🍯',
        'fact.carrot': 'Havuçlar eskiden mor renkteydi! 🥕',
        'fact.banana': 'Muzlar aslında birer bitkidir, ağaç değil. 🍌',
        'fact.avocado': 'Avokadoların teknik olarak büyük birer meyve olduğunu biliyor muydun? 🥑',
        'fact.apple': 'Elmalar suda yüzer, çünkü %25\'i havadan oluşur! 🍎',
        'fact.chocolate': 'Eskiden kakao çekirdekleri para birimi olarak kullanılırdı. 🍫',
        'fact.peanut': 'Yer fıstığı aslında fındık değil, baklagildir. 🥜',
        'fact.coffee': 'Kahve çekirdekleri aslında bir meyvenin çekirdeğidir. ☕',
        'fact.pineapple': 'Ananasın olgunlaşması 3 yıl sürebilir! 🍍',
        'fact.strawberry': 'Çilek, tohumları meyvenin dışında olan tek meyvedir. 🍓',
        'fact.cucumber': 'Salatalığın %96\'sı sudur! 🥒',
    },
    en: {
        // Header
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.login': 'Login',

        // Landing Page
        // Landing Page
        'landing.badge': 'AI Powered Chef',
        'landing.title.prefix': 'Create Wonders with',
        'landing.title.suffix': 'Ingredients You Have',
        'landing.description': 'Meet Zest, your AI-powered chef. Enter your ingredients, and find personalized recipes in seconds.',
        'landing.cta': 'Get Started',
        'landing.secondaryCta': 'How It Works?',

        'landing.howItWorks.title': 'How It Works?',
        'landing.howItWorks.step1.title': 'Choose Ingredients',
        'landing.howItWorks.step1.desc': 'Add whatever you have in your pantry.',
        'landing.howItWorks.step2.title': 'Zest It!',
        'landing.howItWorks.step2.desc': 'Let AI find the perfect recipes for you.',
        'landing.howItWorks.step3.title': 'Cook & Enjoy',
        'landing.howItWorks.step3.desc': 'Follow step-by-step instructions.',

        'landing.features.title': 'What Can You Do?',
        'landing.features.kitchen': 'Kitchen Mode',
        'landing.features.bar': 'Bar Mode',
        'landing.features.fit': 'Fit Mode',
        'landing.features.menu': 'Full Menu',

        'landing.footer.copyright': '© 2025 Zest. All rights reserved.',

        // About Page
        'about.title': 'About Zest',
        'about.subtitle': 'Revolutionizing the way you cook with AI.',
        'about.mission.title': 'Our Mission',
        'about.mission.desc': 'To help everyone cook delicious meals with what they have, reducing food waste and sparking creativity in the kitchen.',
        'about.vision.title': 'Our Vision',
        'about.vision.desc': 'A world where cooking is accessible, fun, and sustainable for everyone.',
        'about.values.title': 'Our Values',
        'about.values.innovation': 'Innovation',
        'about.values.sustainability': 'Sustainability',
        'about.values.creativity': 'Creativity',
        'about.team.title': 'Meet the Team',

        // Create Menu Page
        'create.title': 'What are we planning today?',
        'create.scenario.bar.title': 'Bar Mode',
        'create.scenario.bar.desc': 'Focus on drinks and cocktails.',
        'create.scenario.kitchen.title': 'Kitchen Mode',
        'create.scenario.kitchen.desc': 'Focus on food and snacks.',
        'create.scenario.full.title': 'Full Menu',
        'create.scenario.full.desc': 'Food with drink pairing.',
        'create.scenario.fit.title': 'Fit & Healthy',
        'create.scenario.fit.desc': 'Low calorie, healthy options.',

        'create.pantry.title': 'What\'s in your pantry?',
        'create.pantry.subtitle': 'Do you have any special preferences?',
        'create.generate': 'Zest It!',
        'create.results.title': 'Found for You',
        'create.results.desc': 'The best {count} recipes you can make with your ingredients.',
        'create.results.missing_none': 'All Ingredients Available!',
        'create.results.missing_some': '{count} Missing Ingredients',
        'create.results.chef_tip': "Chef's Tip",
        'create.results.edit': 'Edit Ingredients',
        'recipe.back_home': 'Back to Home',
        'recipe.selected_ingredients': 'Selected Ingredients',

        // History
        'history.title': 'Searches',
        'history.subtitle': 'Recipes you discovered before',
        'history.24h': 'Last 24 Hours',
        'history.7d': 'Last 7 Days',
        'history.empty': 'No recipes found in this time range.',

        // Pantry Selector
        'pantry.back': 'Back',
        'pantry.search.placeholder': 'Search ingredients (e.g. Tomato, Chicken...)',
        'pantry.search.no_results': 'No results found.',
        'pantry.items_count': '{count} items',
        'pantry.selected_count': '{count} selected',
        'pantry.my_pantry': 'My Pantry',
        'pantry.my_pantry.desc': 'Selected ingredients appear here.',
        'pantry.empty.title': 'No ingredients yet',
        'pantry.empty.desc': 'Add ingredients from the list or search.',
        'pantry.clear': 'Clear Search',
        'pantry.mobile.view_list': 'View List',
        'pantry.mobile.selected': '{count} Selected',
        'pantry.custom.placeholder': 'Not in list? Add manually...',

        // Auth
        'auth.google': 'Continue with Google',
        'auth.welcome': 'Welcome Back',

        // Core Features
        'vibe.title': 'How is your vibe today?',
        'vibe.romantic': 'Romantic',
        'vibe.friends': 'With Friends',
        'vibe.quick': 'Quick & Easy',
        'vibe.treat': 'Treat Yourself',
        'vibe.healthy': 'Healthy',
        'vibe.comfort': 'Comfort',

        'pantry.title': 'What\'s in the pantry?',
        'pantry.search': 'What do you have?',
        'pantry.category.protein': 'Protein',
        'pantry.category.veggie': 'Veggie',
        'pantry.category.carb': 'Carb',
        'pantry.category.drink': 'Drink',
        'pantry.generate': 'Zest It!',

        // Limits
        'limit.title': 'The Kitchen is Resting 👨‍🍳',
        'limit.desc': 'You have reached your daily limit of 2 recipes. We will be waiting for you tomorrow with fresh suggestions!',
        'limit.button': 'See You Tomorrow',
        'limit.display': 'Daily Limit: {current}/{max}',

        // Cookie Consent
        'cookie.title': 'We Use Cookies',
        'cookie.desc': 'We use cookies to improve your experience and enhance our services. Essential cookies are always active. You can choose your preference for other cookies.',
        'cookie.accept_all': 'Accept All',
        'cookie.reject_all': 'Essential Only',
        'cookie.manage': 'Manage Preferences',
        'cookie.save': 'Save Preferences',
        'cookie.policy': 'Cookie Policy',
        'cookie.privacy': 'Privacy Policy',

        'cookie.cat.essential.title': 'Essential Cookies',
        'cookie.cat.essential.desc': 'Necessary for the website to function properly. These cannot be disabled.',
        'cookie.cat.analytics.title': 'Analytics Cookies',
        'cookie.cat.analytics.desc': 'Help us improve performance by analyzing site usage.',
        'cookie.cat.marketing.title': 'Marketing Cookies',
        'cookie.cat.marketing.desc': 'Help us deliver content and ads relevant to your interests.',

        // Fun Facts
        'fact.tomato': 'Did you know that a tomato is actually a fruit? 🍅',
        'fact.zest': 'Zest is scanning thousands of recipes for you... 🤖',
        'fact.saffron': 'Saffron is the most expensive spice in the world. 💰',
        'fact.magic': 'You can create wonders with what you have! ✨',
        'fact.honey': 'Honey is the only food that never spoils. 🍯',
        'fact.carrot': 'Carrots used to be purple! 🥕',
        'fact.banana': 'Bananas are actually herbs, not trees. 🍌',
        'fact.avocado': 'Did you know that avocados are technically large berries? 🥑',
        'fact.apple': 'Apples float in water because they are 25% air! 🍎',
        'fact.chocolate': 'Cacao beans were once used as currency. 🍫',
        'fact.peanut': 'Peanuts are strictly legumes, not nuts. 🥜',
        'fact.coffee': 'Coffee beans are actually the pits of a fruit. ☕',
        'fact.pineapple': 'A pineapple can take up to 3 years to grow! 🍍',
        'fact.strawberry': 'Strawberries are the only fruit with seeds on the outside. 🍓',
        'fact.cucumber': 'Cucumbers are 96% water! 🥒',
    },
} as const;

export type TranslationKey = keyof typeof translations.tr;
