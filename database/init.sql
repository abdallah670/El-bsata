-- =====================================================
-- El-Bsata Database Initialization Script (SQL Server)
-- Run this script on your MonsterASP database
-- =====================================================

-- Create database (skip if DB already exists in MonsterASP)
-- IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ElBsataDb')
--     CREATE DATABASE [ElBsataDb];
-- GO
-- USE [ElBsataDb];
-- GO

-- =====================================================
-- 1. ASP.NET IDENTITY TABLES (AspNet*)
-- Required by Microsoft.AspNetCore.Identity.EntityFrameworkCore
-- =====================================================

CREATE TABLE [AspNetRoles] (
    [Id]           nvarchar(450)     NOT NULL,
    [Name]         nvarchar(256)     NULL,
    [NormalizedName] nvarchar(256)   NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id]                   nvarchar(450)     NOT NULL,
    [UserName]             nvarchar(256)     NULL,
    [NormalizedUserName]   nvarchar(256)     NULL,
    [Email]                nvarchar(256)     NULL,
    [NormalizedEmail]      nvarchar(256)     NULL,
    [EmailConfirmed]       bit               NOT NULL DEFAULT 0,
    [PasswordHash]         nvarchar(max)     NULL,
    [SecurityStamp]        nvarchar(max)     NULL,
    [ConcurrencyStamp]     nvarchar(max)     NULL,
    [PhoneNumber]          nvarchar(max)     NULL,
    [PhoneNumberConfirmed] bit               NOT NULL DEFAULT 0,
    [TwoFactorEnabled]     bit               NOT NULL DEFAULT 0,
    [LockoutEnd]           datetimeoffset    NULL,
    [LockoutEnabled]       bit               NOT NULL DEFAULT 0,
    [AccessFailedCount]    int               NOT NULL DEFAULT 0,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id]         int             IDENTITY(1,1) NOT NULL,
    [RoleId]     nvarchar(450)   NOT NULL,
    [ClaimType]  nvarchar(max)   NULL,
    [ClaimValue] nvarchar(max)   NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
        REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id]         int             IDENTITY(1,1) NOT NULL,
    [UserId]     nvarchar(450)   NOT NULL,
    [ClaimType]  nvarchar(max)   NULL,
    [ClaimValue] nvarchar(max)   NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId])
        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider]        nvarchar(450)   NOT NULL,
    [ProviderKey]          nvarchar(450)   NOT NULL,
    [ProviderDisplayName]  nvarchar(max)   NULL,
    [UserId]               nvarchar(450)   NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId])
        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
        REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId])
        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId]        nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name]          nvarchar(450) NOT NULL,
    [Value]         nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId])
        REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

-- Create indexes for Identity tables
CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

-- =====================================================
-- 2. APPLICATION TABLES
-- =====================================================

-- 2a. MenuCategories
CREATE TABLE [MenuCategories] (
    [Id]    nvarchar(50)  NOT NULL,
    [Label] nvarchar(100) NOT NULL,
    [Icon]  nvarchar(10)  NULL,
    [Desc]  nvarchar(500) NULL,
    CONSTRAINT [PK_MenuCategories] PRIMARY KEY ([Id])
);

-- 2b. MenuItems
CREATE TABLE [MenuItems] (
    [Id]          nvarchar(50)   NOT NULL,
    [Name]        nvarchar(200)  NOT NULL,
    [Price]       decimal(18,2)  NULL,
    [Category]    nvarchar(50)   NULL,
    [Description] nvarchar(500)  NULL,
    [Image]       nvarchar(500)  NULL,
    CONSTRAINT [PK_MenuItems] PRIMARY KEY ([Id])
);

-- 2c. Orders (with owned CustomerInfo value object)
CREATE TABLE [Orders] (
    [Id]              nvarchar(50)    NOT NULL,
    [CustomerName]    nvarchar(200)   NULL,
    [CustomerPhone]   nvarchar(50)    NULL,
    [CustomerAddress] nvarchar(500)   NULL,
    [CustomerNotes]   nvarchar(1000)  NULL,
    [Latitude]        float           NULL,
    [Longitude]       float           NULL,
    [Accuracy]        float           NULL,
    [TotalPrice]      decimal(18,2)   NOT NULL,
    [CreatedAt]       nvarchar(100)   NOT NULL,
    [Status]          nvarchar(20)    NOT NULL DEFAULT 'Pending',
    [EmailLog]        nvarchar(max)   NULL,
    [Items]           nvarchar(max)   NOT NULL DEFAULT '[]',
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id])
);

-- =====================================================
-- 3. SEED DATA
-- =====================================================

-- 3a. Menu Categories
INSERT INTO [MenuCategories] ([Id], [Label], [Icon], [Desc]) VALUES
('section-sandwiches',  N'سندوتشات',       N'🥖', N'سندوتشات طازجة تُحضّر بأشهى المكونات المصرية الأصيلة'),
('section-casseroles',  N'طواجن لحمة',     N'🍲', N'طواجن شهية بقطع اللحم الطرية مع أجود أنواع الخضار والتوابل'),
('section-kofta',       N'كفتة & فراخ',    N'🍗', N'أشهى أطباق الكفتة المشوية والفراخ المحمرة بلمسة شرقية'),
('section-offal',       N'أطباق حواوشي',   N'🥩', N'تشكيلة غنية من أطباق الحواوشي والكوارع على الطريقة المصرية'),
('section-soups',       N'شوربات',         N'🥣', N'شوربات دافئة وغنية بنكهات الكوارع والعكاوي الأصيلة'),
('section-vegetables',  N'خضار',           N'🥬', N'تشكيلة من الخضار الطازجة المُعدّة بأسلوب تقليدي'),
('section-rice',        N'أرز & جوانب',    N'🍚', N'أطباق الأرز والفتة والجوانب التي تُكمل وجبتك المثالية'),
('section-salads',      N'سلطات & إضافات', N'🥗', N'مقبلات منعشة ومشروبات لإكمال تجربة الطعام');

-- 3b. Menu Items
INSERT INTO [MenuItems] ([Id], [Name], [Price], [Category], [Description], [Image]) VALUES
-- Sandwiches (section-sandwiches)
('sw-1',  N'سندوتش مشكل',      60.00, 'section-sandwiches', N'سندوتش مشكل فواكه لحمة غني بالبهارات الفاخرة والخلطة السرية.', '1504674900.jpg'),
('sw-2',  N'سندوتش كبدة',      70.00, 'section-sandwiches', N'كبدة بلدي طازجة مقلية بالفلفل والثوم والليمون.', '1512058564.jpg'),
('sw-3',  N'سندوتش قلب',       70.00, 'section-sandwiches', N'قطع قلوب بلدي مطهوة بعناية لتذوب في الفم.', '1516685018.jpg'),
('sw-4',  N'سندوتش كلاوي',     70.00, 'section-sandwiches', N'سندوتش كلاوي طازجة مشوحة مع البصل والبهارات المصرية.', '1541532713.jpg'),
('sw-5',  N'سندوتش طحال',      60.00, 'section-sandwiches', N'طحال محمر بجودة مثالية وطعم غني.', '1544025162.jpg'),
('sw-6',  N'سندوتش ممبار',     60.00, 'section-sandwiches', N'أقراص وقطع ممبار محشي بالخلطة ومقلي.', '1546069901.jpg'),
('sw-7',  N'سندوتش لسان',      70.00, 'section-sandwiches', N'لسان بقري مسلوق ومقرمش ببهارات كير وتخليل.', '1547592180.jpg'),
('sw-8',  N'سندوتش لحمة راس',  70.00, 'section-sandwiches', N'لحمة راس بلدي دايبة وحرشة بطعم زمان.', '1573080496.jpg'),
('sw-9',  N'سندوتش مخ',        100.00,'section-sandwiches', N'قطع كفتة مخ بانيه مقرمشة تذوب في الفم مع طحينة.', '1590301157.jpg'),
('sw-10', N'سندوتش كفتة',      70.00, 'section-sandwiches', N'كفتة مشوية على الفحم مغطاة برشة بقدونس وطحينة.', '1604908176.jpg'),
('sw-11', N'سندوتش مخاصي',     70.00, 'section-sandwiches', N'مخاصي بلدي طازجة مشوحة بالبصل والفلفل الملون.', '1608897013.jpg'),
('sw-12', N'سندوتش سجق',       70.00, 'section-sandwiches', N'سجق شرقي متبل بالبندورة والفلفل والثوم.', '1504674900.jpg'),
('sw-13', N'رغيف حواوشي',      50.00, 'section-sandwiches', N'رغيف بلدي محشو باللحمة المتبلة ومخبوز بالفرن.', '1512058564.jpg'),

-- Casseroles (section-casseroles)
('cas-1', N'طاجن لحمة بالبامية',     270.00, 'section-casseroles', N'بامية ممتازة بقطع اللحم البلدي الطري في صلصة طماطم مسبكة.', '1516685018.jpg'),
('cas-2', N'طاجن لحمة بالبصل',       250.00, 'section-casseroles', N'لحم بقري دايب مع كلوة بصل مكرمل ونكهات عريقة.', '1541532713.jpg'),
('cas-3', N'طاجن لحمة بالبطاطس',     270.00, 'section-casseroles', N'مكعبات بطاطس طرية مع اللحم البلدي والصوص الغني.', '1544025162.jpg'),
('cas-4', N'طاجن لحمة بالفاصوليا',   270.00, 'section-casseroles', N'فاصوليا خضراء طازجة بقطع اللحم المطبوخة بالفرن.', '1546069901.jpg'),
('cas-5', N'طاجن عكاوي بالبصل',      230.00, 'section-casseroles', N'طاجن عكاوي بلدي مع بصل شرائح وتوابل خاصة بالفرن.', '1547592180.jpg'),
('cas-6', N'طاجن عكاوي بالبامية',    250.00, 'section-casseroles', N'عكاوي بلدي دايبة في طاجن مع بامية وصلصة دافئة.', '1573080496.jpg'),
('cas-7', N'موزة ضاني بالفرن',       350.00, 'section-casseroles', N'موزة ضاني بلدي تذوب في الفم تُقدم عسلية طازجة.', '1590301157.jpg'),
('cas-8', N'موزة ماعز بلدي',         300.00, 'section-casseroles', N'موزة لحم ماعز شهية مطهوة ببطء مع البهارات.', '1604908176.jpg'),

-- Kofta & Chicken (section-kofta)
('kf-1', N'طبق كفتة فرن',              200.00, 'section-kofta', N'أصابع كفتة لحم بلدي مشوية بالفرن مع بطاطس وطحينة.', '1608897013.jpg'),
('kf-2', N'طبق كفتة تحمير بالزبدة',    200.00, 'section-kofta', N'كفتة دايبة محمرة بالزبدة البلدي الفاخرة.', '1504674900.jpg'),
('kf-3', N'ربع فرخ أرستقراطي فرن',      100.00, 'section-kofta', N'ربع فرخة متبلة بالخلطة ومحمرة في الفرن.', '1512058564.jpg'),
('kf-4', N'ربع فرخ بلدي تحمير',         100.00, 'section-kofta', N'ربع فرخة محمرة على الطريقة المصرية العتيقة بالزيت العذب.', '1516685018.jpg'),
('kf-5', N'حمام محشي أسطوري',          180.00, 'section-kofta', N'زوج حمام بلدي محشو بالأرز المكرمل والكبد والمكسرات والخلطة.', '1541532713.jpg'),
('kf-6', N'طائفة نص أرنب محمر',         200.00, 'section-kofta', N'نصف أرنب بلدي محمر مقرمش يُقدم ذهبيا دافئا.', '1544025162.jpg'),

-- Offal / Hawawshi (section-offal)
('of-1',  N'طبق كبدة اسكندراني',          180.00, 'section-offal', N'شرائح كبدة صغيرة بخلطة الثوم والفلفل الحار والليمون والخل.', '1546069901.jpg'),
('of-2',  N'طبق كبدة بانيه مخصوص',       180.00, 'section-offal', N'شرائح كبدة متبلة بالردة ومحمرة بطبقة مقرمشة.', '1547592180.jpg'),
('of-3',  N'طبق كبدة بالردة عتيق',        180.00, 'section-offal', N'طعم الكبدة بالردة المصري الكلاسيكي مع سلطة الطحينة.', '1573080496.jpg'),
('of-4',  N'طبق كبدة بلدي تحمير',         180.00, 'section-offal', N'كبدة بلدي كاملة محمرة بالثوم والزيت الصافي.', '1590301157.jpg'),
('of-5',  N'طبق كبدة بالبصل والفلفل',     180.00, 'section-offal', N'كبدة مشوحة مع البصل المقطع وجوانح الفلفل المعطر.', '1604908176.jpg'),
('of-6',  N'طبق قلب مشكل بالثوم',         180.00, 'section-offal', N'قلب بلدي مشوح مع الثوم التازه والتتبيلة الخاصة.', '1608897013.jpg'),
('of-7',  N'طبق كلاوي مشوحة',            180.00, 'section-offal', N'كلاوي بلدي مطبوخة بعناية مع عصارة الليمون والبهار.', '1504674900.jpg'),
('of-8',  N'طبق مخ بانيه مقرمش',          220.00, 'section-offal', N'قطع مخ بقري متبلة ومحمرة بانيه تذوب في الفم غنية ولذيذة.', '1512058564.jpg'),
('of-9',  N'طبق لسان بلدي محمر',          220.00, 'section-offal', N'شرائح لسان بلدي محمرة بالزبدة مغطاة بالفلفل الأسود والملح.', '1516685018.jpg'),
('of-10', N'طبق لحمة راس مشكل',           180.00, 'section-offal', N'تشكيلة فاخرة من لحمة الراس والحلويات واللسان والبهارات.', '1541532713.jpg'),
('of-11', N'طبق طحال محمر عائلي',         150.00, 'section-offal', N'طحال بلدي مقطع شرائح ومحمر بالزبدة خفيف النكهة.', '1544025162.jpg'),
('of-12', N'طبق ممبار ذهبي مقلي',         120.00, 'section-offal', N'سرفيس ممبار بلدي محشو خلطة الأرز ومقرمش في شكل حلقات.', '1546069901.jpg'),
('of-13', N'طبق سجق شرقي حار',            150.00, 'section-offal', N'سجق بلدي مطهو بقطع الطماطم والكزبرة والفلفل الأخضر.', '1547592180.jpg'),
('of-14', N'طبق مشكل حلويات لحوم',        120.00, 'section-offal', N'تشكيلة متكاملة من فواكه اللحمة (ممبار، طحال، كبدة، قلب).', '1573080496.jpg'),
('of-15', N'طبق مشكل مخصوص عائلي',        170.00, 'section-offal', N'أكبر تشكيلة سرفيس فاكهة لحمة لجميع أركان اللحم البلدي.', '1590301157.jpg'),
('of-16', N'طبق قشة بلدي',                120.00, 'section-offal', N'قشة مطبوخة بأقوى خلطة مصرية ونكهة عريقة غنية.', '1604908176.jpg'),
('of-17', N'طبق مخاصي بلدي',              150.00, 'section-offal', N'مخاصي بلدي محمرة مع زبدة وثوم تذوب دفئاً.', '1608897013.jpg'),

-- Soups (section-soups)
('sp-1', N'شوربة كوارع شهية',              230.00, 'section-soups', N'شوربة نخاع كوارع دسمة وغنية تقدم مع الليمون الطازج.', '1504674900.jpg'),
('sp-2', N'طبق فتة كوارع بالخل والثوم',    270.00, 'section-soups', N'طوابير فتة بالخل والثوم مضافاً إليها قطع كوارع كاملة مخلية دسمة.', '1512058564.jpg'),
('sp-3', N'ورق عنب بالكوارع بالفرن',       270.00, 'section-soups', N'طاجن رائع من ورق العنب المرصوص بمربعات الكوارع الشهية.', '1516685018.jpg'),
('sp-4', N'فتة بالعكاوي بالفرن',           270.00, 'section-soups', N'رز و عيش محمص وسمنة بلدي بقطع العكاوي المحمرة.', '1541532713.jpg'),
('sp-5', N'شوربة عكاوي غنية',              220.00, 'section-soups', N'مرقة عكاوي بلدي نقية ومثالية دافية بالحبهان والمستكة.', '1544025162.jpg'),
('sp-6', N'ورق عنب بالعكاوي الطازجة',       270.00, 'section-soups', N'توليفة محشي ورق عنب ليموني بقطع العكاوي المطهوة وسط الحشوة.', '1546069901.jpg'),

-- Vegetables (section-vegetables)
('vg-1', N'ملوخية طشة بلدي',       30.00, 'section-vegetables', N'ملوخية خضراء مخروطة طازجة بطشة الثوم والكزبرة والسمن البلدي.', '1547592180.jpg'),
('vg-2', N'طبق بسلة بالجزر',       30.00, 'section-vegetables', N'بسلة خضراء حلوة بالجزر مطبوخة بمرقة لحمة دافية في الصلصة.', '1573080496.jpg'),
('vg-3', N'طبق صينية بطاطس',       30.00, 'section-vegetables', N'شرائح بطاطس مفرودة ومخبوزة بصلصة الطماطم الخفيفة بالثوم وبشر بصل.', '1590301157.jpg'),
('vg-4', N'طبق فاصوليا خضراء مسبكة', 30.00, 'section-vegetables', N'فاصوليا بلدي مطبوخة بخلطة الطماطم والبصل اللذيذ.', '1604908176.jpg'),

-- Rice & Sides (section-rice)
('rc-1', N'أرز بلدي بالشعيرية والسمن',   40.00, 'section-rice', N'رز مصري ناصع البياض مفلفل بالشعيرية المحمرة الذهبية.', '1608897013.jpg'),
('rc-2', N'أرز بسمتي أصفر مبهر',         50.00, 'section-rice', N'حبوب أرز بسمتي طويلة مبهرة برائحة الهيل والقرفة والزعفران.', '1504674900.jpg'),
('rc-3', N'شوربة لسان عصفور فخمة',       30.00, 'section-rice', N'لسان عصفور محمر بمرقة لحمة بلدي ساخنة وليمونة.', '1512058564.jpg'),
('rc-4', N'طبق فتة سادة عتيق',           60.00, 'section-rice', N'خبز محمص وأرز مصري بلدي مسقي بمرقة اللحم وصلصة الخل والثوم.', '1516685018.jpg'),

-- Salads & Extras (section-salads)
('sd-1',  N'سلطة باذنجان مقلي بالدقة',        10.00, 'section-salads', N'قطع باذنجان مقلي مغموسة بالخل والثوم والفلفل الرومي والأحمر.', '1541532713.jpg'),
('sd-2',  N'سلطة باذنجان مخلل ليموني',        10.00, 'section-salads', N'حبات باذنجان عروس مخللة ومحشوة بخلطة الثوم والكمون والليمون الحامض.', '1544025162.jpg'),
('sd-3',  N'سلطة باباغنوج بالليمون والطحينة', 10.00, 'section-salads', N'باذنجان مشوي مهروس مخلوط بالطحينة البيضاء والثوم والتحبيشة.', '1546069901.jpg'),
('sd-4',  N'سرفيس محاشي ورق عنب',             40.00, 'section-salads', N'أصابع محشي ورق عنب بلدي مرصوصة ومسقية خلطة دافية بمزازة ليمون.', '1547592180.jpg'),
('sd-5',  N'طبق محشي كوسة بلدي',              30.00, 'section-salads', N'حبات كوسة محشوة خلطة الأرز بالخضرة ومطهوة بمرقة اللحم.', '1573080496.jpg'),
('sd-6',  N'طبق محشي باذنجان مشكل',           30.00, 'section-salads', N'باذنجان أسود وأبيض محشي خلطة عريقة مسبكة بامتياز.', '1590301157.jpg'),
('sd-7',  N'طبق محشي فلفل رومي بلدي',         40.00, 'section-salads', N'قرون فلفل أخضر بارد محشوة رز حامي بالخضار والصلصة.', '1604908176.jpg'),
('sd-8',  N'مياه معدنية مثلجة',               15.00, 'section-salads', N'زجاجة مياه معدنية نقية مثلجة زنة 600 مل للترطيب.', '1608897013.jpg'),
('sd-9',  N'علبة كان بيبسي',                  20.00, 'section-salads', N'مشروب غازي بيبسي منعش ومثلج يساعد على الهضم.', '1504674900.jpg'),
('sd-10', N'علبة كان سفن اب',                 20.00, 'section-salads', N'مشروب غازي سفن اب مثلج بنكهة الليمون المنعشة والسكر اللذيذ.', '1512058564.jpg'),
('sd-11', N'علبة كان بيبسي دايت',             20.00, 'section-salads', N'علبة بيبسي دايت خالية من السعرات الحرارية ومنعشة كلياً.', '1516685018.jpg');

-- =====================================================
-- 4. SEED ASP.NET IDENTITY
-- =====================================================

-- Create Admin role
INSERT INTO [AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
VALUES ('1', 'Admin', 'ADMIN', NEWID());

-- Create admin user
-- Password: "elbsata.2026" (hashed with ASP.NET Identity)
-- If you already have the app running, let it seed the user automatically.
-- Otherwise, you can insert the user directly with a pre-generated hash.
-- To get the hash: run the app locally once and copy from the database.

-- =====================================================
-- 5. NOTES
-- =====================================================
-- The admin user (username: "elbsata", password: "elbsata.2026")
-- is normally created automatically by DbSeeder on first app startup.
-- If you apply this SQL manually, just run the app and it will create
-- the admin user if it doesn't exist.

PRINT '✅ El-Bsata database schema and seed data created successfully!';
GO