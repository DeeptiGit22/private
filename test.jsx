✅ Update in UpgradeRequestForm.jsx

Modify the Attachment block:

{/* Attachment */}
<div className="form-section">
  <label>Attachment</label>
  <div
    className="attachment-row"
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      alignItems: "flex-start",
    }}
  >
    {/* Hidden file input */}
    <input
      type="file"
      ref={fileInputRef}
      multiple
      onChange={(e) => {
        Array.from(e.target.files).forEach(file => onFileSelect(file));
      }}
      style={{ display: "none" }}
      disabled={mode === "view"}
      accept="image/*,.pdf,.doc,.docx"
    />

    {Array.isArray(attachment) && attachment.length > 0 ? (
      attachment.map((file, idx) => (
        <div key={idx} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontSize: "14px", color: "#000" }}>
            {file.name || file}
          </span>
          {mode === "view" && (
            <a
              onClick={() => onViewAttachment(file.key)}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              View
            </a>
          )}
        </div>
      ))
    ) : (
      <span style={{ fontSize: "14px", color: "#B2B2B2" }}>No files chosen</span>
    )}

    {mode !== "view" && (
      <span onClick={handleIconClick} style={{ fontSize: "18px", cursor: "pointer" }}>
        📎
      </span>
    )}
  </div>
</div>

✅ Update in TaskList (test.jsx)

When you call /task/list-task-files, instead of appending to a div manually, store files in state:

const [upgradeFiles, setUpgradeFiles] = useState([]);


Inside the API response:

const res = await api.post('/task/list-task-files', { ...payload });
if (res?.data?.files) {
  setUpgradeFiles(res.data.files); // Save file list for UpgradeRequestForm
}


Then pass it into UpgradeRequestForm:

{showPlanReq && (
  <UpgradeRequestForm
    mode="view"
    title="Upgrade Request"
    plan={formData.plan}
    requester={formData.assigned_by}
    justification={formData.description}
    comment={upgradeComment}
    attachment={upgradeFiles}
    onViewAttachment={(fileKey) => viewFile(fileKey)}  // viewFile from your code
    onCommentChange={(e) => setUpgradeComment(e.target.value)}
    onClose={() => setShowPlanReq(false)}
    showClose={true}
    onSubmit={async () => {
      await uploadUpgradeFiles(formData.task);
      handleApproveReject(true);
      setShowPlanReq(false);
    }}
    onDiscard={() => handleApproveReject(false)}
    status={formData.status}
  />
)}

🔹 Result

Now when you open the Upgrade request modal:

Files from /list-task-files will be shown in the attachment section.

Each file will have a View link that opens it via your /task/get-file-url → viewFile(fileKey) logic.

If you’re in create/resubmit mode, you’ll still be able to upload new files.
