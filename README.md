import React, { useRef } from "react";
import "./ProStyle.css";

function UpgradeRequestForm({
  mode, // 'view', 'resubmit', 'create'
  title,
  plan,
  requester,
  rejectJustification,
  justification,
  comment,
  attachment,
  onPlanChange,
  onJustificationChange,
  onCommentChange,
  onSubmit,
  onDiscard,
  onViewAttachment,
  onFileSelect,
  children,
}) {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
      tabIndex={-1}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            background: "#fff",
            maxWidth: 700,
            margin: "30px auto",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            padding: "20px",
            fontFamily: "Montserrat, Arial, sans-serif",
            textAlign: "center",
            position: "relative",
            minWidth: "500px",
          }}
        >
          <div className="upgrade-request-form">
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "22px",
                fontWeight: 700,
                color: "#484848",
                fontFamily: "Inter",
              }}
            >
              {title}
            </h2>

            {/* Plan Field */}
            <div className="form-section">
              <label style={mode === "create" ? { color: "#484848" } : {}}>
                Upgrade Plan to
              </label>
              <input
                style={mode === "create" ? { color: "#484848" } : {}}
                value={plan}
                onChange={onPlanChange}
                disabled={mode === "resubmit"}
              />
            </div>

            {/* Requester (view only) */}
            {mode === "view" && (
              <div className="form-section">
                <label>Request From</label>
                <input value={requester} disabled />
              </div>
            )}

            {/* Reject Justification (resubmit only) */}
            {mode === "resubmit" && (
              <div className="form-section">
                <label>Justification of Rejection</label>
                <textarea value={rejectJustification} disabled />
              </div>
            )}

            {/* Justification */}
            <div className="form-section">
              <label
                style={
                  mode === "create" || mode === "resubmit"
                    ? { color: "#484848" }
                    : {}
                }
              >
                Justification
              </label>
              <textarea
                style={
                  mode === "create" || mode === "resubmit"
                    ? { color: "#484848" }
                    : {}
                }
                value={justification}
                onChange={onJustificationChange}
              />
            </div>

            {/* Attachment */}
            <div className="form-section">
              <label
                style={
                  mode === "create" || mode === "resubmit"
                    ? { color: "#484848" }
                    : {}
                }
              >
                Attachment
              </label>
              <div
                className="attachment-row"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => onFileSelect(e.target.files[0])}
                  style={{ display: "none" }}
                  disabled={mode === "view"}
                  accept="image/*"
                />

                {/* Placeholder or File Name */}
                <span
                  style={{
                    color: attachment && mode !== "view" ? "#000" : "#B2B2B2",
                    fontSize: "14px",
                  }}
                >
                  {attachment?.name || attachment || "No file chosen"}
                </span>

                {mode === "view" ? (
                  <a onClick={onViewAttachment} style={{ cursor: "pointer" }}>
                    View
                  </a>
                ) : (
                  <span
                    onClick={handleIconClick}
                    style={{
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    📎
                  </span>
                )}
              </div>
            </div>

            {/* Comment (view only) */}
            {mode === "view" && (
              <div className="form-section" style={{ color: "#484848" }}>
                <label>Comment</label>
                <input
                  value={comment}
                  onChange={onCommentChange}
                  style={{ color: "#484848" }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="form-actions">
              {mode === "view" ? (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => onSubmit("approve")}
                  >
                    Approve Request
                  </button>
                  <button className="discard-btn" onClick={onDiscard}>
                    Discard Request
                  </button>
                </>
              ) : mode === "resubmit" ? (
                <button className="resubmit-btn" onClick={onSubmit}>
                  Resubmit Request
                </button>
              ) : (
                <button className="submit-btn" onClick={onSubmit}>
                  Submit Request
                </button>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}









import React, { useState } from "react";
import UpgradeRequestForm from "./UpgradeRequestForm";

function UpgradeRequestContainer({ showCreateRequest }) {
  const [formData, setFormData] = useState({
    plan: "Pro",
    justification: "",
    comment: "",
    attachment: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (action) => {
    try {
      const payload = {
        ...formData,
        rejectionReason: [],
        assignee_response: [],
      };

      // 👇 API call
      const res = await insertTaskList.get({
        ...payload,
        assigned_to: "ey_kranti.brid@maruti.co.in",
        deadline: null,
        priority: "low",
      });

      console.log("Submitted", action, payload);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {showCreateRequest && (
        <UpgradeRequestForm
          mode="create"
          title="Create Upgrade Request"
          plan={formData.plan}
          justification={formData.justification}
          comment={formData.comment}
          attachment={formData.attachment}
          onPlanChange={(e) => handleChange("plan", e.target.value)}
          onJustificationChange={(e) =>
            handleChange("justification", e.target.value)
          }
          onCommentChange={(e) => handleChange("comment", e.target.value)}
          onFileSelect={(file) => handleChange("attachment", file)}
          onSubmit={handleSubmit}
          onDiscard={() =>
            setFormData({ plan: "Pro", justification: "", comment: "", attachment: "" })
          }
        />
      )}
    </>
  );
}

export default UpgradeRequestContainer;


export default UpgradeRequestForm;
