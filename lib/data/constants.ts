export const LETTER_PLACEHOLDERS = {
  repairs:      "e.g. The heating system stopped working on November 3rd. I reported it verbally on Nov 3 and by email on Nov 7. My landlord said someone would come but no repairs have been made in 3 weeks. Temperatures have dropped to 50°F inside.",
  deposit:      "e.g. I moved out on October 15th after 2 years of tenancy. I left the unit in clean condition, took timestamped photos on move-out day, and returned all keys. It has now been 35 days and I have received neither my $1,800 deposit nor any itemized statement.",
  privacy:      "e.g. On December 2nd at 2 PM, my landlord entered my apartment without any prior notice while I was at work. My neighbor told me they saw him go in. This is the third time this has happened in the past 60 days. I have not given permission for unannounced entry.",
  habitability: "e.g. Black mold has been spreading across the bathroom ceiling and into the bedroom wall since September. I reported it in writing on Sept 12th and Oct 1st. My landlord sent someone to paint over it but the mold returned within a week. Two family members have developed respiratory symptoms.",
  retaliation:  "e.g. On November 20th I filed a complaint with the City Housing Authority about the broken heating system. On December 1st — 11 days later — my landlord served me a 30-day notice to vacate with no stated reason. I have paid rent on time for 18 months and have no lease violations.",
};

export const TL_TYPE_LABELS = {
  report:'Reported issue to landlord', letter:'Sent demand letter',
  response:'Landlord responded', noresponse:'Landlord did not respond',
  repair:'Repair attempted', complaint:'Filed housing complaint',
  inspection:'Inspector visited', violation:'Violation citation issued',
  court:'Court hearing', payment:'Payment made / received', other:'Other',
};

export const VLT_TYPE_LABELS = {
  photo:'Photo / video', email:'Email or text message', letter:'Letter or notice',
  receipt:'Receipt or invoice', report:'Inspection or repair report',
  lease:'Lease agreement / addendum', other:'Other',
};

export const SUP_SUBJECTS = {
  bug:     'Bug report',
  question:'Plan question',
  billing: 'Billing issue',
  feature: 'Feature request',
  legal:   'Legal information question',
  other:   'Support request',
};

export const PRO_SCREENS = {
  timeline: 'Case timeline is a Pro feature — track every event in your dispute with dates, notes, and an exportable court-ready record.',
  vault:    'Document vault is a Pro feature — store descriptions of every photo, email, receipt, and document in your case.',
  attorney: 'Attorney match is a Pro feature — get your free 20-minute consultation with a licensed tenant attorney in your state.',
  support:  'Priority support is a Pro feature — get responses within 4 hours instead of 48-72 hours.',
};

export const FREE_AI_LIMIT = 3;
export const FREE_LETTER_LIMIT = 1;
export const TL_KEY = "rra_timeline";
export const VLT_KEY = "rra_vault";
