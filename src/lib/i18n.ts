import { useSyncExternalStore } from "react";

export type Lang = "en" | "hi" | "or";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "or", label: "ଓଡ଼ିଆ" },
];

// English text is the key. Missing entries fall back to English.
const dict: Record<string, { hi: string; or: string }> = {
  Home: { hi: "होम", or: "ମୂଳ ପୃଷ୍ଠା" },
  Record: { hi: "दर्ज करें", or: "ରେକର୍ଡ" },
  Reuse: { hi: "पुनः उपयोग", or: "ପୁନଃବ୍ୟବହାର" },
  Dashboard: { hi: "डैशबोर्ड", or: "ଡ୍ୟାସବୋର୍ଡ" },
  Records: { hi: "रिकॉर्ड", or: "ରେକର୍ଡଗୁଡ଼ିକ" },
  About: { hi: "परिचय", or: "ବିଷୟରେ" },
  "My account": { hi: "मेरा खाता", or: "ମୋ ଖାତା" },
  "Sign out": { hi: "साइन आउट", or: "ସାଇନ୍ ଆଉଟ୍" },
  "Sign in": { hi: "साइन इन", or: "ସାଇନ୍ ଇନ୍" },
  "Skip to content": { hi: "मुख्य सामग्री पर जाएँ", or: "ମୁଖ୍ୟ ବିଷୟକୁ ଯାଆନ୍ତୁ" },
  Language: { hi: "भाषा", or: "ଭାଷା" },
  Marketplace: { hi: "बाज़ार", or: "ବଜାର" },
  "Record waste": { hi: "कचरा दर्ज करें", or: "ଅବଶେଷ ରେକର୍ଡ କରନ୍ତୁ" },
  "Team Avashesh — student project. Waste Less. Create More.": {
    hi: "टीम अवशेष — छात्र परियोजना। कम बर्बादी, ज़्यादा निर्माण।",
    or: "ଟିମ୍ ଅବଶେଷ — ଛାତ୍ର ପ୍ରକଳ୍ପ। କମ୍ ଅପଚୟ, ଅଧିକ ସୃଷ୍ଟି।",
  },
  "Contact:": { hi: "संपर्क:", or: "ଯୋଗାଯୋଗ:" },
  "Waste Less. Create More.": { hi: "कम बर्बादी, ज़्यादा निर्माण।", or: "କମ୍ ଅପଚୟ, ଅଧିକ ସୃଷ୍ଟି।" },
  "🌱 Clean Air & Residue Reuse Initiative · Odisha": {
    hi: "🌱 स्वच्छ हवा और फसल अवशेष पुनः उपयोग पहल · ओडिशा",
    or: "🌱 ସ୍ୱଚ୍ଛ ପବନ ଓ ଫସଲ ଅବଶେଷ ପୁନଃବ୍ୟବହାର ପଦକ୍ଷେପ · ଓଡ଼ିଶା",
  },
  "Connecting Odisha's farmers and agricultural producer organizations with verified buyers and bio-industries to eliminate stubble burning and create circular economic value.":
    {
      hi: "ओडिशा के किसानों और कृषि उत्पादक संगठनों को खरीदारों और जैव-उद्योगों से जोड़कर पराली जलाने को रोकना और चक्रीय आर्थिक मूल्य बनाना।",
      or: "ଓଡ଼ିଶାର କୃଷକ ଓ କୃଷି ଉତ୍ପାଦକ ସଂଗଠନମାନଙ୍କୁ କ୍ରେତା ଓ ଜୈବ-ଶିଳ୍ପ ସହ ଯୋଡ଼ି ନଡ଼ା ପୋଡ଼ିବା ବନ୍ଦ କରିବା ଓ ଚକ୍ରୀୟ ଆର୍ଥିକ ମୂଲ୍ୟ ସୃଷ୍ଟି କରିବା।",
    },
  "Browse listings": { hi: "लिस्टिंग देखें", or: "ତାଲିକା ଦେଖନ୍ତୁ" },
  "1,480+ Tonnes Diverted in Odisha": {
    hi: "ओडिशा में 1,480+ टन मोड़ा गया",
    or: "ଓଡ଼ିଶାରେ 1,480+ ଟନ୍ ବିକଳ୍ପ ବ୍ୟବହାରକୁ",
  },
  "Zero Middleman Farmgate Transactions": {
    hi: "बिना बिचौलिए खेत से सीधा सौदा",
    or: "ମଧ୍ୟସ୍ଥି ବିନା କ୍ଷେତରୁ ସିଧା କାରବାର",
  },
  BUY: { hi: "खरीदें", or: "କିଣନ୍ତୁ" },
  SELL: { hi: "बेचें", or: "ବିକନ୍ତୁ" },
  "Agricultural waste": { hi: "कृषि अवशेष", or: "କୃଷି ଅବଶେଷ" },
  "Browse straw, husk and residue listings": {
    hi: "पराली, भूसी और अवशेष की लिस्टिंग देखें",
    or: "ନଡ଼ା, ଚୋପା ଓ ଅବଶେଷ ତାଲିକା ଦେଖନ୍ତୁ",
  },
  "Post your residue for buyers to find": {
    hi: "अपना अवशेष डालें ताकि खरीदार ढूँढ सकें",
    or: "କ୍ରେତାଙ୍କ ପାଇଁ ଆପଣଙ୍କ ଅବଶେଷ ପୋଷ୍ଟ କରନ୍ତୁ",
  },
  "Every agricultural residue deserves a better alternative to burning. Help us turn waste into resources and work towards cleaner air.":
    {
      hi: "हर फसल अवशेष को जलाने से बेहतर विकल्प मिलना चाहिए। कचरे को संसाधन बनाने और स्वच्छ हवा की ओर बढ़ने में हमारी मदद करें।",
      or: "ପ୍ରତ୍ୟେକ ଫସଲ ଅବଶେଷ ପୋଡ଼ିବା ବଦଳରେ ଭଲ ବିକଳ୍ପ ପାଇବା ଉଚିତ। ଅପଚୟକୁ ସମ୍ବଳରେ ପରିଣତ କରି ସ୍ୱଚ୍ଛ ପବନ ଦିଗରେ ଆମକୁ ସାହାଯ୍ୟ କରନ୍ତୁ।",
    },
  "How it works": { hi: "यह कैसे काम करता है", or: "ଏହା କିପରି କାମ କରେ" },
  "Farmer posts residue": { hi: "किसान अवशेष डालता है", or: "କୃଷକ ଅବଶେଷ ପୋଷ୍ଟ କରନ୍ତି" },
  "Add type, quantity, district and a photo.": {
    hi: "प्रकार, मात्रा, ज़िला और फ़ोटो जोड़ें।",
    or: "ପ୍ରକାର, ପରିମାଣ, ଜିଲ୍ଲା ଓ ଫଟୋ ଯୋଡ଼ନ୍ତୁ।",
  },
  "Buyer sends inquiry": { hi: "खरीदार पूछताछ भेजता है", or: "କ୍ରେତା ପଚାରିବା ପଠାନ୍ତି" },
  "Buyers browse listings and contact the seller.": {
    hi: "खरीदार लिस्टिंग देखकर विक्रेता से संपर्क करते हैं।",
    or: "କ୍ରେତା ତାଲିକା ଦେଖି ବିକ୍ରେତାଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତି।",
  },
  "Residue gets reused": { hi: "अवशेष का पुनः उपयोग होता है", or: "ଅବଶେଷ ପୁନଃବ୍ୟବହାର ହୁଏ" },
  "Straw or husk goes to reuse instead of burning.": {
    hi: "पराली या भूसी जलने के बजाय काम में आती है।",
    or: "ନଡ଼ା ବା ଚୋପା ପୋଡ଼ିବା ବଦଳରେ ବ୍ୟବହାର ହୁଏ।",
  },
  "Who it's for": { hi: "यह किसके लिए है", or: "ଏହା କାହା ପାଇଁ" },
  Farmers: { hi: "किसान", or: "କୃଷକ" },
  "List paddy straw, coconut husk or other residue instead of burning it.": {
    hi: "धान की पराली, नारियल की भूसी या अन्य अवशेष जलाने के बजाय लिस्ट करें।",
    or: "ଧାନ ନଡ଼ା, ନଡ଼ିଆ ଚୋପା ବା ଅନ୍ୟ ଅବଶେଷ ପୋଡ଼ିବା ବଦଳରେ ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ।",
  },
  Buyers: { hi: "खरीदार", or: "କ୍ରେତା" },
  "Find residue for mushrooms, coir, compost, fodder or biomass use.": {
    hi: "मशरूम, कॉयर, खाद, चारा या बायोमास के लिए अवशेष खोजें।",
    or: "ଛତୁ, କତା, ଖତ, ଗୋଖାଦ୍ୟ ବା ବାୟୋମାସ ପାଇଁ ଅବଶେଷ ଖୋଜନ୍ତୁ।",
  },
  "Anyone curious": { hi: "कोई भी जिज्ञासु", or: "ଯେକୌଣସି ଆଗ୍ରହୀ" },
  "Record waste on this device and explore simple reuse ideas.": {
    hi: "इस डिवाइस पर कचरा दर्ज करें और आसान पुनः उपयोग के तरीके देखें।",
    or: "ଏହି ଡିଭାଇସରେ ଅବଶେଷ ରେକର୍ଡ କରି ସହଜ ପୁନଃବ୍ୟବହାର ଉପାୟ ଦେଖନ୍ତୁ।",
  },
  "Our mission": { hi: "हमारा मिशन", or: "ଆମର ଲକ୍ଷ୍ୟ" },
  "Record and explore reuse": {
    hi: "दर्ज करें और पुनः उपयोग देखें",
    or: "ରେକର୍ଡ କରନ୍ତୁ ଓ ପୁନଃବ୍ୟବହାର ଦେଖନ୍ତୁ",
  },
  "Explore reuse ideas": { hi: "पुनः उपयोग के विचार देखें", or: "ପୁନଃବ୍ୟବହାର ଉପାୟ ଦେଖନ୍ତୁ" },
  "View dashboard": { hi: "डैशबोर्ड देखें", or: "ଡ୍ୟାସବୋର୍ଡ ଦେଖନ୍ତୁ" },
  "Waste records stay on this device. Marketplace listings and inquiries are shared through signed-in accounts. Suggestions use fixed rules, not AI.":
    {
      hi: "कचरे के रिकॉर्ड इसी डिवाइस पर रहते हैं। बाज़ार की लिस्टिंग और पूछताछ साइन-इन खातों से साझा होती हैं। सुझाव तय नियमों से आते हैं, AI से नहीं।",
      or: "ଅବଶେଷ ରେକର୍ଡ ଏହି ଡିଭାଇସରେ ରହେ। ବଜାର ତାଲିକା ଓ ପଚାରିବା ସାଇନ୍-ଇନ୍ ଖାତା ମାଧ୍ୟମରେ ଅଂଶୀଦାର ହୁଏ। ପରାମର୍ଶ ସ୍ଥିର ନିୟମରୁ ଆସେ, AI ରୁ ନୁହେଁ।",
    },
  "About the project": { hi: "परियोजना के बारे में", or: "ପ୍ରକଳ୍ପ ବିଷୟରେ" },
  "Have residue after harvest?": {
    hi: "कटाई के बाद अवशेष बचा है?",
    or: "ଅମଳ ପରେ ଅବଶେଷ ଅଛି କି?",
  },
  "Find a buyer on the marketplace or record it to explore reuse ideas instead of burning.": {
    hi: "जलाने के बजाय बाज़ार में खरीदार खोजें या इसे दर्ज करके पुनः उपयोग के विचार देखें।",
    or: "ପୋଡ଼ିବା ବଦଳରେ ବଜାରରେ କ୍ରେତା ଖୋଜନ୍ତୁ ବା ରେକର୍ଡ କରି ପୁନଃବ୍ୟବହାର ଉପାୟ ଦେଖନ୍ତୁ।",
  },
};

export function translate(text: string, lang: Lang): string {
  if (lang === "en") return text;
  return dict[text]?.[lang] ?? text;
}

const KEY = "avashesh.lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "hi" || v === "or" ? v : "en";
  } catch {
    return "en";
  }
}

export function setLang(lang: Lang) {
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* storage unavailable */
  }
  document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, read, () => "en");
}

export function useT() {
  const lang = useLang();
  return (text: string) => translate(text, lang);
}
