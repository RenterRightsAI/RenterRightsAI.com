import type { StateLaw } from "@/types";

export const TEMPLATES: Record<string, (n: string, l: string, la: string, a: string, date: string, d: string, law: StateLaw | null) => string> = {
  repairs:(n,l,la,a,date,d,law)=>{
    const deadline = law ? `within 14 days of this letter, as required under ${law.name} landlord-tenant law` : 'within 14 days of this letter';
    const remedy = law ? `including contacting the ${law.name} housing authority, withholding rent, or exercising my statutory repair-and-deduct rights` : 'including contacting the local housing authority, withholding rent, or pursuing repair-and-deduct remedies';
    return `${date}

${n}
${a}

${l}
${la}

Re: Formal Request for Repairs — ${a}

Dear ${l},

I am writing to formally request that the following repair(s) be completed at my rental unit located at ${a}:

${d || '• [Describe the specific repair needed and when you first reported it]'}

I have notified you previously of this issue, and to date no repairs have been made. As my landlord, you are legally obligated under the implied warranty of habitability to maintain the premises in a safe, sanitary, and habitable condition.

I request that these repairs be completed ${deadline}. If repairs are not completed within this timeframe, I will be compelled to explore all legal remedies available to me as a tenant, ${remedy}.

Please confirm receipt of this letter in writing. I prefer all future communication regarding this matter be in writing for record-keeping purposes.

Sincerely,

${n}
${a}`;
  },
  deposit:(n,l,la,a,date,d,law)=>{
    const deadline = law ? `${law.depositDays} as required by ${law.name} law` : 'the legally required period';
    const penalty = law ? `Under ${law.name} law, landlords who wrongfully withhold deposits may owe the tenant up to ${law.depositMultiplier} the deposit amount, plus court costs.` : 'Wrongful withholding may entitle me to additional damages under state law.';
    return `${date}

${n}
${a}

${l}
${la}

Re: Demand for Return of Security Deposit — ${a}

Dear ${l},

I am writing to formally demand the immediate return of my security deposit in the amount of $[AMOUNT] for the rental property at ${a}.

My tenancy ended on [MOVE-OUT DATE]. The legally required period for deposit return — ${deadline} — has passed. I vacated the premises in good condition, reasonable wear and tear excepted. ${d ? '\n\nAdditional context: ' + d : ''}

If you intend to make any deductions, you are legally required to provide a written, itemized statement of all charges within the return deadline. I have not received such a statement.

Please return my full deposit within 7 days of this letter. ${penalty}

If I do not receive my deposit or a written itemized statement within 7 days, I will pursue all available legal remedies, including filing a claim in small claims court.

Sincerely,

${n}
${a}`;
  },
  privacy:(n,l,la,a,date,d,law)=>{
    const req = law ? `${law.noticeDays} written notice as required by ${law.name} law` : 'legally required advance written notice (typically 24 hours minimum)';
    return `${date}

${n}
${a}

${l}
${la}

Re: Unauthorized Entry — Formal Notice

Dear ${l},

I am writing to formally notify you that you entered my rental unit at ${a} without providing the required advance notice. ${d ? 'Specifically: ' + d + '.' : ''}

Under landlord-tenant law, landlords are required to provide ${req} before entering a tenant's unit, except in cases of genuine emergency requiring immediate entry to prevent serious damage or harm.

Your entry did not constitute an emergency and was made without proper notice, which violates my right to quiet enjoyment of the premises.

I respectfully but firmly request that you provide proper written notice before any future entry. I will document any further violations and will not hesitate to contact the local housing authority or pursue legal remedies if unauthorized entry continues.

This letter serves as formal notice of this violation. Please confirm in writing that you will comply with proper notice requirements going forward.

Sincerely,

${n}
${a}`;
  },
  habitability:(n,l,la,a,date,d,law)=>{
    const deadline = law ? `within 72 hours (for emergencies) or 14 days (non-emergency), as required under ${law.name} landlord-tenant law` : 'within 72 hours for emergency conditions or 14 days for non-emergency repairs';
    return `${date}

${n}
${a}

${l}
${la}

Re: Uninhabitable Conditions — Urgent Repair Demand — ${a}

Dear ${l},

I am writing to formally notify you of unsafe and uninhabitable conditions at my rental unit at ${a} that require your immediate attention.

The following conditions exist at the property:

${d || '• [Describe the specific unsafe condition — mold, pest infestation, no heat, water damage, structural hazard, etc. — and the date you first observed it]'}

These conditions constitute a violation of the implied warranty of habitability, which legally requires landlords to maintain rental properties in a safe, sanitary, and livable condition at all times. These conditions may also violate applicable health and building codes.

I demand that you remediate these conditions ${deadline}. If you fail to act within this period, I will:

1. Contact the local housing authority to request a formal inspection and violation citation
2. Exercise all legal remedies available to me as a tenant under state law, including rent withholding, rent escrow, or lease termination
3. Pursue any available damages caused by your failure to maintain habitable conditions

Please confirm in writing that you have received this letter and will take immediate action.

Sincerely,

${n}
${a}`;
  },
  retaliation:(n,l,la,a,date,d,law)=>{
    const stateLine = law ? ` under ${law.name} law` : '';
    return `${date}

${n}
${a}

${l}
${la}

Re: Notice of Retaliatory Conduct — Formal Demand to Cease

Dear ${l},

I am writing to formally notify you that I believe you have engaged in retaliatory conduct in violation of state and local law${stateLine}.

${d || '[Describe the retaliatory action — such as: issuing an eviction notice, raising rent, reducing services, or failing to make repairs — and connect it to your protected activity, such as: reporting habitability issues, contacting the housing authority, requesting repairs in writing, or exercising another legal right]'}

Retaliating against a tenant for exercising their legal rights — including but not limited to reporting housing code violations, contacting housing authorities, requesting legally required repairs, or participating in tenant organizing — is illegal${stateLine}.

I demand that you immediately cease all retaliatory actions. I have documented this conduct and will file a formal complaint with the [State/City] Housing Authority and pursue civil damages if retaliatory behavior continues.

Please govern yourself accordingly.

Sincerely,

${n}
${a}`;
  },
};
