        {/* {planStatus === 'NA' ? ((counterAiReport && counterAiReport === 1) && (counterApiInteraction && counterApiInteraction == 1) && <ProFeature />) */}
export const plans = [
    {
        name: "LITE",
        color: "#14d3b0",
        features: {
            apiHits: "10/day",
            reportGen: "2/day",
            smartSearch: true,
            webSearch: false,
            research: false,
        },
    },
    {
        name: "PRO",
        color: "#ffd600",
        features: {
            apiHits: "20/day",
            reportGen: "5/day",
            smartSearch: true,
            webSearch: true,
            research: false,
        },
    },
    {
        name: "PRO+",
        color: "#ff4376",
        features: {
            apiHits: "Unlimited",
            reportGen: "Unlimited",
            smartSearch: true,
            webSearch: true,
            research: true,
        },
    },
];




const currentPlan = localStorage.getItem("currentPlan") || "LITE";
const activePlan = plans.find(p => p.name === currentPlan) || plans[0];

// Extract numeric limits
const reportLimit = activePlan.features.reportGen === "Unlimited" 
  ? Infinity 
  : parseInt(activePlan.features.reportGen);

const apiLimit = activePlan.features.apiHits === "Unlimited" 
  ? Infinity 
  : parseInt(activePlan.features.apiHits);



{planStatus === "NA" &&
  counterAiReport >= reportLimit &&
  counterApiInteraction >= apiLimit && (
    <ProFeature />
)}

