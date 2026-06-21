import { MenuItem } from './types';

export const imageMap: Record<string, string> = {
  'كبدة': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60', // high-quality placeholder for meat dish
  'ممبار': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=60', // egyptian food
  'كفتة': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60', // kebab/kofta representation
  'بامية': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
  'ملوخية': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=60',
  'كوارع': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'ورق عنب': 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=60',
  'أرز بلدي شعيرية': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60',
  'أرز بسمتي': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60',
  'بطاطس': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=60',
  'فاصوليا': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
  'باذنجان': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=60',
  'باباغنوج': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=60',
  'فرخ': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=60',
  'حمام': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&auto=format&fit=crop&q=60',
  'أرنب': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'لسان': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'مخ': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'قلب': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'سجق': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'لحمة راس': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'حواوشي': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'فتة': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=60',
  'عكاوي': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'موزة ضاني': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'موزة ماعز': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'كلاوي': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'طحال': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'مخاصي': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60',
  'قشة': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=60'
};

export const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60';

export function getImageForDish(name: string): string {
  const sortedKeys = Object.keys(imageMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (name.includes(key)) {
      return imageMap[key];
    }
  }
  return defaultImage;
}

export const menuCategories = [
  { id: 'section-sandwiches', label: 'سندوتشات', icon: '🥖', desc: 'سندوتشات طازجة تُحضّر بأشهى المكونات المصرية الأصيلة' },
  { id: 'section-casseroles', label: 'طواجن لحمة', icon: '🍲', desc: 'طواجن شهية بقطع اللحم الطرية مع أجود أنواع الخضار والتوابل' },
  { id: 'section-kofta', label: 'كفتة & فراخ', icon: '🍗', desc: 'أشهى أطباق الكفتة المشوية والفراخ المحمرة بلمسة شرقية' },
  { id: 'section-offal', label: 'أطباق حواوشي', icon: '🥩', desc: 'تشكيلة غنية من أطباق الحواوشي والكوارع على الطريقة المصرية' },
  { id: 'section-soups', label: 'شوربات', icon: '🥣', desc: 'شوربات دافئة وغنية بنكهات الكوارع والعكاوي الأصيلة' },
  { id: 'section-vegetables', label: 'خضار', icon: '🥬', desc: 'تشكيلة من الخضار الطازجة المُعدّة بأسلوب تقليدي' },
  { id: 'section-rice', label: 'أرز & جوانب', icon: '🍚', desc: 'أطباق الأرز والفتة والجوانب التي تُكمل وجبتك المثالية' },
  { id: 'section-salads', label: 'سلطات & إضافات', icon: '🥗', desc: 'مقبلات منعشة ومشروبات لإكمال تجربة الطعام' }
];

export const menuItems: MenuItem[] = [
  // Sandwiches
  { id: 'sw-1', name: 'سندوتش مشكل', price: 60, category: 'section-sandwiches', description: 'سندوتش مشكل فواكه لحمة غني بالبهارات الفاخرة والخلطة السرية.', image: '' },
  { id: 'sw-2', name: 'سندوتش كبدة', price: 70, category: 'section-sandwiches', description: 'كبدة بلدي طازجة مقلية بالفلفل والثوم والليمون.', image: '' },
  { id: 'sw-3', name: 'سندوتش قلب', price: 70, category: 'section-sandwiches', description: 'قطع قلوب بلدي مطهوة بعناية لتذوب في الفم.', image: '' },
  { id: 'sw-4', name: 'سندوتش كلاوي', price: 70, category: 'section-sandwiches', description: 'سندوتش كلاوي طازجة مشوحة مع البصل والبهارات المصرية.', image: '' },
  { id: 'sw-5', name: 'سندوتش طحال', price: 60, category: 'section-sandwiches', description: 'طحال محمر بجودة مثالية وطعم غني.', image: '' },
  { id: 'sw-6', name: 'سندوتش ممبار', price: 60, category: 'section-sandwiches', description: 'أقراص وقطع ممبار محشي بالخلطة ومقلي.', image: '' },
  { id: 'sw-7', name: 'سندوتش لسان', price: 70, category: 'section-sandwiches', description: 'لسان بقري مسلوق ومقرمش ببهارات كير وتخليل.', image: '' },
  { id: 'sw-8', name: 'سندوتش لحمة راس', price: 70, category: 'section-sandwiches', description: 'لحمة راس بلدي دايبة وحرشة بطعم زمان.', image: '' },
  { id: 'sw-9', name: 'سندوتش مخ', price: 100, category: 'section-sandwiches', description: 'قطع كفتة مخ بانيه مقرمشة تذوب في الفم مع طحينة.', image: '' },
  { id: 'sw-10', name: 'سندوتش كفتة', price: 70, category: 'section-sandwiches', description: 'كفتة مشوية على الفحم مغطاة برشة بقدونس وطحينة.', image: '' },
  { id: 'sw-11', name: 'سندوتش مخاصي', price: 70, category: 'section-sandwiches', description: 'مخاصي بلدي طازجة مشوحة بالبصل والفلفل الملون.', image: '' },
  { id: 'sw-12', name: 'سندوتش سجق', price: 70, category: 'section-sandwiches', description: 'سجق شرقي متبل بالبندورة والفلفل والثوم.', image: '' },
  { id: 'sw-13', name: 'رغيف حواوشي', price: 50, category: 'section-sandwiches', description: 'رغيف بلدي محشو باللحمة المتبلة ومخبوز بالفرن.', image: '' },

  // Casseroles
  { id: 'cas-1', name: 'طاجن لحمة بالبامية', price: 270, category: 'section-casseroles', description: 'بامية ممتازة بقطع اللحم البلدي الطري في صلصة طماطم مسبكة.', image: '' },
  { id: 'cas-2', name: 'طاجن لحمة بالبصل', price: 250, category: 'section-casseroles', description: 'لحم بقري دايب مع كلوة بصل مكرمل ونكهات عريقة.', image: '' },
  { id: 'cas-3', name: 'طاجن لحمة بالبطاطس', price: 270, category: 'section-casseroles', description: 'مكعبات بطاطس طرية مع اللحم البلدي والصوص الغني.', image: '' },
  { id: 'cas-4', name: 'طاجن لحمة بالفاصوليا', price: 270, category: 'section-casseroles', description: 'فاصوليا خضراء طازجة بقطع اللحم المطبوخة بالفرن.', image: '' },
  { id: 'cas-5', name: 'طاجن عكاوي بالبصل', price: 230, category: 'section-casseroles', description: 'طاجن عكاوي بلدي مع بصل شرائح وتوابل خاصة بالفرن.', image: '' },
  { id: 'cas-6', name: 'طاجن عكاوي بالبامية', price: 250, category: 'section-casseroles', description: 'عكاوي بلدي دايبة في طاجن مع بامية وصلصة دافئة.', image: '' },
  { id: 'cas-7', name: 'موزة ضاني بالفرن', price: 350, category: 'section-casseroles', description: 'موزة ضاني بلدي تذوب في الفم تُقدم عسلية طازجة.', image: '' },
  { id: 'cas-8', name: 'موزة ماعز بلدي', price: 300, category: 'section-casseroles', description: 'موزة لحم ماعز شهية مطهوة ببطء مع البهارات.', image: '' },

  // Kofta & Chicken
  { id: 'kf-1', name: 'طبق كفتة فرن', price: 200, category: 'section-kofta', description: 'أصابع كفتة لحم بلدي مشوية بالفرن مع بطاطس وطحينة.', image: '' },
  { id: 'kf-2', name: 'طبق كفتة تحمير بالزبدة', price: 200, category: 'section-kofta', description: 'كفتة دايبة محمرة بالزبدة البلدي الفاخرة.', image: '' },
  { id: 'kf-3', name: 'ربع فرخ أرستقراطي فرن', price: 100, category: 'section-kofta', description: 'ربع فرخة متبلة بالخلطة ومحمرة في الفرن.', image: '' },
  { id: 'kf-4', name: 'ربع فرخ بلدي تحمير', price: 100, category: 'section-kofta', description: 'ربع فرخة محمرة على الطريقة المصرية العتيقة بالزيت العذب.', image: '' },
  { id: 'kf-5', name: 'حمام محشي أسطوري', price: 180, category: 'section-kofta', description: 'زوج حمام بلدي محشو بالأرز المكرمل والكبد والمكسرات والخلطة.', image: '' },
  { id: 'kf-6', name: 'طائفة نص أرنب محمر', price: 200, category: 'section-kofta', description: 'نصف أرنب بلدي محمر مقرمش يُقدم ذهبيا دافئا.', image: '' },

  // Offal Plates
  { id: 'of-1', name: 'طبق كبدة اسكندراني', price: 180, category: 'section-offal', description: 'شرائح كبدة صغيرة بخلطة الثوم والفلفل الحار والليمون والخل.', image: '' },
  { id: 'of-2', name: 'طبق كبدة بانيه مخصوص', price: 180, category: 'section-offal', description: 'شرائح كبدة متبلة بالردة ومحمرة بطبقة مقرمشة.', image: '' },
  { id: 'of-3', name: 'طبق كبدة بالردة عتيق', price: 180, category: 'section-offal', description: 'طعم الكبدة بالردة المصري الكلاسيكي مع سلطة الطحينة.', image: '' },
  { id: 'of-4', name: 'طبق كبدة بلدي تحمير', price: 180, category: 'section-offal', description: 'كبدة بلدي كاملة محمرة بالثوم والزيت الصافي.', image: '' },
  { id: 'of-5', name: 'طبق كبدة بالبصل والفلفل', price: 180, category: 'section-offal', description: 'كبدة مشوحة مع البصل المقطع وجوانح الفلفل المعطر.', image: '' },
  { id: 'of-6', name: 'طبق قلب مشكل بالثوم', price: 180, category: 'section-offal', description: 'قلب بلدي مشوح مع الثوم التازه والتتبيلة الخاصة.', image: '' },
  { id: 'of-7', name: 'طبق كلاوي مشوحة', price: 180, category: 'section-offal', description: 'كلاوي بلدي مطبوخة بعناية مع عصارة الليمون والبهار.', image: '' },
  { id: 'of-8', name: 'طبق مخ بانيه مقرمش', price: 220, category: 'section-offal', description: 'قطع مخ بقري متبلة ومحمرة بانيه تذوب في الفم غنية ولذيذة.', image: '' },
  { id: 'of-9', name: 'طبق لسان بلدي محمر', price: 220, category: 'section-offal', description: 'شرائح لسان بلدي محمرة بالزبدة مغطاة بالفلفل الأسود والملح.', image: '' },
  { id: 'of-10', name: 'طبق لحمة راس مشكل', price: 180, category: 'section-offal', description: 'تشكيلة فاخرة من لحمة الراس والحلويات واللسان والبهارات.', image: '' },
  { id: 'of-11', name: 'طبق طحال محمر عائلي', price: 150, category: 'section-offal', description: 'طحال بلدي مقطع شرائح ومحمر بالزبدة خفيف النكهة.', image: '' },
  { id: 'of-12', name: 'طبق ممبار ذهبي مقلي', price: 120, category: 'section-offal', description: 'سرفيس ممبار بلدي محشو خلطة الأرز ومقرمش في شكل حلقات.', image: '' },
  { id: 'of-13', name: 'طبق سجق شرقي حار', price: 150, category: 'section-offal', description: 'سجق بلدي مطهو بقطع الطماطم والكزبرة والفلفل الأخضر.', image: '' },
  { id: 'of-14', name: 'طبق مشكل حلويات لحوم', price: 120, category: 'section-offal', description: 'تشكيلة متكاملة من فواكه اللحمة (ممبار، طحال، كبدة، قلب).', image: '' },
  { id: 'of-15', name: 'طبق مشكل مخصوص عائلي', price: 170, category: 'section-offal', description: 'أكبر تشكيلة سرفيس فاكهة لحمة لجميع أركان اللحم البلدي.', image: '' },
  { id: 'of-16', name: 'طبق قشة بلدي', price: 120, category: 'section-offal', description: 'قشة مطبوخة بأقوى خلطة مصرية ونكهة عريقة غنية.', image: '' },
  { id: 'of-17', name: 'طبق مخاصي بلدي', price: 150, category: 'section-offal', description: 'مخاصي بلدي محمرة مع زبدة وثوم تذوب دفئاً.', image: '' },

  // Soups
  { id: 'sp-1', name: 'شوربة كوارع شهية', price: 230, category: 'section-soups', description: 'شوربة نخاع كوارع دسمة وغنية تقدم مع الليمون الطازج.', image: '' },
  { id: 'sp-2', name: 'طبق فتة كوارع بالخل والثوم', price: 270, category: 'section-soups', description: 'طوابير فتة بالخل والثوم مضافاً إليها قطع كوارع كاملة مخلية دسمة.', image: '' },
  { id: 'sp-3', name: 'ورق عنب بالكوارع بالفرن', price: 270, category: 'section-soups', description: 'طاجن رائع من ورق العنب المرصوص بمربعات الكوارع الشهية.', image: '' },
  { id: 'sp-4', name: 'فتة بالعكاوي بالفرن', price: 270, category: 'section-soups', description: 'رز و عيش محمص وسمنة بلدي بقطع العكاوي المحمرة.', image: '' },
  { id: 'sp-5', name: 'شوربة عكاوي غنية', price: 220, category: 'section-soups', description: 'مرقة عكاوي بلدي نقية ومثالية دافية بالحبهان والمستكة.', image: '' },
  { id: 'sp-6', name: 'ورق عنب بالعكاوي الطازجة', price: 270, category: 'section-soups', description: 'توليفة محشي ورق عنب ليموني بقطع العكاوي المطهوة وسط الحشوة.', image: '' },

  // Vegetables
  { id: 'vg-1', name: 'ملوخية طشة بلدي', price: 30, category: 'section-vegetables', description: 'ملوخية خضراء مخروطة طازجة بطشة الثوم والكزبرة والسمن البلدي.', image: '' },
  { id: 'vg-2', name: 'طبق بسلة بالجزر', price: 30, category: 'section-vegetables', description: 'بسلة خضراء حلوة بالجزر مطبوخة بمرقة لحمة دافية في الصلصة.', image: '' },
  { id: 'vg-3', name: 'طبق صينية بطاطس', price: 30, category: 'section-vegetables', description: 'شرائح بطاطس مفرودة ومخبوزة بصلصة الطماطم الخفيفة بالثوم وبشر بصل.', image: '' },
  { id: 'vg-4', name: 'طبق فاصوليا خضراء مسبكة', price: 30, category: 'section-vegetables', description: 'فاصوليا بلدي مطبوخة بخلطة الطماطم والبصل اللذيذ.', image: '' },

  // Rice & Sides
  { id: 'rc-1', name: 'أرز بلدي بالشعيرية والسمن', price: 40, category: 'section-rice', description: 'رز مصري ناصع البياض مفلفل بالشعيرية المحمرة الذهبية.', image: '' },
  { id: 'rc-2', name: 'أرز بسمتي أصفر مبهر', price: 50, category: 'section-rice', description: 'حبوب أرز بسمتي طويلة مبهرة برائحة الهيل والقرفة والزعفران.', image: '' },
  { id: 'rc-3', name: 'شوربة لسان عصفور فخمة', price: 30, category: 'section-rice', description: 'لسان عصفور محمر بمرقة لحمة بلدي ساخنة وليمونة.', image: '' },
  { id: 'rc-4', name: 'طبق فتة سادة عتيق', price: 60, category: 'section-rice', description: 'خبز محمص وأرز مصري بلدي مسقي بمرقة اللحم وصلصة الخل والثوم.', image: '' },

  // Salads & Extras
  { id: 'sd-1', name: 'سلطة باذنجان مقلي بالدقة', price: 10, category: 'section-salads', description: 'قطع باذنجان مقلي مغموسة بالخل والثوم والفلفل الرومي والأحمر.', image: '' },
  { id: 'sd-2', name: 'سلطة باذنجان مخلل ليموني', price: 10, category: 'section-salads', description: 'حبات باذنجان عروس مخللة ومحشوة بخلطة الثوم والكمون والليمون الحامض.', image: '' },
  { id: 'sd-3', name: 'سلطة باباغنوج بالليمون والطحينة', price: 10, category: 'section-salads', description: 'باذنجان مشوي مهروس مخلوط بالطحينة البيضاء والثوم والتحبيشة.', image: '' },
  { id: 'sd-4', name: 'سرفيس محاشي ورق عنب', price: 40, category: 'section-salads', description: 'أصابع محشي ورق عنب بلدي مرصوصة ومسقية خلطة دافية بمزازة ليمون.', image: '' },
  { id: 'sd-5', name: 'طبق محشي كوسة بلدي', price: 30, category: 'section-salads', description: 'حبات كوسة محشوة خلطة الأرز بالخضرة ومطهوة بمرقة اللحم.', image: '' },
  { id: 'sd-6', name: 'طبق محشي باذنجان مشكل', price: 30, category: 'section-salads', description: 'باذنجان أسود وأبيض محشي خلطة عريقة مسبكة بامتياز.', image: '' },
  { id: 'sd-7', name: 'طبق محشي فلفل رومي بلدي', price: 40, category: 'section-salads', description: 'قرون فلفل أخضر بارد محشوة رز حامي بالخضار والصلصة.', image: '' },
  { id: 'sd-8', name: 'مياه معدنية مثلجة', price: 15, category: 'section-salads', description: 'زجاجة مياه معدنية نقية مثلجة زنة 600 مل للترطيب.', image: '' },
  { id: 'sd-9', name: 'علبة كان بيبسي', price: 20, category: 'section-salads', description: 'مشروب غازي بيبسي منعش ومثلج يساعد على الهضم.', image: '' },
  { id: 'sd-10', name: 'علبة كان سفن اب', price: 20, category: 'section-salads', description: 'مشروب غازي سفن اب مثلج بنكهة الليمون المنعشة والسكر اللذيذ.', image: '' },
  { id: 'sd-11', name: 'علبة كان بيبسي دايت', price: 20, category: 'section-salads', description: 'علبة بيبسي دايت خالية من السعرات الحرارية ومنعشة كلياً.', image: '' }
];
