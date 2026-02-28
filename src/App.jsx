import { useState, useEffect, useMemo, useRef } from "react";

const PRODUCTS = ["Core Platform","Analytics Add-on","API Access","Premium Support","Custom Integrations","Mobile SDK"];
const ACCOUNTS = [
  {id:1,name:"Meridian Health Systems",industry:"Healthcare",tier:"Enterprise",arr:240000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support"],usageTrend:-34,daysSinceLastTouch:78,daysUntilRenewal:28,openTickets:4,npsScore:3,totalTouchpoints:2,lastTouchType:"Support Escalation",notes:"VP of Ops raised performance complaints. Two champions left in Jan. New CTO evaluating competitors. Support tickets about data export — possible migration prep."},
  {id:2,name:"BrightLoop Logistics",industry:"Logistics",tier:"Growth",arr:75000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:-22,daysSinceLastTouch:95,daysUntilRenewal:42,openTickets:3,npsScore:4,totalTouchpoints:0,lastTouchType:"Email",notes:"Onboarding delayed 6 weeks. Never got a check-in. Usage peaked month 2 then declined. Zero proactive outreach."},
  {id:3,name:"CaseMark Legal AI",industry:"Legal",tier:"Growth",arr:52000,adoptedProducts:["Core Platform"],usageTrend:-15,daysSinceLastTouch:110,daysUntilRenewal:65,openTickets:1,npsScore:5,totalTouchpoints:1,lastTouchType:"Email",notes:"Only one touchpoint ever — the welcome email. Legal firms high-retention if engaged, high-churn if ignored."},
  {id:4,name:"Streamline Commerce",industry:"E-commerce",tier:"Starter",arr:15000,adoptedProducts:["Core Platform"],usageTrend:45,daysSinceLastTouch:35,daysUntilRenewal:180,openTickets:0,npsScore:9,totalTouchpoints:4,lastTouchType:"Call",notes:"Usage grown 45% in 30 days — hitting plan limits. Asked about API access. Team grew from 5 to 18. Textbook upgrade candidate."},
  {id:5,name:"DataPulse Insights",industry:"SaaS",tier:"Growth",arr:85000,adoptedProducts:["Core Platform","Analytics Add-on","API Access"],usageTrend:28,daysSinceLastTouch:20,daysUntilRenewal:200,openTickets:0,npsScore:10,totalTouchpoints:8,lastTouchType:"QBR",notes:"Power user. NPS 10. Just raised Series B — headcount doubling. Strong candidate for Premium Support and Custom Integrations."},
  {id:6,name:"SkillForge Ed",industry:"EdTech",tier:"Starter",arr:8000,adoptedProducts:["Core Platform"],usageTrend:38,daysSinceLastTouch:50,daysUntilRenewal:150,openTickets:0,npsScore:8,totalTouchpoints:3,lastTouchType:"Email",notes:"Small EdTech startup, steep usage trajectory. Founder referred two companies."},
  {id:7,name:"Apex Real Estate Tech",industry:"Real Estate",tier:"Enterprise",arr:180000,adoptedProducts:["Core Platform","Analytics Add-on","Custom Integrations","Premium Support"],usageTrend:5,daysSinceLastTouch:45,daysUntilRenewal:18,openTickets:1,npsScore:7,totalTouchpoints:6,lastTouchType:"Meeting",notes:"Renewal in 18 days, no renewal conversation started. Decision-maker changed 3 months ago. Open billing ticket."},
  {id:8,name:"NovaPay Technologies",industry:"Fintech",tier:"Growth",arr:65000,adoptedProducts:["Core Platform","API Access"],usageTrend:-5,daysSinceLastTouch:30,daysUntilRenewal:22,openTickets:0,npsScore:6,totalTouchpoints:5,lastTouchType:"Call",notes:"Renewal in 22 days. Slight usage dip. Competitor spotted in CTO's LinkedIn tech evaluation doc."},
  {id:9,name:"ShopNest Digital",industry:"E-commerce",tier:"Starter",arr:12000,adoptedProducts:["Core Platform"],usageTrend:10,daysSinceLastTouch:5,daysUntilRenewal:300,openTickets:0,npsScore:7,totalTouchpoints:12,lastTouchType:"Call",notes:"Cherry-pick target. Low ARR, no urgency, but 12 touchpoints because they're friendly."},
  {id:10,name:"CartFlow Online",industry:"E-commerce",tier:"Starter",arr:10000,adoptedProducts:["Core Platform"],usageTrend:8,daysSinceLastTouch:7,daysUntilRenewal:280,openTickets:0,npsScore:8,totalTouchpoints:10,lastTouchType:"Call",notes:"Over-serviced. Friendly contact, no complexity. BrightLoop ($75k) has zero touchpoints meanwhile."},
  {id:11,name:"SwiftCart Retail",industry:"E-commerce",tier:"Starter",arr:11000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:12,daysSinceLastTouch:10,daysUntilRenewal:250,openTickets:0,npsScore:8,totalTouchpoints:9,lastTouchType:"Email",notes:"Third over-serviced Starter e-commerce account. Comfort-zoning pattern."},
  {id:12,name:"TerraForm SaaS",industry:"SaaS",tier:"Enterprise",arr:310000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support","Custom Integrations"],usageTrend:3,daysSinceLastTouch:25,daysUntilRenewal:120,openTickets:0,npsScore:8,totalTouchpoints:10,lastTouchType:"QBR",notes:"Largest account. Healthy, deeply integrated. Should multi-thread — only one contact relationship."},
  {id:13,name:"CloudNest Solutions",industry:"SaaS",tier:"Growth",arr:55000,adoptedProducts:["Core Platform","Analytics Add-on"],usageTrend:12,daysSinceLastTouch:18,daysUntilRenewal:160,openTickets:0,npsScore:7,totalTouchpoints:6,lastTouchType:"Meeting",notes:"Solid, growing. Could explore API Access and Custom Integrations."},
  {id:14,name:"VitalSign Health",industry:"Healthcare",tier:"Growth",arr:68000,adoptedProducts:["Core Platform","Premium Support"],usageTrend:0,daysSinceLastTouch:40,daysUntilRenewal:90,openTickets:1,npsScore:6,totalTouchpoints:4,lastTouchType:"Email",notes:"Flat usage, 90-day renewal. Needs value reinforcement."},
  {id:15,name:"Ironclad Manufacturing",industry:"Manufacturing",tier:"Enterprise",arr:195000,adoptedProducts:["Core Platform","Custom Integrations"],usageTrend:-8,daysSinceLastTouch:88,daysUntilRenewal:55,openTickets:2,npsScore:5,totalTouchpoints:3,lastTouchType:"Email",notes:"High-value Enterprise almost completely ignored. Usage declining, 2 unanswered tickets."},
  {id:16,name:"PrecisionWorks MFG",industry:"Manufacturing",tier:"Growth",arr:72000,adoptedProducts:["Core Platform","API Access"],usageTrend:-12,daysSinceLastTouch:70,daysUntilRenewal:80,openTickets:2,npsScore:4,totalTouchpoints:2,lastTouchType:"Support Escalation",notes:"Neglected manufacturing account. CSM avoids this industry. Last interaction was unresolved escalation."},
  {id:17,name:"Canopy Learning",industry:"EdTech",tier:"Growth",arr:48000,adoptedProducts:["Core Platform","Analytics Add-on","Mobile SDK"],usageTrend:20,daysSinceLastTouch:55,daysUntilRenewal:100,openTickets:2,npsScore:6,totalTouchpoints:3,lastTouchType:"Call",notes:"Mixed signals. Usage surging but 2 tickets and NPS dropped. Hitting more pain points."},
  {id:18,name:"Vellum Media Group",industry:"Media",tier:"Growth",arr:58000,adoptedProducts:["Core Platform","Analytics Add-on"],usageTrend:-3,daysSinceLastTouch:42,daysUntilRenewal:130,openTickets:0,npsScore:7,totalTouchpoints:5,lastTouchType:"Email",notes:"Slight dip, otherwise stable. Light check-in candidate."},
  {id:19,name:"Ledgerpoint Financial",industry:"Fintech",tier:"Enterprise",arr:150000,adoptedProducts:["Core Platform","Analytics Add-on","API Access","Premium Support"],usageTrend:7,daysSinceLastTouch:15,daysUntilRenewal:200,openTickets:0,npsScore:9,totalTouchpoints:9,lastTouchType:"QBR",notes:"Best-in-class. Deep adoption, NPS 9, engaged champion. Reference/advisory board candidate."},
  {id:20,name:"RouteWise Shipping",industry:"Logistics",tier:"Starter",arr:18000,adoptedProducts:["Core Platform","Mobile SDK"],usageTrend:15,daysSinceLastTouch:60,daysUntilRenewal:170,openTickets:1,npsScore:6,totalTouchpoints:2,lastTouchType:"Email",notes:"Growing logistics startup. 60 days silent. Self-serving until something breaks."},
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

async function aiDeepDive(a){try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Brief a CSM. ${a.name}|${a.industry}|${a.tier}|$${a.arr}|Usage:${a.usageTrend}%|Touch:${a.daysSinceLastTouch}d|Renewal:${a.daysUntilRenewal}d|Tickets:${a.openTickets}|NPS:${a.npsScore}|Touchpoints:${a.totalTouchpoints}|${a.notes}\nReturn ONLY JSON:{"headline":"<1 sentence>","assessment":"<3 sentences>","first_action":"<specific>","talking_points":["<3>"],"watch_out":"<risk>"}`}]})});const d=await r.json();return JSON.parse((d.content?.[0]?.text||"").replace(/```json\s*/g,"").replace(/```/g,"").trim());}catch{return null;}}

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

function Manager({scored,cherry,gaps,actions}){
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
    {gaps.length>0&&<div style={{background:S.sf,border:`1px solid ${S.bd}`,borderRadius:8,padding:18}}>
      <div style={{fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",marginBottom:10}}>Coverage Gaps</div>
      {gaps.map((g,i)=><div key={i} style={{padding:10,background:S.bg,borderRadius:5,borderLeft:`3px solid ${S.ri}`,marginBottom:5}}>
        <div style={{fontSize:12,fontWeight:600,color:S.tx,marginBottom:2}}>{g.desc}</div>
        <div style={{fontSize:10,color:S.ri}}>{g.risk}</div></div>)}</div>}
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
    :view==="manager"?<Manager scored={scored} cherry={cherry} gaps={gaps} actions={actions}/>
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
          <div style={{display:"flex",gap:3}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setActions(p=>({...p,[a.id]:p[a.id]==="contacted"?undefined:"contacted"}))} style={{width:26,height:22,borderRadius:4,border:`1px solid ${st==="contacted"?S.op:S.bd}`,cursor:"pointer",background:st==="contacted"?S.op+"18":"transparent",color:st==="contacted"?S.op:S.dm,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✓</button>
            <button onClick={()=>setActions(p=>({...p,[a.id]:p[a.id]==="skipped"?undefined:"skipped"}))} style={{width:26,height:22,borderRadius:4,border:`1px solid ${st==="skipped"?S.ri:S.bd}`,cursor:"pointer",background:st==="skipped"?S.ri+"18":"transparent",color:st==="skipped"?S.ri:S.dm,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✗</button></div>
        </div>);})}
      <div style={{marginTop:20,padding:14,background:S.sf,border:`1px solid ${S.bd}`,borderRadius:7}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          <div><div style={{fontSize:8,fontWeight:700,color:S.as,textTransform:"uppercase",marginBottom:5}}>🤖 AI owns</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Signal aggregation, priority scoring, cherry-picking detection, coverage gaps, per-account briefings, decision gate identification.</div></div>
          <div><div style={{fontSize:8,fontWeight:700,color:S.op,textTransform:"uppercase",marginBottom:5}}>👤 Human can now</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Manage 300 accounts with data-driven prioritization. Prep any call in 60s. Catch churn before it happens. Configure AI strategy per quarter.</div></div>
          <div><div style={{fontSize:8,fontWeight:700,color:S.ri,textTransform:"uppercase",marginBottom:5}}>🛑 AI stops here</div><div style={{fontSize:10,color:S.mu,lineHeight:1.6}}>Discount decisions. Escalation. Churn save negotiation. Contract terms. Requires relationship context and resource authority.</div></div></div></div>
    </div>}
  </div>);
}