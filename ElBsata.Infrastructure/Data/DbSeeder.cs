using ElBsata.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ElBsata.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<AppUser>? userManager = null)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.MenuCategories.AnyAsync())
        {
            context.MenuCategories.AddRange(new List<MenuCategory>
            {
                new() { Id = "section-sandwiches", Label = "سندوتشات", Icon = "🥖", Desc = "سندوتشات طازجة تُحضّر بأشهى المكونات المصرية الأصيلة" },
                new() { Id = "section-casseroles", Label = "طواجن لحمة", Icon = "🍲", Desc = "طواجن شهية بقطع اللحم الطرية مع أجود أنواع الخضار والتوابل" },
                new() { Id = "section-kofta", Label = "كفتة & فراخ", Icon = "🍗", Desc = "أشهى أطباق الكفتة المشوية والفراخ المحمرة بلمسة شرقية" },
                new() { Id = "section-offal", Label = "أطباق حواوشي", Icon = "🥩", Desc = "تشكيلة غنية من أطباق الحواوشي والكوارع على الطريقة المصرية" },
                new() { Id = "section-soups", Label = "شوربات", Icon = "🥣", Desc = "شوربات دافئة وغنية بنكهات الكوارع والعكاوي الأصيلة" },
                new() { Id = "section-vegetables", Label = "خضار", Icon = "🥬", Desc = "تشكيلة من الخضار الطازجة المُعدّة بأسلوب تقليدي" },
                new() { Id = "section-rice", Label = "أرز & جوانب", Icon = "🍚", Desc = "أطباق الأرز والفتة والجوانب التي تُكمل وجبتك المثالية" },
                new() { Id = "section-salads", Label = "سلطات & إضافات", Icon = "🥗", Desc = "مقبلات منعشة ومشروبات لإكمال تجربة الطعام" }
            });
        }

        if (!await context.MenuItems.AnyAsync())
        {
            var items = new List<MenuItem>
            {
                new() { Id = "sw-1", Name = "سندوتش مشكل", Price = 60, Category = "section-sandwiches", Description = "سندوتش مشكل فواكه لحمة غني بالبهارات الفاخرة والخلطة السرية." },
                new() { Id = "sw-2", Name = "سندوتش كبدة", Price = 70, Category = "section-sandwiches", Description = "كبدة بلدي طازجة مقلية بالفلفل والثوم والليمون." },
                new() { Id = "sw-3", Name = "سندوتش قلب", Price = 70, Category = "section-sandwiches", Description = "قطع قلوب بلدي مطهوة بعناية لتذوب في الفم." },
                new() { Id = "sw-4", Name = "سندوتش كلاوي", Price = 70, Category = "section-sandwiches", Description = "سندوتش كلاوي طازجة مشوحة مع البصل والبهارات المصرية." },
                new() { Id = "sw-5", Name = "سندوتش طحال", Price = 60, Category = "section-sandwiches", Description = "طحال محمر بجودة مثالية وطعم غني." },
                new() { Id = "sw-6", Name = "سندوتش ممبار", Price = 60, Category = "section-sandwiches", Description = "أقراص وقطع ممبار محشي بالخلطة ومقلي." },
                new() { Id = "sw-7", Name = "سندوتش لسان", Price = 70, Category = "section-sandwiches", Description = "لسان بقري مسلوق ومقرمش ببهارات كير وتخليل." },
                new() { Id = "sw-8", Name = "سندوتش لحمة راس", Price = 70, Category = "section-sandwiches", Description = "لحمة راس بلدي دايبة وحرشة بطعم زمان." },
                new() { Id = "sw-9", Name = "سندوتش مخ", Price = 100, Category = "section-sandwiches", Description = "قطع كفتة مخ بانيه مقرمشة تذوب في الفم مع طحينة." },
                new() { Id = "sw-10", Name = "سندوتش كفتة", Price = 70, Category = "section-sandwiches", Description = "كفتة مشوية على الفحم مغطاة برشة بقدونس وطحينة." },
                new() { Id = "sw-11", Name = "سندوتش مخاصي", Price = 70, Category = "section-sandwiches", Description = "مخاصي بلدي طازجة مشوحة بالبصل والفلفل الملون." },
                new() { Id = "sw-12", Name = "سندوتش سجق", Price = 70, Category = "section-sandwiches", Description = "سجق شرقي متبل بالبندورة والفلفل والثوم." },
                new() { Id = "sw-13", Name = "رغيف حواوشي", Price = 50, Category = "section-sandwiches", Description = "رغيف بلدي محشو باللحمة المتبلة ومخبوز بالفرن." },
                new() { Id = "cas-1", Name = "طاجن لحمة بالبامية", Price = 270, Category = "section-casseroles", Description = "بامية ممتازة بقطع اللحم البلدي الطري في صلصة طماطم مسبكة." },
                new() { Id = "cas-2", Name = "طاجن لحمة بالبصل", Price = 250, Category = "section-casseroles", Description = "لحم بقري دايب مع كلوة بصل مكرمل ونكهات عريقة." },
                new() { Id = "cas-3", Name = "طاجن لحمة بالبطاطس", Price = 270, Category = "section-casseroles", Description = "مكعبات بطاطس طرية مع اللحم البلدي والصوص الغني." },
                new() { Id = "cas-4", Name = "طاجن لحمة بالفاصوليا", Price = 270, Category = "section-casseroles", Description = "فاصوليا خضراء طازجة بقطع اللحم المطبوخة بالفرن." },
                new() { Id = "cas-5", Name = "طاجن عكاوي بالبصل", Price = 230, Category = "section-casseroles", Description = "طاجن عكاوي بلدي مع بصل شرائح وتوابل خاصة بالفرن." },
                new() { Id = "cas-6", Name = "طاجن عكاوي بالبامية", Price = 250, Category = "section-casseroles", Description = "عكاوي بلدي دايبة في طاجن مع بامية وصلصة دافئة." },
                new() { Id = "cas-7", Name = "موزة ضاني بالفرن", Price = 350, Category = "section-casseroles", Description = "موزة ضاني بلدي تذوب في الفم تُقدم عسلية طازجة." },
                new() { Id = "cas-8", Name = "موزة ماعز بلدي", Price = 300, Category = "section-casseroles", Description = "موزة لحم ماعز شهية مطهوة ببطء مع البهارات." },
                new() { Id = "kf-1", Name = "طبق كفتة فرن", Price = 200, Category = "section-kofta", Description = "أصابع كفتة لحم بلدي مشوية بالفرن مع بطاطس وطحينة." },
                new() { Id = "kf-2", Name = "طبق كفتة تحمير بالزبدة", Price = 200, Category = "section-kofta", Description = "كفتة دايبة محمرة بالزبدة البلدي الفاخرة." },
                new() { Id = "kf-3", Name = "ربع فرخ أرستقراطي فرن", Price = 100, Category = "section-kofta", Description = "ربع فرخة متبلة بالخلطة ومحمرة في الفرن." },
                new() { Id = "kf-4", Name = "ربع فرخ بلدي تحمير", Price = 100, Category = "section-kofta", Description = "ربع فرخة محمرة على الطريقة المصرية العتيقة بالزيت العذب." },
                new() { Id = "kf-5", Name = "حمام محشي أسطوري", Price = 180, Category = "section-kofta", Description = "زوج حمام بلدي محشو بالأرز المكرمل والكبد والمكسرات والخلطة." },
                new() { Id = "kf-6", Name = "طائفة نص أرنب محمر", Price = 200, Category = "section-kofta", Description = "نصف أرنب بلدي محمر مقرمش يُقدم ذهبيا دافئا." },
                new() { Id = "of-1", Name = "طبق كبدة اسكندراني", Price = 180, Category = "section-offal", Description = "شرائح كبدة صغيرة بخلطة الثوم والفلفل الحار والليمون والخل." },
                new() { Id = "of-2", Name = "طبق كبدة بانيه مخصوص", Price = 180, Category = "section-offal", Description = "شرائح كبدة متبلة بالردة ومحمرة بطبقة مقرمشة." },
                new() { Id = "of-3", Name = "طبق كبدة بالردة عتيق", Price = 180, Category = "section-offal", Description = "طعم الكبدة بالردة المصري الكلاسيكي مع سلطة الطحينة." },
                new() { Id = "of-4", Name = "طبق كبدة بلدي تحمير", Price = 180, Category = "section-offal", Description = "كبدة بلدي كاملة محمرة بالثوم والزيت الصافي." },
                new() { Id = "of-5", Name = "طبق كبدة بالبصل والفلفل", Price = 180, Category = "section-offal", Description = "كبدة مشوحة مع البصل المقطع وجوانح الفلفل المعطر." },
                new() { Id = "of-6", Name = "طبق قلب مشكل بالثوم", Price = 180, Category = "section-offal", Description = "قلب بلدي مشوح مع الثوم التازه والتتبيلة الخاصة." },
                new() { Id = "of-7", Name = "طبق كلاوي مشوحة", Price = 180, Category = "section-offal", Description = "كلاوي بلدي مطبوخة بعناية مع عصارة الليمون والبهار." },
                new() { Id = "of-8", Name = "طبق مخ بانيه مقرمش", Price = 220, Category = "section-offal", Description = "قطع مخ بقري متبلة ومحمرة بانيه تذوب في الفم غنية ولذيذة." },
                new() { Id = "of-9", Name = "طبق لسان بلدي محمر", Price = 220, Category = "section-offal", Description = "شرائح لسان بلدي محمرة بالزبدة مغطاة بالفلفل الأسود والملح." },
                new() { Id = "of-10", Name = "طبق لحمة راس مشكل", Price = 180, Category = "section-offal", Description = "تشكيلة فاخرة من لحمة الراس والحلويات واللسان والبهارات." },
                new() { Id = "of-11", Name = "طبق طحال محمر عائلي", Price = 150, Category = "section-offal", Description = "طحال بلدي مقطع شرائح ومحمر بالزبدة خفيف النكهة." },
                new() { Id = "of-12", Name = "طبق ممبار ذهبي مقلي", Price = 120, Category = "section-offal", Description = "سرفيس ممبار بلدي محشو خلطة الأرز ومقرمش في شكل حلقات." },
                new() { Id = "of-13", Name = "طبق سجق شرقي حار", Price = 150, Category = "section-offal", Description = "سجق بلدي مطهو بقطع الطماطم والكزبرة والفلفل الأخضر." },
                new() { Id = "of-14", Name = "طبق مشكل حلويات لحوم", Price = 120, Category = "section-offal", Description = "تشكيلة متكاملة من فواكه اللحمة (ممبار، طحال، كبدة، قلب)." },
                new() { Id = "of-15", Name = "طبق مشكل مخصوص عائلي", Price = 170, Category = "section-offal", Description = "أكبر تشكيلة سرفيس فاكهة لحمة لجميع أركان اللحم البلدي." },
                new() { Id = "of-16", Name = "طبق قشة بلدي", Price = 120, Category = "section-offal", Description = "قشة مطبوخة بأقوى خلطة مصرية ونكهة عريقة غنية." },
                new() { Id = "of-17", Name = "طبق مخاصي بلدي", Price = 150, Category = "section-offal", Description = "مخاصي بلدي محمرة مع زبدة وثوم تذوب دفئاً." },
                new() { Id = "sp-1", Name = "شوربة كوارع شهية", Price = 230, Category = "section-soups", Description = "شوربة نخاع كوارع دسمة وغنية تقدم مع الليمون الطازج." },
                new() { Id = "sp-2", Name = "طبق فتة كوارع بالخل والثوم", Price = 270, Category = "section-soups", Description = "طوابير فتة بالخل والثوم مضافاً إليها قطع كوارع كاملة مخلية دسمة." },
                new() { Id = "sp-3", Name = "ورق عنب بالكوارع بالفرن", Price = 270, Category = "section-soups", Description = "طاجن رائع من ورق العنب المرصوص بمربعات الكوارع الشهية." },
                new() { Id = "sp-4", Name = "فتة بالعكاوي بالفرن", Price = 270, Category = "section-soups", Description = "رز و عيش محمص وسمنة بلدي بقطع العكاوي المحمرة." },
                new() { Id = "sp-5", Name = "شوربة عكاوي غنية", Price = 220, Category = "section-soups", Description = "مرقة عكاوي بلدي نقية ومثالية دافية بالحبهان والمستكة." },
                new() { Id = "sp-6", Name = "ورق عنب بالعكاوي الطازجة", Price = 270, Category = "section-soups", Description = "توليفة محشي ورق عنب ليموني بقطع العكاوي المطهوة وسط الحشوة." },
                new() { Id = "vg-1", Name = "ملوخية طشة بلدي", Price = 30, Category = "section-vegetables", Description = "ملوخية خضراء مخروطة طازجة بطشة الثوم والكزبرة والسمن البلدي." },
                new() { Id = "vg-2", Name = "طبق بسلة بالجزر", Price = 30, Category = "section-vegetables", Description = "بسلة خضراء حلوة بالجزر مطبوخة بمرقة لحمة دافية في الصلصة." },
                new() { Id = "vg-3", Name = "طبق صينية بطاطس", Price = 30, Category = "section-vegetables", Description = "شرائح بطاطس مفرودة ومخبوزة بصلصة الطماطم الخفيفة بالثوم وبشر بصل." },
                new() { Id = "vg-4", Name = "طبق فاصوليا خضراء مسبكة", Price = 30, Category = "section-vegetables", Description = "فاصوليا بلدي مطبوخة بخلطة الطماطم والبصل اللذيذ." },
                new() { Id = "rc-1", Name = "أرز بلدي بالشعيرية والسمن", Price = 40, Category = "section-rice", Description = "رز مصري ناصع البياض مفلفل بالشعيرية المحمرة الذهبية." },
                new() { Id = "rc-2", Name = "أرز بسمتي أصفر مبهر", Price = 50, Category = "section-rice", Description = "حبوب أرز بسمتي طويلة مبهرة برائحة الهيل والقرفة والزعفران." },
                new() { Id = "rc-3", Name = "شوربة لسان عصفور فخمة", Price = 30, Category = "section-rice", Description = "لسان عصفور محمر بمرقة لحمة بلدي ساخنة وليمونة." },
                new() { Id = "rc-4", Name = "طبق فتة سادة عتيق", Price = 60, Category = "section-rice", Description = "خبز محمص وأرز مصري بلدي مسقي بمرقة اللحم وصلصة الخل والثوم." },
                new() { Id = "sd-1", Name = "سلطة باذنجان مقلي بالدقة", Price = 10, Category = "section-salads", Description = "قطع باذنجان مقلي مغموسة بالخل والثوم والفلفل الرومي والأحمر." },
                new() { Id = "sd-2", Name = "سلطة باذنجان مخلل ليموني", Price = 10, Category = "section-salads", Description = "حبات باذنجان عروس مخللة ومحشوة بخلطة الثوم والكمون والليمون الحامض." },
                new() { Id = "sd-3", Name = "سلطة باباغنوج بالليمون والطحينة", Price = 10, Category = "section-salads", Description = "باذنجان مشوي مهروس مخلوط بالطحينة البيضاء والثوم والتحبيشة." },
                new() { Id = "sd-4", Name = "سرفيس محاشي ورق عنب", Price = 40, Category = "section-salads", Description = "أصابع محشي ورق عنب بلدي مرصوصة ومسقية خلطة دافية بمزازة ليمون." },
                new() { Id = "sd-5", Name = "طبق محشي كوسة بلدي", Price = 30, Category = "section-salads", Description = "حبات كوسة محشوة خلطة الأرز بالخضرة ومطهوة بمرقة اللحم." },
                new() { Id = "sd-6", Name = "طبق محشي باذنجان مشكل", Price = 30, Category = "section-salads", Description = "باذنجان أسود وأبيض محشي خلطة عريقة مسبكة بامتياز." },
                new() { Id = "sd-7", Name = "طبق محشي فلفل رومي بلدي", Price = 40, Category = "section-salads", Description = "قرون فلفل أخضر بارد محشوة رز حامي بالخضار والصلصة." },
                new() { Id = "sd-8", Name = "مياه معدنية مثلجة", Price = 15, Category = "section-salads", Description = "زجاجة مياه معدنية نقية مثلجة زنة 600 مل للترطيب." },
                new() { Id = "sd-9", Name = "علبة كان بيبسي", Price = 20, Category = "section-salads", Description = "مشروب غازي بيبسي منعش ومثلج يساعد على الهضم." },
                new() { Id = "sd-10", Name = "علبة كان سفن اب", Price = 20, Category = "section-salads", Description = "مشروب غازي سفن اب مثلج بنكهة الليمون المنعشة والسكر اللذيذ." },
                new() { Id = "sd-11", Name = "علبة كان بيبسي دايت", Price = 20, Category = "section-salads", Description = "علبة بيبسي دايت خالية من السعرات الحرارية ومنعشة كلياً." }
            };
           
            var imageFiles = new[] { "1504674900.jpg","1512058564.jpg","1516685018.jpg","1541532713.jpg","1544025162.jpg","1546069901.jpg","1547592180.jpg","1573080496.jpg","1590301157.jpg","1604908176.jpg","1608897013.jpg" };
            for (int i = 0; i < items.Count; i++)
                items[i].Image = $"{imageFiles[i % imageFiles.Length]}";
            context.MenuItems.AddRange(items);
        }

        await context.SaveChangesAsync();

        if (userManager != null && !await userManager.Users.AnyAsync())
        {
            var admin = new AppUser { UserName = "elbsata" };
            var result = await userManager.CreateAsync(admin, "elbsata.2026");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}