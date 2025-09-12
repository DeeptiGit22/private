import { plans } from "../config/plan"; // adjust path as needed

{/* Plan Field */}
<div className="form-section">
  <label style={mode === "create" ? { color: "#484848" } : {}}>
    Upgrade Plan to
  </label>
  <select
    style={mode === "create" ? { color: "#484848" } : {}}
    value={plan}
    onChange={onPlanChange}
    disabled={mode === "resubmit"}
    name="plan"
  >
    <option value="">Select a plan</option>
    {plans.map((p, idx) => (
      <option key={idx} value={p.name}>
        {p.name}
      </option>
    ))}
  </select>
</div>





<UpgradeRequestForm
  mode="create"
  title="Create Upgrade Request"
  plan={formData.plan}
  justification={formData.description}
  comment={formData.comment}
  onPlanChange={(e) => handleChange("plan", e.target.value)}
  onJustificationChange={(e) =>
    handleChange("description", e.target.value)
  }
  onFileSelect={handleUpgradeFileSelect}
  attachment={upgradeFiles}
  onSubmit={handleSubmit}
  loading={loading}
/>

