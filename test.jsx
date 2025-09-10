{/* Comment (view or resubmit/create) */}
<div className="form-section" style={{ color: "#484848" }}>
  <label>Comment</label>
  <textarea
    value={comment}
    name='assignee_response'
    onChange={onCommentChange}
    style={{ color: "#484848" }}
    disabled={mode === "create"} // allow entry in view/resubmit
  />
</div>

{/* Attachment */}
<div className="form-section">
  <label>
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
      multiple
      ref={fileInputRef}
      onChange={(e) => {
        Array.from(e.target.files).forEach(file => onFileSelect(file));
      }}
      style={{ display: "none" }}
      disabled={mode === "view"}
      accept="image/*,.pdf,.doc,.docx"
    />

    {/* Placeholder or File Names */}
    <span style={{ fontSize: "14px" }}>
      {Array.isArray(attachment) && attachment.length > 0
        ? attachment.map(f => f.name || f).join(", ")
        : "No files chosen"}
    </span>

    {mode === "view" ? (
      <a onClick={onViewAttachment} style={{ cursor: "pointer" }}>
        View
      </a>
    ) : (
      <span onClick={handleIconClick} style={{ fontSize: "18px", cursor: "pointer" }}>
        📎
      </span>
    )}
  </div>
</div>





Update in index.jsx (TaskList)

Add state to track upgrade form inputs:

const [upgradeFiles, setUpgradeFiles] = useState([]);
const [upgradeComment, setUpgradeComment] = useState('');

{showPlanReq && (
  <UpgradeRequestForm
    mode="view"
    title="Upgrade Request"
    plan={formData.plan}
    requester={formData.assigned_by}
    justification={formData.description}
    comment={upgradeComment}
    attachment={upgradeFiles}
    onCommentChange={(e) => setUpgradeComment(e.target.value)}
    onFileSelect={handleUpgradeFileSelect}
    onClose={() => setShowPlanReq(false)}
    showClose={true}
    onSubmit={async () => {
      await uploadUpgradeFiles(formData.task);
      handleApproveReject(true);
    }}
    onDiscard={() => handleApproveReject(false)}
  />
)}
