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
    loading,
    children,
    showClose,
    onClose
}) {
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
console.log(justification,requester,plan)
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
                    {/* Close Button */}
                    {showClose && <div
                        style={{ position: "absolute", top: 10, right: 20, fontSize: 28, color: "#333", cursor: "pointer", zIndex: 10 }}
                        onClick={onClose}
                        tabIndex={0}
                        aria-label="Close"
                        role="button"
                    >
                        ×
                    </div>}
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
                                name='plan'
                            />
                        </div>

                        {/* Requester (view only) */}
                        {mode === "view" && (
                            <div className="form-section">
                                <label>Request From</label>
                                <input value={requester} disabled name="assigned_by"/>
                            </div>
                        )}

                        {/* Reject Justification (resubmit only) */}
                        {mode === "resubmit" && (
                            <div className="form-section">
                                <label>Justification of Rejection</label>

                                <textarea  value={rejectJustification} disabled />
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
                                name="description"
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
                                    name='assignee_response'
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
                                        onClick={onSubmit}
                                    >
                                        Approve Request
                                    </button>
                                    <button className="discard-btn" onClick={onDiscard}>
                                        Discard Request
                                    </button>
                                </>
                            ) : mode === "resubmit" ? (
                                <button className="resubmit-btn" onClick={onSubmit}>
                                    {loading ? 'loading...' : 'Re-Submit Request'}
                                </button>
                            ) : (
                                <button className="submit-btn" onClick={onSubmit}>
                                    {loading ? 'loading...' : 'Submit Request'}
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

export default UpgradeRequestForm;
