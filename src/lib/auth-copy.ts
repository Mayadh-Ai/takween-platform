import type { Locale } from "@/lib/i18n";

export const authCopy = {
  en: {
    loginTitle: "Welcome back",
    loginDescription: "Sign in with your TAKWEEN employee account.",
    email: "Work email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    loginUnavailable:
      "Employee sign-in is not configured yet. Add your Supabase project URL and public anon key to .env.local, then restart the app.",
    loginError: "We couldn’t sign you in. Check your details and try again.",
    dashboardLabel: "Employee workspace",
    dashboardTitle: "Your workspace, in one place.",
    dashboardDescription:
      "Your secure home for company updates, tasks, and team collaboration.",
    dashboardWelcome: "Welcome",
    dashboardReady:
      "Your employee workspace is ready. Team tools will appear here as they are enabled.",
    setupTitle: "Connect Supabase to continue",
    setupDescription:
      "The employee area stays locked until authentication is configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the app.",
    roleRequiredTitle: "Employee access required",
    roleRequiredDescription:
      "Your account is signed in, but it does not have a recognized employee role. Ask a Super Admin to assign your role.",
    permissionDeniedTitle: "You don’t have access to this area",
    permissionDeniedDescription:
      "Your current employee role does not include permission to open this section.",
    moduleComingSoon: "This workspace section is being prepared.",
    tasksModuleDescription:
      "Task viewing is available for every employee role. Task data and collaboration tools will be added in a later phase.",
    teamModuleDescription:
      "Employee directory and team management are reserved for Admins and Super Admins. These tools will be added in a later phase.",
    rolesModuleDescription:
      "Role management is reserved for Super Admins. These tools will be added in a later phase.",
    roleSuperAdmin: "Super Admin",
    roleAdmin: "Admin",
    roleManager: "Manager",
    roleEmployee: "Employee",
    workspace: "Workspace",
    overview: "Overview",
    tasks: "Tasks",
    team: "Team",
    roleManagement: "Role management",
    logout: "Sign out",
    loggingOut: "Signing out…",
    logoutError:
      "We couldn’t end your session. Please try signing out again.",
    backToSite: "Back to TAKWEEN",
    language: "العربية",
  },
  ar: {
    loginTitle: "مرحبًا بعودتك",
    loginDescription: "سجّل الدخول باستخدام حساب موظف تكوين.",
    email: "البريد الإلكتروني للعمل",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ تسجيل الدخول…",
    loginUnavailable:
      "لم يتم إعداد تسجيل دخول الموظفين بعد. أضف رابط مشروع Supabase والمفتاح العام إلى ملف .env.local ثم أعد تشغيل التطبيق.",
    loginError:
      "تعذّر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.",
    dashboardLabel: "مساحة عمل الموظفين",
    dashboardTitle: "مساحة عملك، في مكان واحد.",
    dashboardDescription:
      "مساحتك الآمنة لمتابعة أخبار الشركة والمهام والتعاون مع الفريق.",
    dashboardWelcome: "مرحبًا",
    dashboardReady:
      "مساحة عملك جاهزة. ستظهر أدوات الفريق هنا عند تفعيلها.",
    setupTitle: "اربط Supabase للمتابعة",
    setupDescription:
      "تظل مساحة الموظفين محمية حتى إعداد المصادقة. أضف NEXT_PUBLIC_SUPABASE_URL وNEXT_PUBLIC_SUPABASE_ANON_KEY إلى ملف .env.local ثم أعد تشغيل التطبيق.",
    roleRequiredTitle: "يلزم وجود صلاحية موظف",
    roleRequiredDescription:
      "تم تسجيل دخولك، لكن حسابك لا يحمل دور موظف معتمدًا. اطلب من المسؤول الأعلى تعيين دورك.",
    permissionDeniedTitle: "لا تملك صلاحية الوصول إلى هذا القسم",
    permissionDeniedDescription:
      "لا يتضمن دورك الوظيفي الحالي صلاحية فتح هذا القسم.",
    moduleComingSoon: "يجري تجهيز هذا القسم من مساحة العمل.",
    tasksModuleDescription:
      "تتوفر صلاحية الاطلاع على المهام لجميع الأدوار. ستُضاف بيانات المهام وأدوات التعاون في مرحلة لاحقة.",
    teamModuleDescription:
      "إدارة الفريق مخصصة للمسؤولين والمسؤول الأعلى. ستُضاف هذه الأدوات في مرحلة لاحقة.",
    rolesModuleDescription:
      "إدارة الأدوار مخصصة للمسؤول الأعلى. ستُضاف هذه الأدوات في مرحلة لاحقة.",
    roleSuperAdmin: "المسؤول الأعلى",
    roleAdmin: "مسؤول",
    roleManager: "مدير",
    roleEmployee: "موظف",
    workspace: "مساحة العمل",
    overview: "نظرة عامة",
    tasks: "المهام",
    team: "الفريق",
    roleManagement: "إدارة الأدوار",
    logout: "تسجيل الخروج",
    loggingOut: "جارٍ تسجيل الخروج…",
    logoutError: "تعذّر إنهاء جلستك. حاول تسجيل الخروج مرة أخرى.",
    backToSite: "العودة إلى تكوين",
    language: "English",
  },
} as const satisfies Record<Locale, Record<string, string>>;
