import type { IssueData } from "@/types";

export const ISSUES: Record<string, IssueData> = {
  repairs:{
    title:"Repairs ignored by your landlord",
    urgency:"warn",urgencyText:"Know your options — act in writing",
    steps:[
      {t:"Document right now",b:"Take dated photos or a short video of the problem today. Write down the date you first noticed it and every time you mentioned it to the landlord."},
      {t:"Put it in writing",b:"Send an email or text to your landlord describing the repair needed and when you first reported it. Written notice starts the legal clock."},
      {t:"Set a clear deadline",b:"State in writing that you expect repairs within 14 days (or 48–72 hours for emergencies like no heat or flooding). Refer to their obligation to maintain habitability."},
      {t:"Escalate if ignored",b:"Contact your local housing authority or building inspector. An official citation creates powerful legal evidence and often prompts fast action."},
      {t:"Know your remedies",b:"Depending on your state: repair-and-deduct (fix it, subtract cost from rent), rent withholding, or rent escrow. Each has specific rules — your state matters here."},
    ],
    rights:["Landlords must keep rentals habitable under the implied warranty of habitability — a legal right in all 50 states","Failure to repair after proper notice may allow you to withhold rent in most states","Retaliation for reporting repair issues is illegal — your landlord cannot evict you or raise rent because you complained"],
  },
  deposit:{
    title:"Security deposit dispute",
    urgency:"warn",urgencyText:"Act before the deadline passes",
    steps:[
      {t:"Know your state's deadline",b:"Your landlord has a limited number of days to return your deposit after move-out. In most states it's 14–30 days. Past that deadline, they may lose the right to keep any deductions."},
      {t:"Demand an itemized list",b:"If they're keeping anything, they must provide a written itemized breakdown. Request this in writing if you haven't received it."},
      {t:"Challenge 'normal wear and tear'",b:"Scuffs on walls, minor carpet wear, small nail holes — these are normal wear and tear and cannot legally be deducted from your deposit."},
      {t:"Compare to your move-in checklist",b:"If you documented conditions at move-in (photos, signed checklist), this is your strongest evidence against false damage claims."},
      {t:"Send a formal demand letter",b:"A certified letter requesting return within 7–10 days often resolves disputes before court. Many landlords respond immediately to a well-worded legal demand."},
    ],
    rights:["Normal wear and tear is never deductible from your security deposit","Landlords who wrongfully withhold may owe you 2–3× the deposit as a penalty (varies by state)","Small claims court is designed for exactly these disputes — you don't need a lawyer"],
  },
  eviction:{
    title:"Eviction notice received",
    urgency:"danger",urgencyText:"Act quickly — timelines are short",
    steps:[
      {t:"Read the notice carefully — don't panic",b:"Identify the type: 'Pay or Quit' (pay rent or leave), 'Cure or Quit' (fix a violation or leave), or 'Unconditional Quit' (must leave regardless). Each has different rules."},
      {t:"Check for defects",b:"Many eviction notices are legally invalid due to wrong amounts, wrong dates, improper service, or failure to include required language. A defective notice can be challenged."},
      {t:"Respond before the deadline",b:"If you can fix the issue — pay overdue rent, cure a lease violation — do so immediately and in writing. Keep proof of payment."},
      {t:"Contact legal aid today",b:"Many cities have free tenant legal aid clinics. Eviction timelines are often just 3–5 days. Do not miss a court date — missing means automatic loss."},
      {t:"Show up to any court hearing",b:"You have the right to be heard. Bring all documentation, receipts, photos, and lease agreements. Judges often side with tenants who appear and are prepared."},
    ],
    rights:["You cannot be removed without a formal court order — self-help eviction (changing locks, removing belongings) is illegal in all 50 states","You have the right to a court hearing where you can present a defense","Retaliatory eviction — eviction because you complained about conditions — is illegal everywhere"],
  },
  privacy:{
    title:"Landlord entering without proper notice",
    urgency:"warn",urgencyText:"Document it and respond formally",
    steps:[
      {t:"Check your state's notice requirement",b:"Most states require 24–48 hours written notice before a landlord enters. 'I just wanted to check on things' is not a legal emergency."},
      {t:"Document every incident",b:"Write down the date, time, and what the landlord said and did each time they entered without notice. This pattern matters in court."},
      {t:"Send a formal reminder letter",b:"A polite but firm letter reminding the landlord of their legal obligations — and documenting the violation — often stops the behavior immediately."},
      {t:"Escalate if it continues",b:"Repeated unauthorized entry may constitute harassment or constructive eviction (making the property uninhabitable through conduct). Contact your local housing authority."},
    ],
    rights:["Your right to quiet enjoyment is guaranteed in virtually all residential leases — landlords cannot interfere with your peaceful use of the property","Most states require 24–48 hours written notice before entry","Some states allow you to terminate your lease or sue for damages if a landlord repeatedly violates entry rules"],
  },
  rent:{
    title:"Rent increase — is it legal?",
    urgency:"warn",urgencyText:"Check local rules before responding",
    steps:[
      {t:"Check if rent control applies to you",b:"Many cities (New York, Los Angeles, San Francisco, Portland, DC) limit rent increases. Even if your state has no rent control, your city might. Check your city's housing department website."},
      {t:"Verify the notice period",b:"Most states require 30–60 days written notice for a rent increase. A verbal increase or a notice with less than required time may be invalid."},
      {t:"Calculate the percentage",b:"Some jurisdictions cap increases at CPI (inflation index) or a fixed percentage. If the increase exceeds the cap, it may be illegal and you can file a complaint."},
      {t:"Know your lease protections",b:"If you're on a fixed-term lease, your rent generally cannot be raised until the lease expires. Only month-to-month tenants face immediate increases."},
      {t:"Negotiate",b:"Long-term tenants often have leverage. A polite letter noting your payment history and the costs of turnover can result in a reduced or waived increase."},
    ],
    rights:["Fixed-term lease holders cannot legally have rent raised during the lease period","Rent increases in retaliation for complaints about conditions are illegal everywhere","In rent-controlled areas, landlords must apply to the housing board to justify above-limit increases"],
  },
  habitability:{
    title:"Unsafe or uninhabitable conditions",
    urgency:"danger",urgencyText:"This may require urgent action",
    steps:[
      {t:"Document everything with dated evidence",b:"Photograph mold, pests, water damage, broken heating, or any unsafe condition. Write down dates and symptoms (health effects if applicable)."},
      {t:"Notify your landlord in writing immediately",b:"Email your landlord today. Use clear language: 'This condition violates the implied warranty of habitability and requires immediate attention.'"},
      {t:"Contact a housing inspector",b:"Your city or county housing authority can inspect and issue official violations. A citation is powerful legal ammunition and often forces quick repairs."},
      {t:"Protect your health",b:"If the conditions are serious (gas leak, no heat in winter, sewage backup), you may have the right to temporarily leave and deduct those costs. Document this decision carefully."},
      {t:"Consider rent escrow",b:"In many states, you can pay rent into a court-held escrow account until repairs are made. This protects you from eviction while putting legal pressure on the landlord."},
    ],
    rights:["The implied warranty of habitability is a legal right in all 50 states — landlords must maintain safe and livable conditions","You cannot be evicted for reporting uninhabitable conditions to housing authorities — that is retaliation","In severe cases, tenants may be able to terminate the lease without penalty due to 'constructive eviction'"],
  },
};;
