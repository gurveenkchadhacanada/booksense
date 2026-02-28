import { useState, useEffect, useMemo, useRef } from "react";

const PRODUCTS = ["Core Platform","Analytics Add-on","API Access","Premium Support","Custom Integrations","Mobile SDK"];
const ACCOUNTS = [
  {id:1,name:"Meridian Health Systems",industry:"Healthcare",tier:"Enterprise",arr:240000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support"],usageTrend:-34,daysSinceLastTouch:78,daysUntilRenewal:28,openTickets:4,npsScore:3,totalTouchpoints:2,lastTouchType:"Support Escalation",notes:"VP of Ops raised performance complaints. Two champions left in Jan. New CTO evaluating competitors. Support tickets about data export — possible migration prep.",crmNotes:"2/12 — VP of Ops (Diana Reeves) called directly, bypassed CSM. Says she is 'exploring options.' 1/28 — Two champions (Jake Morales, Sarah Lin) left within a week. New CTO Raj Patel comes from a competitor background.",supportTranscript:"Caller: Third time calling about data export timing out at 50k rows. Team is evaluating whether to build in-house or switch vendors. Agent: Let me escalate to engineering. Caller: You said that last time.",recentEmail:"From Raj Patel (new CTO): Need to understand current contract terms, what we are locked into, and data portability options. Can someone senior walk me through this week?"},
  {id:2,name:"BrightLoop Logistics",industry:"Logistics",tier:"Growth",arr:75000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:-22,daysSinceLastTouch:95,daysUntilRenewal:42,openTickets:3,npsScore:4,totalTouchpoints:0,lastTouchType:"Email",notes:"Onboarding delayed 6 weeks. Never got a check-in. Usage peaked month 2 then declined. Zero proactive outreach.",crmNotes:"No meaningful entries. Last note 3 months ago: 'Sent onboarding checklist.' Account owner changed twice during onboarding — handoff notes are empty.",supportTranscript:"Caller: Signed up two months ago, still stuck on initial data import. Nobody reached out since welcome call. 200 drivers waiting on route optimization. Agent: Let me connect you with onboarding. Caller: That number rings out.",recentEmail:"From ops lead: Sent three emails over 6 weeks with no response. Team asking if we should cut losses and go back to spreadsheets. I championed this internally and am running out of credibility. Please call me."},
  {id:3,name:"CaseMark Legal AI",industry:"Legal",tier:"Growth",arr:52000,adoptedProducts:["Core Platform"],usageTrend:-15,daysSinceLastTouch:110,daysUntilRenewal:65,openTickets:1,npsScore:5,totalTouchpoints:1,lastTouchType:"Email",notes:"Only one touchpoint ever — the welcome email. Legal firms high-retention if engaged, high-churn if ignored.",crmNotes:"Only entry: 'Auto-generated — welcome email sent 3/15.' No human notes, no call logs, no meeting records. Account assigned but never actively managed.",supportTranscript:"",recentEmail:"Auto-reply from procurement@casemark.ai: Thank you for your message. For vendor relationship matters contact procurement directly. This inbox is not monitored."},
  {id:4,name:"Streamline Commerce",industry:"E-commerce",tier:"Starter",arr:15000,adoptedProducts:["Core Platform"],usageTrend:45,daysSinceLastTouch:35,daysUntilRenewal:180,openTickets:0,npsScore:9,totalTouchpoints:4,lastTouchType:"Call",notes:"Usage grown 45% in 30 days — hitting plan limits. Asked about API access. Team grew from 5 to 18. Textbook upgrade candidate.",crmNotes:"2/20 — CEO Marcus Chen demoed our analytics to his board. Called it 'the backbone of our growth tracking.' Team grew from 5 to 18 in 6 weeks. Hit API rate limits 3 times this week. Asked about enterprise-grade API access.",supportTranscript:"Caller (Marcus): Not a problem — more of a good problem. Growing way faster than expected, keep hitting 1000 req/min limit on Starter plan. Dev team needs 5x that. Also need webhook support to pipe data into internal BI tool. Agent: Available on Growth plan with API Access. Caller: Send me pricing today.",recentEmail:"From Marcus Chen (CEO): Love the product. Just closed seed extension, doubling eng team next month. Need to understand Growth vs Enterprise tiers ASAP. Also interested in Analytics Add-on. Can we get a call this week?"},
  {id:5,name:"DataPulse Insights",industry:"SaaS",tier:"Growth",arr:85000,adoptedProducts:["Core Platform","Analytics Add-on","API Access"],usageTrend:28,daysSinceLastTouch:20,daysUntilRenewal:200,openTickets:0,npsScore:10,totalTouchpoints:8,lastTouchType:"QBR",notes:"Power user. NPS 10. Just raised Series B — headcount doubling. Strong candidate for Premium Support and Custom Integrations.",crmNotes:"2/15 QBR — NPS 10, described us as 'mission-critical infrastructure.' CEO Amy Zhao offered joint case study. Series B closed ($28M), headcount doubling from 40 to 80. Eng lead asked about Premium Support SLA and Custom Integrations for new data pipeline.",supportTranscript:"Caller (Amy): Not a support issue — feedback. API documentation is the best we have worked with. Entire data team relies on analytics endpoints daily. Question: want to understand Custom Integrations for Snowflake and BigQuery connectors as we scale post-Series B. Agent: I will connect you with integrations team. Caller: Perfect. Also tell your PM the new batch endpoint is beautiful.",recentEmail:"From Amy Zhao (CEO): As discussed in QBR, would love to participate in customer advisory board and co-author a case study. Also formally evaluating Premium Support with our Series B growth. Let me know next steps — we are your biggest fans."},
  {id:6,name:"SkillForge Ed",industry:"EdTech",tier:"Starter",arr:8000,adoptedProducts:["Core Platform"],usageTrend:38,daysSinceLastTouch:50,daysUntilRenewal:150,openTickets:0,npsScore:8,totalTouchpoints:3,lastTouchType:"Email",notes:"Small EdTech startup, steep usage trajectory. Founder referred two companies.",crmNotes:"2/10 — Founder Priya Sharma referred two other EdTech startups. Small team (8 people) but usage per seat is 3x average. Asked about education pricing tier or startup program. Very engaged, responds to every email within hours.",supportTranscript:"Caller (Priya): Quick one — can we set up read-only dashboards for school district clients? They want student engagement metrics but should not modify anything. Agent: Available through Analytics Add-on with role-based access. Caller: Did not know about that. Can you send pricing?",recentEmail:"From Priya Sharma (Founder): Teachers are obsessed with engagement tracking. Told friends at LearnLoop and EduMetrics about you — they might reach out. Any chance you do referral credits?"},
  {id:7,name:"Apex Real Estate Tech",industry:"Real Estate",tier:"Enterprise",arr:180000,adoptedProducts:["Core Platform","Analytics Add-on","Custom Integrations","Premium Support"],usageTrend:5,daysSinceLastTouch:45,daysUntilRenewal:18,openTickets:1,npsScore:7,totalTouchpoints:6,lastTouchType:"Meeting",notes:"Renewal in 18 days, no renewal conversation started. Decision-maker changed 3 months ago. Open billing ticket.",crmNotes:"New VP of Technology (Tom Hadley) replaced champion Lisa Grant 3 months ago. Tom has not responded to intro emails. Billing ticket #4521 open 12 days — disputed $4,200 in December overage charges. Renewal in 18 days, no conversation started.",supportTranscript:"Caller (Accounting): Open billing dispute from December — $4,200 in overage charges we believe are incorrect. New VP Tom Hadley will not approve renewal discussions until resolved. Ticket open almost two weeks. Agent: Let me check ticket 4521... assigned but not updated. Caller: Unacceptable for a $180k account.",recentEmail:"Third follow-up attempt to Tom Hadley — no response. Original: Hi Tom, following up on renewal conversation. Contract up in less than 3 weeks. Want to ensure billing issue resolved to your satisfaction. Would love 30 minutes to discuss."},
  {id:8,name:"NovaPay Technologies",industry:"Fintech",tier:"Growth",arr:65000,adoptedProducts:["Core Platform","API Access"],usageTrend:-5,daysSinceLastTouch:30,daysUntilRenewal:22,openTickets:0,npsScore:6,totalTouchpoints:5,lastTouchType:"Call",notes:"Renewal in 22 days. Slight usage dip. Competitor spotted in CTO's LinkedIn tech evaluation doc.",crmNotes:"CTO Derek Woo posted LinkedIn article 'Evaluating Modern API Platforms for Fintech' — mentioned three competitors by name, not us. Sales intel flagged meeting between NovaPay procurement and CompetitorX. Usage slightly down.",supportTranscript:"Caller (Derek): API latency creeping up — p99 at 340ms, used to be under 200ms. For payment processing that is a big deal. Need this looked at before renewal. Also want a technical deep-dive with engineering to understand the roadmap. Agent: I will file a performance ticket.",recentEmail:"From Derek Woo (CTO): Conducting technical evaluation of vendor stack ahead of renewal. Need comprehensive performance report, 2024 API roadmap, and competitive benchmarking data. Presenting to board next week."},
  {id:9,name:"ShopNest Digital",industry:"E-commerce",tier:"Starter",arr:12000,adoptedProducts:["Core Platform"],usageTrend:10,daysSinceLastTouch:5,daysUntilRenewal:300,openTickets:0,npsScore:7,totalTouchpoints:12,lastTouchType:"Call",notes:"Cherry-pick target. Low ARR, no urgency, but 12 touchpoints because they're friendly.",crmNotes:"12 touchpoints logged — mostly casual check-ins initiated by CSM. Contact Jenny Park always available for calls but never requests anything strategic. Last 5 touches were 'routine check-ins' with no action items.",supportTranscript:"Caller (Jenny): Nothing urgent — just asking about the new dashboard theme. The dark mode one? Team thinks it looks cool. Agent: I can walk you through display settings. Caller: Awesome! Any fun product updates coming? Love hearing about new stuff.",recentEmail:"From Jenny Park: Thanks for the call yesterday — always great chatting! Team is happy with everything. No issues on our end. See you next month!"},
  {id:10,name:"CartFlow Online",industry:"E-commerce",tier:"Starter",arr:10000,adoptedProducts:["Core Platform"],usageTrend:8,daysSinceLastTouch:7,daysUntilRenewal:280,openTickets:0,npsScore:8,totalTouchpoints:10,lastTouchType:"Call",notes:"Over-serviced. Friendly contact, no complexity. BrightLoop ($75k) has zero touchpoints meanwhile.",crmNotes:"10 touchpoints — CSM spends 30-45 mins per call. Contact Mike Torres is a talker, no strategic value in conversations. Meanwhile BrightLoop ($75k) and Ironclad ($195k) have 0 and 3 touchpoints respectively.",supportTranscript:"Caller (Mike): Can I change the sidebar color in my dashboard? Minor but team has opinions. Also how do I export CSV of last month data? Think you showed me before but forgot. Agent: Settings > appearance for sidebar, reports > export for CSV. Caller: Amazing, you guys are the best.",recentEmail:"From Mike Torres: Two things: 1) Can we add company logo to reports? 2) Do you have any swag? We would love stickers for the office. Thanks!"},
  {id:11,name:"SwiftCart Retail",industry:"E-commerce",tier:"Starter",arr:11000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:12,daysSinceLastTouch:10,daysUntilRenewal:250,openTickets:0,npsScore:8,totalTouchpoints:9,lastTouchType:"Email",notes:"Third over-serviced Starter e-commerce account. Comfort-zoning pattern.",crmNotes:"9 touchpoints in 6 months — all CSM-initiated. Contact Rachel Kim always positive, no complaints, no asks. CSM logs 'great relationship' after every call. No expansion exploration or strategic conversation attempted.",supportTranscript:"Caller (Rachel): Everything is great honestly. Team loves the mobile app. Just wondering — can we set up automated weekly email reports? We do it manually now. Agent: Yes, under settings > scheduled reports. Caller: Perfect, that is all I needed. You are always so helpful.",recentEmail:"From Rachel Kim: Just wanted to say we love BookSense! Mobile SDK integration was seamless. Retail associates use it daily. If you ever need a testimonial from a small shop, happy to help!"},
  {id:12,name:"TerraForm SaaS",industry:"SaaS",tier:"Enterprise",arr:310000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support","Custom Integrations"],usageTrend:3,daysSinceLastTouch:25,daysUntilRenewal:120,openTickets:0,npsScore:8,totalTouchpoints:10,lastTouchType:"QBR",notes:"Largest account. Healthy, deeply integrated. Should multi-thread — only one contact relationship.",crmNotes:"Largest account ($310k). Single-threaded through VP Eng Carlos Mendez. Carlos is great but if he leaves we have zero relationships. QBR went well — discussed SOC2 compliance needs. Carlos hinted at custom audit trail integrations. No other stakeholders engaged.",supportTranscript:"Caller (Carlos): Compliance team asking about audit trail capabilities — need immutable logging for all API calls for SOC2. Current logging is close but need custom retention policies and tamper-proof export. Becoming a renewal requirement. Also need multi-user admin setup — I am the only admin which is a compliance risk.",recentEmail:"From Carlos Mendez (VP Eng): Ahead of SOC2 audit in Q3, need to discuss custom audit trail integrations and data retention policies. This is becoming a renewal requirement. Also flagging: I am currently single point of contact — we should get our CTO and CISO in the loop."},
  {id:13,name:"CloudNest Solutions",industry:"SaaS",tier:"Growth",arr:55000,adoptedProducts:["Core Platform","Analytics Add-on"],usageTrend:12,daysSinceLastTouch:18,daysUntilRenewal:160,openTickets:0,npsScore:7,totalTouchpoints:6,lastTouchType:"Meeting",notes:"Solid, growing. Could explore API Access and Custom Integrations.",crmNotes:"Solid account, steady growth. Contact Lisa Tran is engaged and proactive. 2/12 meeting — discussed interest in API Access for internal developer platform. Also mentioned evaluating Custom Integrations for Salesforce sync. No urgency but good expansion signals.",supportTranscript:"Caller (Lisa): Building internal developer portal — would API Access let us create custom endpoints on top of analytics data? Want to embed charts into our own product. Agent: Yes, API Access supports embedded analytics. I can set up a demo. Caller: Great. Also interested in the Salesforce connector.",recentEmail:"From Lisa Tran: Following up on API Access discussion. Dev team sketched out how they would use embedded analytics in our portal. Would love a technical walkthrough. Also — is Salesforce Custom Integration available for Growth tier or do we need Enterprise?"},
  {id:14,name:"VitalSign Health",industry:"Healthcare",tier:"Growth",arr:68000,adoptedProducts:["Core Platform","Premium Support"],usageTrend:0,daysSinceLastTouch:40,daysUntilRenewal:90,openTickets:1,npsScore:6,totalTouchpoints:4,lastTouchType:"Email",notes:"Flat usage, 90-day renewal. Needs value reinforcement.",crmNotes:"Flat engagement for 3 months. Contact Dr. James Wu is polite but non-committal. 1/15 — asked about ROI metrics to present to hospital board, never followed up. Renewal in 90 days. Previous champion moved to different department.",supportTranscript:"Caller (IT team): Intermittent sync issues between platform and Epic EHR system. Works most of the time but drops connection every few days. Not critical but clinical staff starting to notice. Agent: I will create a ticket. Caller: Any timeline? Dr. Wu keeps asking.",recentEmail:"From Dr. James Wu: Hospital board reviewing all vendor contracts for annual budget cycle. Need clear ROI report showing impact on patient flow operations. Honestly struggling to articulate the value internally. Any help appreciated."},
  {id:15,name:"Ironclad Manufacturing",industry:"Manufacturing",tier:"Enterprise",arr:195000,adoptedProducts:["Core Platform","Custom Integrations"],usageTrend:-8,daysSinceLastTouch:88,daysUntilRenewal:55,openTickets:2,npsScore:5,totalTouchpoints:3,lastTouchType:"Email",notes:"High-value Enterprise almost completely ignored. Usage declining, 2 unanswered tickets.",crmNotes:"High-value account almost completely ignored. CSM acknowledged avoiding manufacturing accounts ('not my strength'). Last meaningful contact 4 months ago. Tickets #3892 and #3944 unanswered 3+ weeks. Plant manager Steve Kowalski left voicemail 2 weeks ago — never returned.",supportTranscript:"Caller (Steve Kowalski): Called three times, left two voicemails, nobody got back to me. Two open tickets — production dashboard going down during shift changes and incorrect SKU mapping. Costing real money on the floor. Starting to wonder if you even want our business. Agent: I sincerely apologize. Let me escalate both immediately. Caller: Heard that before.",recentEmail:"From Steve Kowalski (Plant Manager): URGENT — Trying to reach account manager for three weeks. Two critical issues affecting production floor operations and ZERO response. $195k account treated like we do not exist. If I do not hear from someone senior by Friday, escalating to procurement to evaluate alternatives."},
  {id:16,name:"PrecisionWorks MFG",industry:"Manufacturing",tier:"Growth",arr:72000,adoptedProducts:["Core Platform","API Access"],usageTrend:-12,daysSinceLastTouch:70,daysUntilRenewal:80,openTickets:2,npsScore:4,totalTouchpoints:2,lastTouchType:"Support Escalation",notes:"Neglected manufacturing account. CSM avoids this industry. Last interaction was unresolved escalation.",crmNotes:"Another neglected manufacturing account. CSM notes: 'Difficult industry, hard to engage.' Last escalation unresolved — plant floor integration broke, workaround never followed up on. Contact Linda Chen (Ops Director) has gone from frustrated to silent.",supportTranscript:"Caller (Linda Chen): The workaround your team gave us for the API integration failure in December is still our solution. Requires manual data entry twice a day. Operators hate it. Was told permanent fix coming in January. It is now late February. Agent: Looking into this... I do not see a follow-up ticket from January. Caller: Exactly my point.",recentEmail:"From Linda Chen (sent 3 weeks ago, no reply): Following up on promised API integration fix from January. Still on manual workaround. Operators spend 45 minutes per shift on manual data entry that should be automated. Need a timeline or we will need to explore other platforms."},
  {id:17,name:"Canopy Learning",industry:"EdTech",tier:"Growth",arr:48000,adoptedProducts:["Core Platform","Analytics Add-on","Mobile SDK"],usageTrend:20,daysSinceLastTouch:55,daysUntilRenewal:100,openTickets:2,npsScore:6,totalTouchpoints:3,lastTouchType:"Call",notes:"Mixed signals. Usage surging but 2 tickets and NPS dropped. Hitting more pain points.",crmNotes:"Mixed signals. Usage surging 20% but two new tickets and NPS dropped from 8 to 6. Contact Omar Farooq (Product Lead) said 'we love the product but it is breaking under our scale.' Mobile SDK added last quarter — integration has bugs. Hitting growing pains.",supportTranscript:"Caller (Omar): Two issues. Mobile SDK crashes on Android 14 when offline mode enabled — field instructors in rural areas rely on that. Analytics dashboard times out past 500 learners — we grew from 200 to 2000 in 3 months. Product is great when it works but we are outgrowing it. Agent: Both sound like scaling issues, involving engineering. Caller: Please — about to launch in three new school districts.",recentEmail:"From Omar Farooq (Product Lead): Love the platform but hitting walls as we scale. Mobile SDK offline crashes and dashboard timeouts blocking expansion into new districts. Growing fast and want to stay — but need engineering to prioritize these fixes. Happy to jump on a call anytime."},
  {id:18,name:"Vellum Media Group",industry:"Media",tier:"Growth",arr:58000,adoptedProducts:["Core Platform","Analytics Add-on"],usageTrend:-3,daysSinceLastTouch:42,daysUntilRenewal:130,openTickets:0,npsScore:7,totalTouchpoints:5,lastTouchType:"Email",notes:"Slight dip, otherwise stable. Light check-in candidate.",crmNotes:"Stable account, slight usage dip (-3%). Contact Nina Patel (Head of Analytics) is responsive but not proactive. Last check-in was surface-level — 'everything is fine.' No strategic conversations in 6 months. Could be silently evaluating alternatives.",supportTranscript:"Caller (Nina): Minor thing — editorial team wants to track content performance by author not just by publication. Is that something Analytics Add-on can do? Agent: Yes, create custom dimensions in analytics settings. Caller: Did not know that. We have probably been underusing analytics features.",recentEmail:"From Nina Patel: Thanks for reaching out. Things are fine, no major issues. Been heads-down on content strategy overhaul so have not been in the platform as much lately. Should pick back up next quarter."},
  {id:19,name:"Ledgerpoint Financial",industry:"Fintech",tier:"Enterprise",arr:150000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support"],usageTrend:7,daysSinceLastTouch:15,daysUntilRenewal:200,openTickets:0,npsScore:9,totalTouchpoints:9,lastTouchType:"QBR",notes:"Best-in-class. Deep adoption, NPS 9, engaged champion. Reference/advisory board candidate.",crmNotes:"Best-in-class account. Champion Sarah Mitchell (Head of Data) deeply embedded — built internal workflows around our API. NPS 10. QBR was outstanding — Sarah presented 20-slide deck on platform usage to their board. Offered to speak at user conference. Interested in advisory board.",supportTranscript:"Caller (Sarah): Not a support issue — feature request. Building real-time fraud detection pipeline on top of API, want early access to streaming analytics beta if still on roadmap. Happy to be design partners. Also tell your PM the new batch processing endpoint is beautiful — team applauded when they saw the docs.",recentEmail:"From Sarah Mitchell (Head of Data): As discussed in QBR, would love to present fraud detection use case at user conference. Built impressive workflows on your API that other customers would benefit from hearing about. Also formally expressing interest in customer advisory board. Let me know next steps."},
  {id:20,name:"RouteWise Shipping",industry:"Logistics",tier:"Starter",arr:18000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:15,daysSinceLastTouch:60,daysUntilRenewal:170,openTickets:1,npsScore:6,totalTouchpoints:2,lastTouchType:"Email",notes:"Growing logistics startup. 60 days silent. Self-serving until something breaks.",crmNotes:"Small logistics startup, self-serve oriented. Contact Alex Drummond (Founder) prefers email over calls. Last engagement 60 days ago — brief email about mobile SDK setup. Growing usage (+15%) but no proactive outreach from our side. One open ticket about GPS tracking accuracy.",supportTranscript:"Caller (Alex): Drivers reporting GPS tracking in mobile app drifting by 200 meters in dense urban areas. Causing delivery confirmation issues — packages showing delivered to wrong addresses. Not a crisis yet but getting worse as we add more routes. Agent: I will escalate to mobile SDK team. Caller: Is this a known issue?",recentEmail:"From Alex Drummond (Founder): GPS drift ticket #5102 — any update? Driver count going from 30 to 75 next month, needs fixing before then. Also — do you have route optimization features in the pipeline? Building it ourselves but would upgrade if you offered it natively."},
];

const CRITERIA = [
  {id:"renewal",label:"Renewal Urgency"},{id:"churn",label:"Churn Risk"},{id:"expansion",label:"Expansion Potential"},
  {id:"engagement",label:"Engagement Gap"},{id:"arrValue",label:"ARR Value"},{id:"supportHealth",label:"Support Health"},
];

function score(a, criteria) {
  const w = {}; criteria.forEach((c,i) => { w[c.id] = 1.0 + (criteria.length-1-i)*0.25; });
  let u=0, r=0, o=0; const reasons = [];
  if(a.daysUntilRenewal<=21){u+=40*w.renewal;reasons.push(`Renewal in ${a.daysUntilRenewal}d`);}
  else if(a.daysUntilRenewal<=45){u+=28*w.renewal;reasons.push(`Renewal in ${a.daysUntilRenewal}d`);}
  else if(a.daysUntilRenewal<=90){u+=12*w.renewal;reasons.push(`Renewal in ${a.daysUntilRenewal}d`);}
  if(a.usageTrend<=-25){r+=35*w.churn;reasons.push(`Usage crashed ${Math.abs(a.usageTrend)}%`);}
  else if(a.usageTrend<=-10){r+=20*w.churn;reasons.push(`Usage declining ${Math.abs(a.usageTrend)}%`);}
  if(a.npsScore<=3){r+=18*w.churn;reasons.push(`NPS ${a.npsScore}/10 — detractor`);}
  else if(a.npsScore<=5){r+=8*w.churn;reasons.push(`NPS ${a.npsScore}/10`);}
  if(a.usageTrend>=30){o+=20*w.expansion;reasons.push(`Usage surging +${a.usageTrend}%`);}
  else if(a.usageTrend>=15){o+=10*w.expansion;reasons.push(`Growth +${a.usageTrend}%`);}
  if(a.tier==="Starter"&&a.usageTrend>=30){o+=18*w.expansion;reasons.push("Starter — upgrade overdue");}
  if(a.adoptedProducts.length<=2&&a.usageTrend>10&&a.tier!=="Enterprise"){o+=15*w.expansion;reasons.push(`${a.adoptedProducts.length}/6 products — cross-sell`);}
  if(a.npsScore>=9){o+=12*w.expansion;reasons.push("Advocate potential");}
  if(a.daysSinceLastTouch>=90){r+=25*w.engagement;reasons.push(`${a.daysSinceLastTouch}d dark`);}
  else if(a.daysSinceLastTouch>=60){r+=15*w.engagement;reasons.push(`${a.daysSinceLastTouch}d since touch`);}
  if(a.totalTouchpoints===0){r+=30*w.engagement;reasons.push("ZERO touchpoints");}
  else if(a.totalTouchpoints<=2&&a.arr>=50000){r+=15*w.engagement;reasons.push(`Only ${a.totalTouchpoints} touches on $${(a.arr/1000)|0}k`);}
  const am=a.arr>=150000?1+0.6*w.arrValue:a.arr>=75000?1+0.3*w.arrValue:a.arr>=40000?1+0.1*w.arrValue:1;
  if(a.openTickets>=3){r+=20*w.supportHealth;reasons.push(`${a.openTickets} open tickets`);}
  else if(a.openTickets>=1){r+=6*w.supportHealth;reasons.push(`${a.openTickets} ticket(s)`);}
  if(a.notes.includes("competitor")||a.notes.includes("Competitor")){r+=15;reasons.push("Competitive threat");}
  if(a.notes.includes("champion")&&a.notes.includes("left")){r+=18;reasons.push("Champion departed");}
  if(a.notes.includes("Series B")||a.notes.includes("headcount")){o+=12;reasons.push("Company scaling");}
  if(a.notes.includes("migration")||a.notes.includes("data export")){r+=20;reasons.push("Migration/export activity");}
  const sc=Math.min(100,Math.round((u+r+o)*am));
  const cat=r>=o&&r>=u?"risk":u>=o?"urgency":"opportunity";
  const rl=sc>=75?"critical":sc>=50?"high":sc>=30?"medium":"low";
  let action="Routine check-in",impact="Maintain cadence";
  if(a.daysUntilRenewal<=30&&(a.usageTrend<-10||a.npsScore<=5)){action=`Emergency save: Call decision-maker. Resolve ${a.openTickets} tickets first.`;impact=`$${(a.arr/1000)|0}k at immediate risk`;}
  else if(a.daysUntilRenewal<=30){action="Start renewal conversation now.";impact=`$${(a.arr/1000)|0}k renewal in ${a.daysUntilRenewal}d`;}
  else if(a.totalTouchpoints===0&&a.usageTrend<0){action=`First outreach: Lead with ${a.industry} benchmarks.`;impact=`$${(a.arr/1000)|0}k with zero relationship`;}
  else if(a.usageTrend>=30&&a.tier==="Starter"){action="Upgrade play: Show plan limits, present Growth ROI.";impact=`~$${((a.arr*1.5)/1000)|0}k expansion`;}
  else if(a.npsScore>=9&&a.usageTrend>0){action="Advocacy: Request case study. Explore cross-sell.";impact=`Reference value + ${6-a.adoptedProducts.length} products`;}
  else if(a.daysSinceLastTouch>=60){action="Re-engage with usage insights.";impact=`$${(a.arr/1000)|0}k going dark`;}
  let dg=null;
  if(a.daysUntilRenewal<=30&&(a.usageTrend<-10||a.npsScore<=5))dg={decision:`Offer discount to save $${(a.arr/1000)|0}k?`,whyHuman:"Commits revenue and sets precedent. AI can't weigh relationship history.",options:["15% discount","Add services","Escalate to VP","Hold pricing"]};
  else if(a.totalTouchpoints===0&&a.arr>=50000)dg={decision:"Acknowledge neglect or start fresh?",whyHuman:"Honesty may build trust or erode confidence.",options:["Acknowledge & recover","Fresh start","White-glove escalation"]};
  return{...a,score:sc,reasons,category:cat,riskLevel:rl,action,impact,decisionGate:dg};
}

const S={bg:"#08080c",sf:"#111118",ra:"#16161f",bd:"#1c1c2a",tx:"#e8e8f0",so:"#a0a0b8",mu:"#6a6a82",dm:"#404058",ac:"#7c5cfc",as:"#9b85fc",ri:"#f43f5e",op:"#10b981",ur:"#f59e0b",wh:"#fff"};
const cc={risk:S.ri,opportunity:S.op,urgency:S.ur};
const rc={critical:S.ri,high:"#fb923c",medium:S.ur,low:S.op};

async function aiDeepDive(a){try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Brief a CSM. ${a.name}|${a.industry}|${a.tier}|$${a.arr}|Usage:${a.usageTrend}%|Touch:${a.daysSinceLastTouch}d|Renewal:${a.daysUntilRenewal}d|Tickets:${a.openTickets}|NPS:${a.npsScore}|Touchpoints:${a.totalTouchpoints}|${a.notes}\nSignals — CRM:${a.crmNotes||""}|Support:${a.supportTranscript||""}|Email:${a.recentEmail||""}\nReturn ONLY JSON:{"headline":"<1 sentence>","brief":"<2 sentence synthesis of CRM notes, support transcript, and email signals — what do these unstructured sources collectively reveal about this account>","assessment":"<3 sentences>","first_action":"<specific>","talking_points":["<3>"],"watch_out":"<risk>"}`}]})});const d=await r.json();return JSON.parse((d.content?.[0]?.text||"").replace(/```json\s*/g,"").replace(/```/g,"").trim());}catch{return null;}}

function Detail({account:a,onBack}){
  const[ai,setAi]=useState(null);const[loading,setLoading]=useState(true);const[dec,setDec]=useState(null);
  useEffect(()=>{setLoading(true);setAi(null);setDec(null);aiDeepDive(a).then(r=>{setAi(r);setLoading(false);});},[a.id]);
  const dg=a.decisionGate;
  return(<div style={{padding:20,maxWidth:840}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:S.as,cursor:"pointer",fontSize:12,marginBottom:14,padding:0}}>← Back</button>
    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:4}}>
      <h2 style={{fontSize:20,fontWeight:700,color:S.tx,margin:0}}>{a.name}</h2>
      <span style={{background:cc[a.category]+"18",color:cc[a.category],border:`1px solid ${cc[a.category]}44`,padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{a.category}</span>
      <span style={{fontSize:9,fontWeight:700,color:rc[a.riskLevel],textTransform:"uppercase"}}>{a.riskLevel}</span>
      <span style={{fontSize:10,color:S.dm,marginLeft:"auto",fontFamily:"monospace"}}>Score: {a.score}/100</span>
    </div>
    <div style={{fontSize:11,color:S.mu,marginBottom:18}}>{a.industry} · {a.tier} · ${a.arr.toLocaleString()} ARR</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
      {[["Usage",`${a.usageTrend>0?"+":""}${a.usageTrend}%`,a.usageTrend<0?S.ri:S.op],["Renewal",`${a.daysUntilRenewal}d`,a.daysUntilRenewal<=30?S.ri:S.mu],["Last Touch",`${a.daysSinceLastTouch}d`,a.daysSinceLastTouch>60?S.ri:S.mu],["NPS",`${a.npsScore}/10`,a.npsScore>=8?S.op:a.npsScore<=4?S.ri:S.ur],["Tickets",a.openTickets,a.openTickets>=2?S.ri:S.mu],["Touches",a.totalTouchpoints,a.totalTouchpoints<=1?S.ri:S.mu]].map(([l,v,c])=>
        <div key={l} style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7,padding:"10px 14px",flex:"1 1 100px",minWidth:100}}>
          <div style={{fontSize:9,color:S.mu,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
          <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
        </div>)}
    </div>
    <div style={{background:S.op+"08",border:`1px solid ${S.op}28`,borderRadius:7,padding:16,marginBottom:12}}>
      <div style={{fontSize:9,fontWeight:700,color:S.op,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>AI Signal Synthesis</div>
      {loading?<div style={{fontSize:11,color:S.mu,fontStyle:"italic"}}>Synthesizing signals...</div>
      :ai?.brief?<div style={{fontSize:12,lineHeight:1.7,color:S.tx,marginBottom:10}}>{ai.brief}</div>:null}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {a.crmNotes&&<div style={{background:S.bg,borderRadius:5,padding:10,borderLeft:`3px solid ${S.ur}`}}>
          <div style={{fontSize:8,fontWeight:700,color:S.ur,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>CRM Notes</div>
          <div style={{fontSize:10,color:S.so,lineHeight:1.5}}>{a.crmNotes}</div></div>}
        {a.supportTranscript&&<div style={{background:S.bg,borderRadius:5,padding:10,borderLeft:`3px solid ${S.as}`}}>
          <div style={{fontSize:8,fontWeight:700,color:S.as,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Support Transcript</div>
          <div style={{fontSize:10,color:S.so,lineHeight:1.5}}>{a.supportTranscript}</div></div>}
        {a.recentEmail&&<div style={{background:S.bg,borderRadius:5,padding:10,borderLeft:`3px solid ${S.mu}`}}>
          <div style={{fontSize:8,fontWeight:700,color:S.mu,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Recent Email</div>
          <div style={{fontSize:10,color:S.so,lineHeight:1.5}}>{a.recentEmail}</div></div>}
      </div>
    </div>
    {loading&&<div style={{background:S.ac+"0d",border:`1px solid ${S.ac}28`,borderRadius:7,padding:14,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
      <span>🤖</span><span style={{fontSize:11,color:S.mu}}>AI generating briefing...</span></div>}
    {ai&&<div style={{background:S.ac+"0d",border:`1px solid ${S.ac}28`,borderRadius:7,padding:16,marginBottom:12}}>
      <div style={{fontSize:14,fontWeight:700,color:S.tx,marginBottom:6}}>"{ai.headline}"</div>
      <p style={{fontSize:12,lineHeight:1.7,color:S.so,margin:"0 0 10px"}}>{ai.assessment}</p>
      <div style={{background:S.bg,borderRadius:5,padding:10,marginBottom:10,borderLeft:`3px solid ${S.ac}`}}>
        <div style={{fontSize:8,fontWeight:700,color:S.as,textTransform:"uppercase",marginBottom:3}}>→ Do First</div>
        <div style={{fontSize:12,color:S.tx}}>{ai.first_action}</div></div>
      {ai.talking_points?.map((t,i)=><div key={i} style={{fontSize:11,color:S.so,padding:"5px 9px",background:S.bg,borderRadius:4,marginBottom:3}}>{t}</div>)}
      {ai.watch_out&&<div style={{fontSize:11,color:S.ur,marginTop:6}}>⚠ {ai.watch_out}</div>}</div>}
    <div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7,padding:16,marginBottom:12}}>
      <div style={{fontSize:9,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:8}}>Signals ({a.reasons.length})</div>
      {a.reasons.map((r,i)=><div key={i} style={{fontSize:11,color:S.tx,padding:"6px 9px",background:S.bg,borderRadius:4,borderLeft:`3px solid ${cc[a.category]}`,marginBottom:3}}>{r}</div>)}</div>
    <div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7,padding:16,marginBottom:12}}>
      <div style={{fontSize:9,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:6}}>Recommended Action</div>
      <div style={{fontSize:12,color:S.tx,marginBottom:4}}>{a.action}</div>
      <div style={{fontSize:11,color:S.ur,fontWeight:600}}>⚡ {a.impact}</div></div>
    {dg&&<div style={{background:S.ri+"08",border:`1px solid ${S.ri}28`,borderRadius:7,padding:16,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span>🛑</span><span style={{fontSize:9,fontWeight:700,color:S.ri,textTransform:"uppercase"}}>Decision Required — AI Cannot Proceed</span></div>
      <div style={{fontSize:13,fontWeight:600,color:S.tx,marginBottom:5}}>{dg.decision}</div>
      <div style={{fontSize:11,color:S.so,marginBottom:12,fontStyle:"italic"}}>Why human: {dg.whyHuman}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {dg.options.map((o,i)=><button key={i} onClick={()=>setDec(o)} style={{padding:"8px 14px",borderRadius:5,fontSize:11,fontWeight:600,cursor:"pointer",background:dec===o?S.ac:"transparent",border:`1px solid ${dec===o?S.ac:S.bd}`,color:dec===o?S.wh:S.so}}>{o}</button>)}</div>
      {dec&&<div style={{marginTop:10,padding:8,background:S.op+"18",border:`1px solid ${S.op}38`,borderRadius:5,fontSize:11,color:S.op,fontWeight:600}}>✓ Recorded: "{dec}"</div>}</div>}
    <div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7,padding:16}}>
      <div style={{fontSize:9,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:8}}>Products ({a.adoptedProducts.length}/{PRODUCTS.length})</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
        {PRODUCTS.map(p=>{const on=a.adoptedProducts.includes(p);return<div key={p} style={{padding:"4px 9px",borderRadius:4,fontSize:10,background:on?S.op+"18":S.bg,color:on?S.op:S.dm,border:`1px solid ${on?S.op+"38":S.bd}`}}>{on?"✓ ":""}{p}</div>;})}</div></div>
  </div>);
}

function Manager({scored,cherry,gaps,actions,outcomes}){
  const ct=Object.values(actions).filter(v=>v==="contacted").length;
  const sk=Object.values(actions).filter(v=>v==="skipped").length;
  const un=scored.length-ct-sk;
  const skHi=scored.filter((_,i)=>i<10&&actions[_.id]==="skipped");
  return(<div style={{padding:20,maxWidth:700}}>
    <h2 style={{fontSize:20,fontWeight:700,color:S.tx,margin:"0 0 4px"}}>Manager Dashboard</h2>
    <p style={{fontSize:12,color:S.mu,marginBottom:18}}>CSM behavioral oversight.</p>
    <div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:8,padding:18,marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:12}}>Today's Activity</div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[[ct,"Contacted",S.op],[sk,"Skipped",S.ri],[un,"Unreviewed",S.dm]].map(([v,l,c])=>
          <div key={l} style={{flex:1,textAlign:"center",padding:12,background:S.bg,borderRadius:6}}>
            <div style={{fontSize:24,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
            <div style={{fontSize:9,color:S.mu,textTransform:"uppercase",marginTop:2}}>{l}</div></div>)}
      </div>
      <div style={{height:6,borderRadius:3,background:S.bd,overflow:"hidden",display:"flex"}}>
        <div style={{width:`${(ct/scored.length)*100}%`,background:S.op}}/><div style={{width:`${(sk/scored.length)*100}%`,background:S.ri}}/></div>
      <div style={{fontSize:9,color:S.dm,marginTop:4}}>{ct+sk} of {scored.length} reviewed</div></div>
    {skHi.length>0&&<div style={{background:S.ri+"08",border:`1px solid ${S.ri}28`,borderRadius:8,padding:18,marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:S.ri,textTransform:"uppercase",marginBottom:10}}>⚠ Behavioral Flags</div>
      <div style={{fontSize:12,color:S.tx}}>High-priority accounts skipped: {skHi.map(a=>a.name).join(", ")}</div></div>}
    {cherry.detected&&<div style={{background:S.ur+"18",border:`1px solid ${S.ur}38`,borderRadius:8,padding:18,marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:S.ur,textTransform:"uppercase",marginBottom:8}}>🔍 Cherry-Picking Detected</div>
      <div style={{fontSize:12,fontWeight:600,color:S.tx,marginBottom:4}}>{cherry.pattern}</div>
      <div style={{fontSize:11,color:S.so,marginBottom:6}}>{cherry.evidence}</div>
      <div style={{fontSize:11,color:S.ur}}><strong>Coaching:</strong> {cherry.rec}</div></div>}
    {gaps.length>0&&<div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:8,padding:18,marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:10}}>Coverage Gaps</div>
      {gaps.map((g,i)=><div key={i} style={{padding:10,background:S.bg,borderRadius:5,borderLeft:`3px solid ${S.ri}`,marginBottom:5}}>
        <div style={{fontSize:12,fontWeight:600,color:S.tx,marginBottom:2}}>{g.desc}</div>
        <div style={{fontSize:10,color:S.ri}}>{g.risk}</div></div>)}</div>}
    {Object.keys(outcomes).length>0&&<div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:8,padding:18}}>
      <div style={{fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:10}}>Outcome Log</div>
      {Object.entries(outcomes).map(([id,o])=>{const acc=scored.find(a=>a.id===Number(id));const oc=o.rating==="positive"?S.op:o.rating==="neutral"?S.ur:S.ri;return acc?<div key={id} style={{padding:10,background:S.bg,borderRadius:5,borderLeft:`3px solid ${oc}`,marginBottom:5,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:oc,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:600,color:S.tx}}>{acc.name} <span style={{fontSize:9,color:oc,textTransform:"uppercase",fontWeight:700}}>{o.rating}</span></div>
          {o.note&&<div style={{fontSize:10,color:S.so,marginTop:2}}>{o.note}</div>}</div>
      </div>:null;})}</div>}
  </div>);
}

function CriteriaPage({criteria,setCriteria,onBack}){
  const di=useRef(null),dv=useRef(null);
  return(<div style={{padding:20,maxWidth:560}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:S.as,cursor:"pointer",fontSize:12,marginBottom:14,padding:0}}>← Back</button>
    <h2 style={{fontSize:20,fontWeight:700,color:S.tx,marginBottom:4}}>AI Decision Criteria</h2>
    <p style={{fontSize:12,color:S.mu,marginBottom:20}}>Drag to reorder. #1 has most influence. Board re-ranks instantly.</p>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {criteria.map((c,i)=>{const inf=Math.round(100-(i/(criteria.length-1))*60);return(
        <div key={c.id} draggable onDragStart={()=>di.current=i} onDragEnter={()=>dv.current=i} onDragOver={e=>e.preventDefault()}
          onDragEnd={()=>{const l=[...criteria];const d=l.splice(di.current,1)[0];l.splice(dv.current,0,d);setCriteria(l);}}
          style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:8,padding:"14px 16px",cursor:"grab",display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:14,color:S.dm}}>⠿</div>
          <div style={{fontSize:11,fontWeight:700,color:i===0?S.as:S.mu,fontFamily:"monospace",width:20}}>#{i+1}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:S.tx}}>{c.label}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:48,height:4,borderRadius:2,background:S.bd,overflow:"hidden"}}>
              <div style={{width:`${inf}%`,height:"100%",background:i===0?S.ac:S.mu,borderRadius:2}}/></div>
            <span style={{fontSize:10,color:S.dm,fontFamily:"monospace",width:28}}>{inf}%</span></div>
        </div>);})}</div>
    <div style={{marginTop:20,padding:14,background:S.ac+"0d",border:`1px solid ${S.ac}28`,borderRadius:8}}>
      <div style={{fontSize:10,fontWeight:700,color:S.as,textTransform:"uppercase",marginBottom:6}}>Strategy examples</div>
      <div style={{fontSize:11,color:S.so,lineHeight:1.7}}>
        <strong style={{color:S.tx}}>Retention quarter:</strong> Drag Churn Risk to top.<br/>
        <strong style={{color:S.tx}}>Growth quarter:</strong> Drag Expansion Potential to #1.</div></div>
  </div>);
}

function Welcome({onRun}){
  const[running,setRunning]=useState(false);
  const today=new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  return(<div style={{minHeight:"100vh",background:S.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",maxWidth:460}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:32}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:S.ac,boxShadow:`0 0 20px ${S.ac}`}}/>
        <span style={{fontSize:24,fontWeight:700,color:S.tx}}>BookSense</span></div>
      <h1 style={{fontSize:28,fontWeight:700,color:S.tx,marginBottom:8}}>Good morning, Gurveen</h1>
      <p style={{fontSize:14,color:S.mu,marginBottom:6}}>{today}</p>
      <p style={{fontSize:14,color:S.so,marginBottom:36}}><span style={{color:S.tx,fontWeight:600}}>20 accounts</span> ready for AI prioritization.</p>
      {!running?<button onClick={()=>{setRunning(true);setTimeout(onRun,1800);}} style={{padding:"14px 36px",borderRadius:8,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${S.ac},#6344e0)`,color:S.wh,fontSize:15,fontWeight:700,boxShadow:`0 4px 24px ${S.ac}59`}}>Run Prioritization</button>
      :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{display:"flex",gap:5}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:S.ac,animation:`bp 1.4s ease ${i*.12}s infinite`}}/>)}</div>
        <div style={{fontSize:13,color:S.so}}>Analyzing all accounts...</div></div>}
    </div></div>);
}

export default function BookSense(){
  const[phase,setPhase]=useState("welcome");
  const[view,setView]=useState("board");
  const[selected,setSelected]=useState(null);
  const[filter,setFilter]=useState("all");
  const[search,setSearch]=useState("");
  const[criteria,setCriteria]=useState(CRITERIA);
  const[actions,setActions]=useState({});
  const[outcomes,setOutcomes]=useState({});
  const[outcomeModal,setOutcomeModal]=useState(null);
  const[outcomeNote,setOutcomeNote]=useState("");

  const scored=useMemo(()=>ACCOUNTS.map(a=>score(a,criteria)).sort((a,b)=>b.score-a.score),[criteria]);
  const cherry=useMemo(()=>{
    const ov=scored.filter(a=>a.totalTouchpoints>=8&&a.arr<=15000),un=scored.filter(a=>a.totalTouchpoints<=2&&a.arr>=50000);
    if(ov.length>=2&&un.length>=2)return{detected:true,pattern:"CSM over-indexes on low-value E-commerce while neglecting high-value Manufacturing/Logistics.",evidence:`Over-serviced: ${ov.map(a=>`${a.name} (${a.totalTouchpoints} touches, $${(a.arr/1000)}k)`).join(", ")}. Under-serviced: ${un.map(a=>`${a.name} (${a.totalTouchpoints} touches, $${(a.arr/1000)}k)`).join(", ")}. 10x ARR gap.`,rec:"No $50k+ account goes 30 days untouched. Redistribute from Starters."};
    return{detected:false};
  },[scored]);
  const gaps=useMemo(()=>{
    const g=[];const zt=scored.filter(a=>a.totalTouchpoints===0);
    if(zt.length)g.push({desc:`${zt.length} account(s) with zero touchpoints`,risk:`$${(zt.reduce((s,a)=>s+a.arr,0)/1000)|0}k unmanaged`});
    const mfg=scored.filter(a=>a.industry==="Manufacturing");
    if(mfg.length>=2&&mfg.reduce((s,a)=>s+a.totalTouchpoints,0)/mfg.length<3)g.push({desc:"Manufacturing vertical neglected",risk:`$${(mfg.reduce((s,a)=>s+a.arr,0)/1000)|0}k avoided`});
    const nr=scored.filter(a=>a.daysUntilRenewal<=30&&a.daysSinceLastTouch>=30);
    if(nr.length)g.push({desc:"Imminent renewals without contact",risk:`$${(nr.reduce((s,a)=>s+a.arr,0)/1000)|0}k renewing unengaged`});
    return g;
  },[scored]);
  const summary=useMemo(()=>{
    const t=scored.reduce((s,a)=>s+a.arr,0),r=scored.filter(a=>a.category==="risk").reduce((s,a)=>s+a.arr,0),c=scored.filter(a=>a.riskLevel==="critical").length;
    return`$${(t/1e6).toFixed(1)}M total ARR with $${(r/1000)|0}k at risk across ${c} critical accounts. Top threat: Meridian Health ($240k) — usage down 34%, champion departed, renewal in 28 days. ${cherry.detected?"Cherry-picking detected: $33k Starter e-commerce over-serviced while $322k Enterprise/Manufacturing neglected. ":""}Priority: redirect to critical accounts this week.`;
  },[scored,cherry]);

  const filtered=scored.filter(a=>(filter==="all"||a.category===filter)&&(!search||a.name.toLowerCase().includes(search.toLowerCase())||a.industry.toLowerCase().includes(search.toLowerCase())));
  const counts={risk:0,opportunity:0,urgency:0};scored.forEach(a=>{if(counts[a.category]!==undefined)counts[a.category]++;});
  const totalARR=scored.reduce((s,a)=>s+a.arr,0);
  const zt=scored.filter(a=>a.totalTouchpoints===0).length;
  const dark=scored.filter(a=>a.daysSinceLastTouch>60).length;

  if(phase==="welcome")return<><style>{`*{box-sizing:border-box;margin:0}@keyframes bp{0%,100%{opacity:.2}50%{opacity:1}}`}</style><Welcome onRun={()=>setPhase("app")}/></>;

  return(<div style={{minHeight:"100vh",background:S.bg,color:S.tx,fontFamily:"-apple-system,'Segoe UI',sans-serif"}}>
    <style>{`*{box-sizing:border-box;margin:0}@keyframes bp{0%,100%{opacity:.2}50%{opacity:1}}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${S.bd};border-radius:3px}`}</style>
    <div style={{borderBottom:`1px solid ${S.bd}`,padding:"11px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:S.ac,boxShadow:`0 0 8px ${S.ac}`}}/>
        <span style={{fontSize:14,fontWeight:700}}>BookSense</span></div>
      <div style={{display:"flex",gap:2}}>
        {[{k:"board",l:"Action Board"},{k:"manager",l:"Manager"},{k:"criteria",l:"⚙ AI Criteria"}].map(t=>
          <button key={t.k} onClick={()=>{setView(t.k);setSelected(null);}} style={{padding:"5px 12px",borderRadius:5,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,background:view===t.k?S.ac:"transparent",color:view===t.k?S.wh:S.mu}}>{t.l}</button>)}</div></div>
    {view==="detail"&&selected?<Detail account={selected} onBack={()=>setView("board")}/>
    :view==="manager"?<Manager scored={scored} cherry={cherry} gaps={gaps} actions={actions} outcomes={outcomes}/>
    :view==="criteria"?<CriteriaPage criteria={criteria} setCriteria={setCriteria} onBack={()=>setView("board")}/>
    :<div style={{padding:"18px 24px"}}>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["Book ARR",`$${(totalARR/1e6).toFixed(1)}M`],["Accounts",scored.length],["Zero-Touch",zt,zt?S.ri:S.op],["Gone Dark",dark,dark?S.ur:S.op]].map(([l,v,c])=>
          <div key={l} style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7,padding:"11px 14px",flex:"1 1 105px",minWidth:105}}>
            <div style={{fontSize:9,color:S.mu,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
            <div style={{fontSize:19,fontWeight:700,color:c||S.tx,fontFamily:"monospace"}}>{v}</div></div>)}</div>
      <div style={{background:S.ac+"0d",border:`1px solid ${S.ac}28`,borderRadius:7,padding:14,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          <span style={{fontSize:11}}>🤖</span><span style={{fontSize:9,fontWeight:700,color:S.as,textTransform:"uppercase"}}>Portfolio Assessment</span></div>
        <p style={{fontSize:12,lineHeight:1.7,color:S.tx,margin:0}}>{summary}</p></div>
      <h2 style={{fontSize:19,fontWeight:700,marginBottom:3}}>Daily Action Board</h2>
      <p style={{fontSize:11,color:S.mu,marginBottom:12}}>Click any row for deep briefing. Mark contacted ✓ or skipped ✗.</p>
      <div style={{display:"flex",gap:5,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"5px 10px",borderRadius:5,border:`1px solid ${S.bd}`,background:S.sf,color:S.tx,fontSize:11,width:140,outline:"none"}}/>
        {[{k:"all",l:`All (${scored.length})`},{k:"risk",l:`Risk (${counts.risk})`,c:S.ri},{k:"opportunity",l:`Opp (${counts.opportunity})`,c:S.op},{k:"urgency",l:`Urgent (${counts.urgency})`,c:S.ur}].map(f=>
          <button key={f.k} onClick={()=>setFilter(f.k)} style={{padding:"4px 9px",borderRadius:4,fontSize:10,fontWeight:600,cursor:"pointer",background:filter===f.k?(f.c||S.ac)+"18":"transparent",border:`1px solid ${filter===f.k?(f.c||S.ac):S.bd}`,color:filter===f.k?(f.c||S.as):S.mu}}>{f.l}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"32px 1.5fr 68px 48px 52px 68px 52px 1fr 60px",padding:"5px 12px",borderBottom:`1px solid ${S.bd}44`,gap:5}}>
        {["#","Account","ARR","Usage","Renew","Signal","Risk","Action","Status"].map(h=>
          <div key={h} style={{fontSize:8,fontWeight:700,color:S.dm,textTransform:"uppercase",letterSpacing:".08em"}}>{h}</div>)}</div>
      {filtered.map((a,idx)=>{const st=actions[a.id];return(
        <div key={a.id} style={{display:"grid",gridTemplateColumns:"32px 1.5fr 68px 48px 52px 68px 52px 1fr 60px",padding:"9px 12px",borderBottom:`1px solid ${S.bd}`,cursor:"pointer",gap:5,alignItems:"center",animation:`fi 0.2s ease ${idx*.02}s both`,opacity:st==="skipped"?0.35:1,background:st==="contacted"?S.op+"0a":"transparent"}}
          onMouseEnter={e=>{if(!st)e.currentTarget.style.background=S.ra}} onMouseLeave={e=>{e.currentTarget.style.background=st==="contacted"?S.op+"0a":"transparent"}}>
          <div onClick={()=>{setSelected(a);setView("detail");}} style={{fontSize:11,fontWeight:700,color:idx<3?S.ri:idx<7?S.ur:S.dm,fontFamily:"monospace"}}>#{idx+1}</div>
          <div onClick={()=>{setSelected(a);setView("detail");}}>
            <div style={{fontSize:12,fontWeight:600,color:S.tx,marginBottom:1}}>{a.name}</div>
            <div style={{fontSize:9,color:S.mu}}>{a.industry} · {a.tier}</div></div>
          <div style={{fontSize:10,fontWeight:600,fontFamily:"monospace",color:S.tx}}>${(a.arr/1000)|0}k</div>
          <div style={{fontSize:10,fontWeight:600,fontFamily:"monospace",color:a.usageTrend<0?S.ri:S.op}}>{a.usageTrend>0?"+":""}{a.usageTrend}%</div>
          <div style={{fontSize:10,fontFamily:"monospace",color:a.daysUntilRenewal<=30?S.ri:a.daysUntilRenewal<=60?S.ur:S.mu}}>{a.daysUntilRenewal}d</div>
          <span style={{background:cc[a.category]+"18",color:cc[a.category],border:`1px solid ${cc[a.category]}44`,padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{a.category}</span>
          <div style={{fontSize:9,fontWeight:600,color:rc[a.riskLevel]}}>{a.riskLevel}</div>
          <div onClick={()=>{setSelected(a);setView("detail");}} style={{fontSize:10,color:S.so,lineHeight:1.35,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{a.action}</div>
          <div style={{display:"flex",gap:3,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>{if(st==="contacted"){setActions(p=>({...p,[a.id]:undefined}));setOutcomes(p=>{const n={...p};delete n[a.id];return n;});}else{setOutcomeModal(a.id);setOutcomeNote("");}}} style={{width:26,height:22,borderRadius:4,border:`1px solid ${st==="contacted"?S.op:S.bd}`,cursor:"pointer",background:st==="contacted"?S.op+"18":"transparent",color:st==="contacted"?S.op:S.dm,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</button>
            <button onClick={()=>setActions(p=>({...p,[a.id]:p[a.id]==="skipped"?undefined:"skipped"}))} style={{width:26,height:22,borderRadius:4,border:`1px solid ${st==="skipped"?S.ri:S.bd}`,cursor:"pointer",background:st==="skipped"?S.ri+"18":"transparent",color:st==="skipped"?S.ri:S.dm,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✗</button>
            {outcomes[a.id]&&<div style={{width:7,height:7,borderRadius:"50%",background:outcomes[a.id].rating==="positive"?S.op:outcomes[a.id].rating==="neutral"?S.ur:S.ri}}/>}</div>
        </div>);})}
      <div style={{marginTop:20,padding:14,background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          <div><div style={{fontSize:8,fontWeight:700,color:S.as,textTransform:"uppercase",marginBottom:5}}>🤖 AI owns</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Signal aggregation, priority scoring, cherry-picking detection, coverage gaps, per-account briefings, decision gate identification.</div></div>
          <div><div style={{fontSize:8,fontWeight:700,color:S.op,textTransform:"uppercase",marginBottom:5}}>👤 Human can now</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Manage 300 accounts with data-driven prioritization. Prep any call in 60s. Catch churn before it happens. Configure AI strategy per quarter.</div></div>
          <div><div style={{fontSize:8,fontWeight:700,color:S.ri,textTransform:"uppercase",marginBottom:5}}>🛑 AI stops here</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Discount decisions. Escalation. Churn save negotiation. Contract terms. Requires relationship context and resource authority.</div></div></div></div>
    </div>}
    {outcomeModal!==null&&(()=>{const ma=scored.find(x=>x.id===outcomeModal);return<div onClick={()=>setOutcomeModal(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
      <div onClick={e=>e.stopPropagation()} style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:10,padding:24,width:340,maxWidth:"90vw"}}>
        <div style={{fontSize:14,fontWeight:700,color:S.tx,marginBottom:4}}>Outcome Capture</div>
        <div style={{fontSize:11,color:S.mu,marginBottom:16}}>{ma?.name}</div>
        <div style={{fontSize:9,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:8}}>Rate this interaction</div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["positive","Positive",S.op],["neutral","Neutral",S.ur],["negative","Negative",S.ri]].map(([k,l,c])=>
            <button key={k} onClick={()=>{setActions(p=>({...p,[outcomeModal]:"contacted"}));setOutcomes(p=>({...p,[outcomeModal]:{rating:k,note:outcomeNote}}));setOutcomeModal(null);}} style={{flex:1,padding:"10px 0",borderRadius:6,border:`1px solid ${c}44`,cursor:"pointer",background:c+"18",color:c,fontSize:12,fontWeight:700}}>{l}</button>)}</div>
        <input placeholder="Optional note..." value={outcomeNote} onChange={e=>setOutcomeNote(e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:5,border:`1px solid ${S.bd}`,background:S.bg,color:S.tx,fontSize:11,outline:"none",boxSizing:"border-box"}}/>
        <button onClick={()=>setOutcomeModal(null)} style={{marginTop:10,background:"none",border:"none",color:S.dm,cursor:"pointer",fontSize:10,padding:0}}>Cancel</button>
      </div></div>;})()}
  </div>);
}