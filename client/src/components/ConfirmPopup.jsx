export default function ConfirmPopup({ open, text, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="popup" onClick={onCancel}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <p>{text}</p>
        <div className="modal-actions">
          <button className="ghost-btn" onClick={onCancel}>Cancel</button>
          <button className="danger-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
