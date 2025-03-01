interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  function Modal({ title, children, onClose, onConfirm }: ModalProps) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>{title}</h2>
          {children}
          <div className="modal-buttons">
            <button onClick={onClose}>Отмена</button>
            <button onClick={onConfirm} disabled={false}>Подтвердить</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Modal;