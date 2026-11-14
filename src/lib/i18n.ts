export const messages = {
  en: {
    metaTitle: "Thoughtful digital experiences",
    metaDescription:
      "A considered approach to strategy, design, and digital experiences.",
    navigationLabel: "Main navigation",
    menuLabel: "Menu",
    employeeLogin: "Team login",
    navServices: "What we do",
    navApproach: "Our approach",
    navContact: "Get in touch",
    switchLanguage: "العربية",
    headerCta: "Let’s talk",
    eyebrow: "Strategy · Design · Digital",
    heroTitle: "A good idea deserves a thoughtful beginning.",
    heroDescription:
      "We shape clear strategies and meaningful digital experiences for businesses ready to move forward.",
    primaryCta: "Start a conversation",
    secondaryCta: "Explore what we do",
    heroNote: "Made with intention. Built for what’s next.",
    introEyebrow: "A little about us",
    introTitle: "We turn possibility into progress.",
    introDescription:
      "The best work starts with listening. We bring people, ideas, and technology together to make the complex feel clear—and the ambitious feel achievable.",
    introLink: "How we work",
    servicesEyebrow: "Thoughtfully, from start to finish",
    servicesTitle: "Good ideas, made real.",
    servicesDescription:
      "From the first question to the final detail, we help you take the next right step.",
    services: [
      {
        title: "Strategy & clarity",
        description:
          "Find the signal in the noise, define what matters, and make a plan that moves you forward.",
      },
      {
        title: "Brand & experience",
        description:
          "Build a distinct identity and thoughtful experiences that feel unmistakably yours.",
      },
      {
        title: "Digital & delivery",
        description:
          "Bring ideas to life with useful, considered digital products built around real people.",
      },
    ],
    learnMore: "Discover more",
    closingEyebrow: "Every good thing starts somewhere",
    closingTitle: "What could we make together?",
    closingDescription:
      "Tell us what you’re thinking. We’d love to hear where you want to go.",
    getInTouch: "Say hello",
    footerNote: "Thoughtful by nature. Forward by design.",
  },
  ar: {
    metaTitle: "تجارب رقمية تصنع بوعي",
    metaDescription:
      "نهج مدروس في الاستراتيجية والتصميم وصناعة التجارب الرقمية.",
    navigationLabel: "التنقل الرئيسي",
    menuLabel: "القائمة",
    employeeLogin: "دخول الموظفين",
    navServices: "خدماتنا",
    navApproach: "منهجنا",
    navContact: "تواصل معنا",
    switchLanguage: "English",
    headerCta: "لنتحدث",
    eyebrow: "استراتيجية · تصميم · حلول رقمية",
    heroTitle: "كل فكرة جميلة تستحق بداية مدروسة.",
    heroDescription:
      "نصنع استراتيجيات واضحة وتجارب رقمية ذات معنى للأعمال المستعدة للانطلاق نحو المستقبل.",
    primaryCta: "لنبدأ حوارًا",
    secondaryCta: "اكتشف خدماتنا",
    heroNote: "صُنع باهتمام. واستعدادًا لما هو قادم.",
    introEyebrow: "نبذة عنا",
    introTitle: "نحوّل الإمكانات إلى إنجازات.",
    introDescription:
      "يبدأ العمل المميز بالإنصات. نجمع الأشخاص والأفكار والتقنية لنحوّل التعقيد إلى وضوح والطموح إلى خطوات ممكنة.",
    introLink: "كيف نعمل",
    servicesEyebrow: "بعناية من البداية إلى النهاية",
    servicesTitle: "أفكار جميلة تتحول إلى واقع.",
    servicesDescription:
      "من السؤال الأول إلى أدق التفاصيل، نساعدك على اتخاذ الخطوة التالية بثقة.",
    services: [
      {
        title: "الاستراتيجية والوضوح",
        description:
          "نساعدك على تحديد الأولويات ورسم مسار واضح يدفع أعمالك إلى الأمام.",
      },
      {
        title: "العلامة والتجربة",
        description:
          "نبني هوية مميزة وتجارب مدروسة تعكس جوهر علامتك التجارية.",
      },
      {
        title: "الحلول الرقمية والتنفيذ",
        description:
          "نحوّل الأفكار إلى منتجات رقمية مفيدة ومدروسة تتمحور حول الناس.",
      },
    ],
    learnMore: "اكتشف المزيد",
    closingEyebrow: "كل بداية جميلة تبدأ بخطوة",
    closingTitle: "ما الذي يمكننا إنجازه معًا؟",
    closingDescription:
      "أخبرنا بما تفكر فيه. يسعدنا أن نعرف إلى أين تطمح.",
    getInTouch: "تواصل معنا",
    footerNote: "نهتم بالتفاصيل. ونصمم للمستقبل.",
  },
} as const;

export type Locale = keyof typeof messages;

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(messages, value);
}
